import {createNonce, uintToInt} from "../utils/bin"
import {SHA1} from "../crypto/sha"
import {MessageProcessor} from "./MessageProcessor"

import AppConfiguration from "../../Config/AppConfiguration"
import {Networker} from "./Networker";
import Bytes from "../utils/bytes"
import Random from "../utils/random"
import MTProtoInternal from "../internal"
import TELEGRAM_CRYPTO from "../crypto/TELEGRAM_CRYPTO"
import TL from "../language/TL"
import Packer from "../language/Packer"

export class ApiNetworker extends Networker {
    constructor(auth, mtproto = false) {
        super(auth, mtproto)
        this.updates = this.auth.updates
        if (!mtproto) {
            this.init()
        }
    }

    init() {
        this.messageProcessor = new MessageProcessor({
            networker: this
        })

        this.auth.authKeyHash = SHA1(this.auth.authKey)
        this.auth.authKeyAux = this.auth.authKeyHash.slice(0, 8)
        this.auth.authKeyID = this.auth.authKeyHash.slice(-8)

        this.updates = this.auth.updates

        this.seqNo = 0
        this.connectionInited = false

        this.pings = new Map()

        this.initPings.bind(this)()
    }

    initPings() {
        this.checkConnection.bind(this)()
    }

    checkConnection() {
        if (this.mtproto) {
            return
        }

        if (this.pings.size > 1) { // Probably disconnected
            // TODO Show disconnection badge
        }

        const serializer = TL.packer()
        const pingID = [Random.nextInteger(0xFFFFFFFF), Random.nextInteger(0xFFFFFFFF)];

        serializer.method("ping", {
            ping_id: new Uint8Array(pingID)
        })

        const pingMessage = {
            msg_id: this.timeManager.generateMessageID(this.auth.dcID),
            seq_no: this.generateSeqNo(true),
            body: serializer.toUint8Array()
        };

        this.pings.set(pingMessage.msg_id, pingID)

        this.messageProcessor.listenPong(pingMessage.msg_id, l => {
            if (this.connected === false) {
                MTProtoInternal.connectionRestored()
            }

            this.pings.delete(pingMessage.msg_id)
        })

        this.sendMessage(pingMessage)
        setTimeout(this.checkConnection.bind(this), 1000)
    }

    processResponse(data) {
        if (this.mtproto) {
            return this.mtproto_processResponse(data)
        }

        let unpacker = TL.unpacker(data)

        const auth_key_id = unpacker.integer(64)

        if (!Bytes.compare(auth_key_id, this.auth.authKeyID)) {
            throw new Error(`bad server auth_key_id: ${Bytes.asHex(auth_key_id)}, dc id ${this.auth.dcID}`)
        }

        const msg_key = unpacker.integer(128)
        const encrypted_data = unpacker.rawBytes(data.byteLength - unpacker.offset)

        const decrypted = TELEGRAM_CRYPTO.decrypt_message(encrypted_data, this.auth.authKey, msg_key, 8)

        if (!Bytes.compare(msg_key, decrypted.msg_key)) {
            throw new Error("bad server msgKey")
        }

        unpacker = TL.unpacker(decrypted.bytes.buffer)

        const salt = unpacker.integer(64)
        const session_id = unpacker.integer(64)
        const message_id = unpacker.long()

        const seq_no = unpacker.int()

        const totalLength = decrypted.bytes.byteLength

        const message_data_length = unpacker.int()
        let offset = unpacker.offset

        if ((message_data_length % 4) || message_data_length > totalLength - offset) {
            throw new Error("bad body length: " + message_data_length)
        }

        const message_data = unpacker.rawBytes(message_data_length)

        offset = unpacker.offset
        const paddingLength = totalLength - offset
        if (paddingLength < 12 || paddingLength > 1024) {
            throw new Error("bad padding length: " + paddingLength)
        }

        const buffer = Bytes.asUint8Buffer(message_data)

        unpacker = TL.unpacker(buffer)

        let response = {}

        try {
            response = unpacker.object()
        } catch (e) {
            throw e
        }

        this.messageProcessor.process(response, message_id, session_id)
    }


    updateServerSalt(newSalt) {
        this.auth.serverSalt = newSalt
        MTProtoInternal.PermanentStorage.setItem("serverSalt" + this.auth.dcID, Bytes.asHex(newSalt)).then(() => {
            //
        })
    }

    onDisconnect() {
        MTProtoInternal.connectionLost()
        this.connected = false
    }

    onConnect() {
        MTProtoInternal.connectionRestored()
        this.connected = true
    }

    resendMessage(messageId) {

        if (!this.messageProcessor.sentMessages.has(messageId))
            throw new Error("Message to resend does not exist")
        this.sendMessage(this.messageProcessor.sentMessages.get(messageId))

        // idk, we should rewrite whole mtproto layer

        // console.warn("resending is not implemented")
        // return
        //
        // if (!this.messageProcessor.sentMessagesDebug.has(messageId)) {
        //     console.error("Message to resend does not exist")
        // } else {
        //     const m = this.messageProcessor.sentMessagesDebug.get(messageId)
        //     console.log('resending', m)
        //     this.invokeMethod(m._, m.params)
        //         .then(this.messageProcessor.rpcResultHandlers.get(messageId))
        //         .catch(this.messageProcessor.rpcErrorHandlers.get(messageId))
        // }
    }

