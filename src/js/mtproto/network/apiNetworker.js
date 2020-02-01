import {createNonce, longToBytes, uintToInt} from "../utils/bin"
import {sha1BytesSync, sha256HashSync} from "../crypto/sha"
import {TLSerialization} from "../language/serialization"
import {TLDeserialization} from "../language/deserialization"
import {MessageProcessor} from "./messageProcessor"

import AppConfiguration from "../../configuration"
import {Networker} from "./networker";
import {schema} from "../language/schema";
import Bytes from "../utils/bytes"
import Random from "../utils/random"
import AppEvents from "../../api/eventBus/AppEvents"
import {aesDecryptSync, aesEncryptSync} from "../crypto/aes"
import MTProtoInternal from "../internal"

export class ApiNetworker extends Networker {
    constructor(auth) {
        super(auth)
        this.messageProcessor = new MessageProcessor({
            networker: this
        })

        auth.authKeyHash = sha1BytesSync(auth.authKey)
        auth.authKeyAux = auth.authKeyHash.slice(0, 8)
        auth.authKeyID = auth.authKeyHash.slice(-8)

        this.updates = auth.updates

        this.seqNo = 0
        this.connectionInited = false

        this.pings = new Map()

        this.self = this

        this.initPings.bind(this)()
    }

    initPings() {
        this.checkConnection.bind(this)()
    }

    checkConnection() {
        if (this.pings.size > 1) { // Probably disconnected
            // TODO Show disconnection badge
        }

        const serializer = new TLSerialization();
        const pingID = [Random.nextInteger(0xFFFFFFFF), Random.nextInteger(0xFFFFFFFF)];

        serializer.storeMethod("ping", {ping_id: pingID})

        const pingMessage = {
            msg_id: this.timeManager.generateMessageID(this.auth.dcID),
            seq_no: this.generateSeqNo(true),
            body: serializer.getBytes()
        };

        this.pings.set(pingMessage.msg_id, pingID)

        this.messageProcessor.listenPong(pingMessage.msg_id, l => {
            if (this.connected === false) {
                AppEvents.General.fire("connectionRestored")
            }
            this.pings.delete(pingMessage.msg_id)

        })

        this.sendMessage(pingMessage)

        setTimeout(this.checkConnection.bind(this), 5000)

    }

    processResponse(data) {
        let deserializer = new TLDeserialization(data)

        const authKeyID = deserializer.fetchIntBytes(64, false, "auth_key_id")

        if (!Bytes.compare(authKeyID, this.auth.authKeyID)) {
            throw new Error(`bad server auth_key_id: ${Bytes.asHex(authKeyID)}, dc id ${this.auth.dcID}`)
        }

        const msgKey = deserializer.fetchIntBytes(128, true, "msg_key")
        const encryptedData = deserializer.fetchRawBytes(data.byteLength - deserializer.getOffset(), true, "encrypted_data")

        this.getDecryptedMessage(msgKey, encryptedData).then(async dataWithPadding => {
            dataWithPadding = new Uint8Array(dataWithPadding)

            const calcMsgKey = this.getMsgKey(dataWithPadding, false)
            if (!Bytes.compare(msgKey, calcMsgKey)) {
                throw new Error("bad server msgKey")
            }

            deserializer = new TLDeserialization(dataWithPadding.buffer, {mtproto: true})

            const salt = deserializer.fetchIntBytes(64, false, "salt") // ??
            const sessionID = deserializer.fetchIntBytes(64, false, "session_id")
            const messageID = deserializer.fetchLong("message_id")

            const seqNo = deserializer.fetchInt("seq_no")

            const totalLength = dataWithPadding.byteLength

            const messageBodyLength = deserializer.fetchInt("message_data[length]")
            let offset = deserializer.getOffset()

            if ((messageBodyLength % 4) ||
                messageBodyLength > totalLength - offset) {
                throw new Error("bad body length: " + messageBodyLength)
            }

            const messageBody = deserializer.fetchRawBytes(messageBodyLength, true, "message_data")

            offset = deserializer.getOffset()
            const paddingLength = totalLength - offset
            if (paddingLength < 12 || paddingLength > 1024) {
                throw new Error("bad padding length: " + paddingLength)
            }

            const buffer = Bytes.asUint8Buffer(messageBody)

            const self = this

            const deserializerOptions = {
                mtproto: true,
                schema: schema,
                override: {
                    mt_rpc_result: function (result, field) {
                        result.req_msg_id = this.fetchLong(`${field}[req_msg_id]`)

                        const sentMessage = self.messageProcessor.sentMessages.get(result.req_msg_id)
                        const type = sentMessage && sentMessage.resultType || "Object"

                        if (result.req_msg_id && !sentMessage) {
                            return
                        }

                        result.result = this.fetchObject(type, `${field}[result]`)
                    }
                }
            }

            deserializer = new TLDeserialization(buffer, deserializerOptions)

            let response = {}

            try {
                response = deserializer.fetchObject("", "INPUT")
            } catch (e) {
                throw e
            }

            this.messageProcessor.process(response, messageID, sessionID)
        })
    }


    updateServerSalt(newSalt) {
        this.auth.serverSalt = newSalt
        MTProtoInternal.PermanentStorage.setItem("serverSalt" + this.auth.dcID, Bytes.asHex(newSalt)).then(() => {
            //
        })
    }

    getMsgKey(dataWithPadding, isOut) {
        const authKey = this.auth.authKey
        const x = isOut ? 0 : 8
        const msgKeyLargePlain = Bytes.concatBuffer(authKey.subarray(88 + x, 88 + x + 32), dataWithPadding)

        const msgKeyLarge = sha256HashSync(msgKeyLargePlain)

        return new Uint8Array(msgKeyLarge).subarray(8, 24)
    }

    onDisconnect() {
        AppEvents.General.fire("connectionLost")
        // TODO reconnect
        // ALSO if there"s no internet it doesn"t disconnect ws, should ping prob
        this.connected = false
    }

    onConnect() {
        AppEvents.General.fire("connectionRestored")
        this.connected = true
    }

    getAesKeyIv(msgKey, isOut) {
        const authKey = this.auth.authKey
        const x = isOut ? 0 : 8
        const sha2aText = new Uint8Array(52)
        const sha2bText = new Uint8Array(52)

        sha2aText.set(msgKey, 0)
        sha2aText.set(authKey.subarray(x, x + 36), 16)
        const sha2a = new Uint8Array(sha256HashSync(sha2aText))

        sha2bText.set(authKey.subarray(40 + x, 40 + x + 36), 0)
        sha2bText.set(msgKey, 36)
        const sha2b = new Uint8Array(sha256HashSync(sha2bText))

        const aesKey = new Uint8Array(32)
        const aesIv = new Uint8Array(32)

        aesKey.set(sha2a.subarray(0, 8))
        aesKey.set(sha2b.subarray(8, 24), 8)
        aesKey.set(sha2a.subarray(24, 32), 24)

        aesIv.set(sha2b.subarray(0, 8))
        aesIv.set(sha2a.subarray(8, 24), 8)
        aesIv.set(sha2b.subarray(24, 32), 24)

        return [aesKey, aesIv]
    }

    getEncryptedMessage(dataWithPadding) {
        const msgKey = this.getMsgKey(dataWithPadding, true)
        const keyIv = this.getAesKeyIv(msgKey, true)

        const encryptedBytes = aesEncryptSync(dataWithPadding, keyIv[0], keyIv[1])


        return Promise.resolve({
            bytes: encryptedBytes,
            msgKey: msgKey
        })
    }

    resendMessage(messageId) {
        if (!this.messageProcessor.sentMessages.has(messageId))
            throw new Error("Message to resend does not exist")
        this.sendMessage(this.messageProcessor.sentMessages.get(messageId))
    }

    addHeader(message) {
        const data = new TLSerialization({startMaxLength: message.body.length + 2048})

        data.storeIntBytes(this.auth.serverSalt, 64, "salt")
        data.storeIntBytes(this.auth.sessionID, 64, "session_id")

        data.storeLong(message.msg_id, "message_id")
        data.storeInt(message.seq_no, "seq_no")

        data.storeInt(message.body.length, "message_data_length")
        data.storeRawBytes(message.body, "message_data")

        const dataBuffer = data.getBuffer()

        const paddingLength = (16 - (data.offset % 16)) + 16 * (1 + Random.nextInteger(5))
        const padding = createNonce(paddingLength) // TODO check if secure

        // console.log(dT(), "Adding padding", dataBuffer, padding, dataWithPadding)
        // console.log(dT(), "auth_key_id", Bytes.asHex(self.authKeyID))
        return Bytes.concatBuffer(dataBuffer, padding)
    }