    addHeader(message) {
        if (this.mtproto) {
            return this.mtproto_addHeader(message)
        }

        const data = new Packer({maxLength: message.body.length + 2048})

        data.integer(this.auth.serverSalt, 64, "salt")
        data.integer(this.auth.sessionID, 64, "session_id")

        data.long(message.msg_id, "message_id")
        data.int(message.seq_no, "seq_no")

        data.int(message.body.length, "message_data_length")
        data.rawBytes(message.body, "message_data")

        const dataBuffer = data.toBuffer()

        const paddingLength = (16 - (data.offset % 16)) + 16 * (1 + Random.nextInteger(5))
        const padding = createNonce(paddingLength)

        return Bytes.concatBuffer(dataBuffer, padding)

    }

    sendMessage(message) {
        if (this.mtproto) {
            return super.sendMessage(message)
        }

        this.messageProcessor.sentMessages.set(message.msg_id, message)

        const plaintext = this.addHeader(message)

        const encryptedResult = TELEGRAM_CRYPTO.encrypt_message(plaintext, this.auth.authKey)

        const request = new Packer({maxLength: encryptedResult.bytes.byteLength + 256})
        request.integer(this.auth.authKeyID, 64, "auth_key_id")
        request.integer(encryptedResult.msg_key, 128, "msg_key")
        request.rawBytes(encryptedResult.bytes, "encrypted_data")

        return super.sendMessage(request.toBuffer())

    }

    invokeMethod(method, params, options = {}) {
        if (this.mtproto) {
            return this.mtproto_invokeMethod(method, params, options)
        }

        // const serializer = new TLSerialization(options)
        const packer = new Packer(options)

        if (!this.connectionInited) {
            // TODO replace with const values

            // serializer.storeInt(AppConfiguration.mtproto.api.invokeWithLayer, "invokeWithLayer")
            packer.int(AppConfiguration.mtproto.api.invokeWithLayer, "invokeWithLayer")
            // serializer.storeInt(AppConfiguration.mtproto.api.layer, "layer")
            packer.int(AppConfiguration.mtproto.api.layer, "layer")
            if (this.updates === false) {
                // serializer.storeInt(AppConfiguration.mtproto.api.invokeWithoutUpdates, "invokeWithoutUpdates")
                packer.int(AppConfiguration.mtproto.api.invokeWithoutUpdates, "invokeWithoutUpdates")
            }
            // serializer.storeInt(AppConfiguration.mtproto.api.initConnection, "initConnection")
            packer.int(AppConfiguration.mtproto.api.initConnection, "initConnection")
            // serializer.storeInt(AppConfiguration.mtproto.api.api_id, "api_id")
            packer.int(AppConfiguration.mtproto.api.api_id, "api_id")
            // serializer.storeString(navigator.userAgent || "Unknown UserAgent", "device_model")
            packer.string(navigator.userAgent || "Unknown UserAgent", "device_model")
            // serializer.storeString(navigator.platform || "Unknown Platform", "system_version")
            packer.string(navigator.platform || "Unknown Platform", "system_version")
            // serializer.storeString(AppConfiguration.mtproto.api.app_version, "app_version")
            packer.string(AppConfiguration.mtproto.api.app_version, "app_version")
            // serializer.storeString(navigator.language || "en", "system_lang_code")
            packer.string(navigator.language || "en", "system_lang_code")
            // serializer.storeString("", "lang_pack")
            packer.string("", "lang_pack")
            // serializer.storeString(navigator.language || "en", "lang_code")
            packer.string(navigator.language || "en", "lang_code")
            // TODO init connection
        }

        // if (options.afterMessageID) {
        //     serializer.storeInt(0xcb9f372d, "invokeAfterMsg")
        //     serializer.storeLong(options.afterMessageID, "msg_id")
        // }

        // options.resultType = serializer.storeMethod(method, params)
        options.resultType = packer.method(method, params)

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const seqNo = this.generateSeqNo()
        const message = {
            msg_id: messageID,
            seq_no: seqNo,
            body: packer.toUint8Array(),
            isAPI: true
        }


        this.messageProcessor.sentMessagesDebug.set(messageID, {
            _: method,
            params: params
        })

        return new Promise((resolve, reject) => {
            this.messageProcessor.listenRpc(message.msg_id, resolve, reject)
            this.sendMessage(message, options)
        })
    }

    // todo: doto
    resendReq(msg_ids = []) {
        if (msg_ids.length > 0) {
            console.warn("resending", msg_ids)
            this.invokeMethod("msg_resend_req", {
                msg_ids
            }, {mtproto: true}).then(MsgResendReq => {
                console.log("resent", MsgResendReq)
            })
            // if (this.messageProcessor.sentMessages.has(msg_id)) {
            // }
        }
    }


    generateSeqNo(notContentRelated) {
        let seqNo = this.seqNo * 2

        if (!notContentRelated) {
            seqNo++
            this.seqNo++
        }

        return seqNo
    }

    processError(rawError) {
        const matches = (rawError.error_message || "").match(/^([A-Z_0-9]+\b)(: (.+))?/) || []
        rawError.error_code = uintToInt(rawError.error_code)

        return {
            code: !rawError.error_code || rawError.error_code <= 0 ? 500 : rawError.error_code,
            type: matches[1] || "UNKNOWN",
            description: matches[3] || ("CODE#" + rawError.error_code + " " + rawError.error_message),
            originalError: rawError
        }
    }

    ackMessage(msgID) {
        this.sendMessage(this.wrapMtpMessage({_: "msgs_ack", msg_ids: [msgID]}))
    }

    wrapMtpMessage(object) {
        const serializer = TL.packer()
        serializer.object(object, "Object")

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const seqNo = this.generateSeqNo(true)

        //console.log("MT message", object, messageID, seqNo)

        return {
            msg_id: messageID,
            seq_no: seqNo,
            body: serializer.toUint8Array()
        }
    }
}