    sendMessage(message) {
        this.messageProcessor.sentMessages.set(message.msg_id, message)

        const dataWithPadding = this.addHeader(message)

        return this.getEncryptedMessage(dataWithPadding).then(encryptedResult => {
            const request = new TLSerialization({startMaxLength: encryptedResult.bytes.byteLength + 256})
            request.storeIntBytes(this.auth.authKeyID, 64, "auth_key_id")
            request.storeIntBytes(encryptedResult.msgKey, 128, "msg_key")
            request.storeRawBytes(encryptedResult.bytes, "encrypted_data")

            super.sendMessage(request.getBuffer())
        })
    }

    getDecryptedMessage(msgKey, encryptedData) {
        const keyIv = this.getAesKeyIv(msgKey, false)
        return Promise.resolve(new Uint8Array(aesDecryptSync(encryptedData, keyIv[0], keyIv[1])))
    }

    invokeMethod(method, params, options = {}) {
        const serializer = new TLSerialization(options)

        if (!this.connectionInited) {
            // TODO replace with const values

            serializer.storeInt(AppConfiguration.mtproto.api.invokeWithLayer, "invokeWithLayer")
            serializer.storeInt(AppConfiguration.mtproto.api.layer, "layer")
            if (this.updates === false) {
                serializer.storeInt(AppConfiguration.mtproto.api.invokeWithoutUpdates, "invokeWithoutUpdates")
            }
            serializer.storeInt(AppConfiguration.mtproto.api.initConnection, "initConnection")
            serializer.storeInt(AppConfiguration.mtproto.api.api_id, "api_id")
            serializer.storeString(navigator.userAgent || "Unknown UserAgent", "device_model")
            serializer.storeString(navigator.platform || "Unknown Platform", "system_version")
            serializer.storeString(AppConfiguration.mtproto.api.app_version, "app_version")
            serializer.storeString(navigator.language || "en", "system_lang_code")
            serializer.storeString("", "lang_pack")
            serializer.storeString(navigator.language || "en", "lang_code")
            // TODO init connection
        }

        // if (options.afterMessageID) {
        //     serializer.storeInt(0xcb9f372d, "invokeAfterMsg")
        //     serializer.storeLong(options.afterMessageID, "msg_id")
        // }

        options.resultType = serializer.storeMethod(method, params)

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const seqNo = this.generateSeqNo()
        const message = {
            msg_id: messageID,
            seq_no: seqNo,
            body: serializer.getBytes(true),
            isAPI: true
        }
        this.messageProcessor.sentMessagesDebug.set(messageID, {
            _: method,
            params: params
        })


        //// Logger.debug("Api call", method, params, messageID, seqNo, options)
        // Logger.debug("Api call", method, params)

        return new Promise((resolve, reject) => {
            this.messageProcessor.listenRpc(message.msg_id, resolve, reject)
            this.sendMessage(message, options)
        })
    }


    generateSeqNo(notContentRelated) {
        let seqNo = this.seqNo * 2

        if (!notContentRelated) {
            seqNo++
            this.seqNo++
        }

        return seqNo
    }


    applyServerSalt(newServerSalt) {
        const serverSalt = longToBytes(newServerSalt);

        MTProtoInternal.PermanentStorage.setItem(`dc${this.dcID}_server_salt`, Bytes.asHex(serverSalt)).then(() => {

        })

        this.serverSalt = serverSalt
        return true
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
        return this.sendMessage(this.wrapMtpMessage({_: "msgs_ack", msg_ids: [msgID]}))
    }

    wrapMtpMessage(object) {
        const serializer = new TLSerialization({mtproto: true})
        serializer.storeObject(object, "Object")

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const seqNo = this.generateSeqNo(true)

        //console.log("MT message", object, messageID, seqNo)

        return {
            msg_id: messageID,
            seq_no: seqNo,
            body: serializer.getBytes()
        }
    }


}
