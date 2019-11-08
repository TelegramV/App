import {
    bufferConcat,
    bytesCmp,
    bytesFromArrayBuffer,
    bytesToArrayBuffer,
    bytesToHex,
    createNonce,
    nextRandomInt
} from "../utils/bin";
import {sha1BytesSync, sha256HashSync} from "../crypto/sha";
import {aesDecryptSync, aesEncryptSync} from "../crypto/aes";
import {TLSerialization} from "../language/serialization";
import DataCenter from "../dataCenter";
import axios from "axios";
import {MtpTimeManager} from "../timeManager";
import {createLogger} from "../../common/logger";
import {TLDeserialization} from "../language/deserialization";

const Logger = createLogger("Networker")

export class Networker {
    constructor(auth) {
        this.timeManager = new MtpTimeManager()
        this.sentMessages = {}

        auth.authKeyHash = sha1BytesSync(auth.authKey)
        auth.authKeyAux = auth.authKeyHash.slice(0, 8)
        auth.authKeyID = auth.authKeyHash.slice(-8)

        this.auth = auth
        this.seqNo = 0
        this.connectionInited = false
    }

    getMsgKey(dataWithPadding, isOut) {
        const authKey = this.auth.authKey;
        const x = isOut ? 0 : 8;
        const msgKeyLargePlain = bufferConcat(authKey.subarray(88 + x, 88 + x + 32), dataWithPadding);
        // TODO async hash
        const msgKeyLarge = sha256HashSync(msgKeyLargePlain);
        return new Uint8Array(msgKeyLarge).subarray(8, 24)
    }

    getAesKeyIv(msgKey, isOut) {
        const authKey = this.auth.authKey;
        const x = isOut ? 0 : 8;
        const sha2aText = new Uint8Array(52);
        const sha2bText = new Uint8Array(52);

        sha2aText.set(msgKey, 0)
        sha2aText.set(authKey.subarray(x, x + 36), 16)
        const sha2a = new Uint8Array(sha256HashSync(sha2aText))

        sha2bText.set(authKey.subarray(40 + x, 40 + x + 36), 0)
        sha2bText.set(msgKey, 36)
        const sha2b = new Uint8Array(sha256HashSync(sha2bText))

        const aesKey = new Uint8Array(32);
        const aesIv = new Uint8Array(32);

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
        // TODO async
        const encryptedBytes = aesEncryptSync(dataWithPadding, keyIv[0], keyIv[1])
        return {
            bytes: encryptedBytes,
            msgKey: msgKey
        }
    }

    sendEncryptedRequest(message) {
        // console.log(dT(), 'Send encrypted'/*, message*/)
        // console.trace()
        this.sentMessages[message.msg_id] = message

        const data = new TLSerialization({startMaxLength: message.body.length + 2048});

        data.storeIntBytes(this.auth.serverSalt, 64, 'salt')
        data.storeIntBytes(this.auth.sessionID, 64, 'session_id')

        data.storeLong(message.msg_id, 'message_id')
        data.storeInt(message.seq_no, 'seq_no')

        data.storeInt(message.body.length, 'message_data_length')
        data.storeRawBytes(message.body, 'message_data')

        const dataBuffer = data.getBuffer();

        const paddingLength = (16 - (data.offset % 16)) + 16 * (1 + nextRandomInt(5));
        const padding = createNonce(paddingLength); // TODO check if secure

        const dataWithPadding = bufferConcat(dataBuffer, padding);
        // console.log(dT(), 'Adding padding', dataBuffer, padding, dataWithPadding)
        // console.log(dT(), 'auth_key_id', bytesToHex(self.authKeyID))

        const encryptedResult = this.getEncryptedMessage(dataWithPadding);
        // console.log(dT(), 'Got encrypted out message'/*, encryptedResult*/)
        const request = new TLSerialization({startMaxLength: encryptedResult.bytes.byteLength + 256});
        request.storeIntBytes(this.auth.authKeyID, 64, 'auth_key_id')
        request.storeIntBytes(encryptedResult.msgKey, 128, 'msg_key')
        request.storeRawBytes(encryptedResult.bytes, 'encrypted_data')

        // TODO xhrSendBuffer
        const requestData = true ? request.getBuffer() : request.getArray();

        let requestPromise;
        const url = DataCenter.chooseServer(this.auth.dcID);
        const baseError = {code: 406, type: 'NETWORK_BAD_RESPONSE', url: url};

        return axios.post(url, requestData, {
            responseType: "arraybuffer",
            transformRequest: null
        })
    }

    getDecryptedMessage(msgKey, encryptedData) {
        const keyIv = this.getAesKeyIv(msgKey, false)
        return new Uint8Array(aesDecryptSync(encryptedData, keyIv[0], keyIv[1]))
    }

    parseResponse(responseBuffer) {
        let deserializer = new TLDeserialization(responseBuffer);

        const authKeyID = deserializer.fetchIntBytes(64, false, 'auth_key_id');
        if (!bytesCmp(authKeyID, this.auth.authKeyID)) {
            throw new Error('[MT] Invalid server auth_key_id: ' + bytesToHex(authKeyID))
        }
        const msgKey = deserializer.fetchIntBytes(128, true, 'msg_key');
        const encryptedData = deserializer.fetchRawBytes(responseBuffer.byteLength - deserializer.getOffset(), true, 'encrypted_data');

        const dataWithPadding = new Uint8Array(this.getDecryptedMessage(msgKey, encryptedData))

        const calcMsgKey = this.getMsgKey(dataWithPadding, false)
        if (!bytesCmp(msgKey, calcMsgKey)) {
            Logger.warn('[MT] msg_keys', msgKey, bytesFromArrayBuffer(calcMsgKey))
            throw new Error('[MT] server msgKey mismatch')
        }

        deserializer = new TLDeserialization(dataWithPadding.buffer, {mtproto: true})

        const salt = deserializer.fetchIntBytes(64, false, 'salt');
        const sessionID = deserializer.fetchIntBytes(64, false, 'session_id');
        const messageID = deserializer.fetchLong('message_id');

        // TODO wtf?
        if (!bytesCmp(sessionID, this.auth.sessionID) &&
            (!self.prevSessionID || !bytesCmp(sessionID, self.prevSessionID))) {
            Logger.warn('Sessions', sessionID, self.sessionID, self.prevSessionID)
            throw new Error('[MT] Invalid server session_id: ' + bytesToHex(sessionID))
        }

        const seqNo = deserializer.fetchInt('seq_no');

        const totalLength = dataWithPadding.byteLength;

        const messageBodyLength = deserializer.fetchInt('message_data[length]');
        let offset = deserializer.getOffset()

        if ((messageBodyLength % 4) ||
            messageBodyLength > totalLength - offset) {
            throw new Error('[MT] Invalid body length: ' + messageBodyLength)
        }
        const messageBody = deserializer.fetchRawBytes(messageBodyLength, true, 'message_data');

        offset = deserializer.getOffset()
        const paddingLength = totalLength - offset;
        if (paddingLength < 12 || paddingLength > 1024) {
            throw new Error('[MT] Invalid padding length: ' + paddingLength)
        }

        const buffer = bytesToArrayBuffer(messageBody);
        const self = this
        const deserializerOptions = {
            mtproto: true,
            override: {
                mt_message: function (result, field) {
                    result.msg_id = this.fetchLong(field + '[msg_id]')
                    result.seqno = this.fetchInt(field + '[seqno]')
                    result.bytes = this.fetchInt(field + '[bytes]')

                    const offset = this.getOffset();

                    try {
                        result.body = this.fetchObject('Object', field + '[body]')
                    } catch (e) {
                        //console.error(dT(), 'parse error', e.message, e.stack)
                        result.body = {_: 'parse_error', error: e}
                    }
                    // TODO wtf кастыли кокие-то
                    if (this.offset != offset + result.bytes) {
                        // console.warn(dT(), 'set offset', this.offset, offset, result.bytes)
                        // console.log(dT(), result)
                        this.offset = offset + result.bytes
                    }
                    // console.log(dT(), 'override message', result)
                },
                // TODO
                mt_rpc_result: function (result, field) {
                    console.log("mt_rpc_result", result, field)
                    console.log(self.sentMessages)
                    result.req_msg_id = this.fetchLong(field + '[req_msg_id]')

                    const sentMessage = self.sentMessages[result.req_msg_id];
                    const type = sentMessage && sentMessage.resultType || 'Object';

                    if (result.req_msg_id && !sentMessage) {
                        // console.warn(dT(), 'Result for unknown message', result)
                        return
                    }
                    console.log(result)
                    console.log(bytesToHex(this.getLeftoverArray()))
                    this.schema = require("../language/schema_api") // TODO кастыли убери окда)
                    result.result = this.fetchObject(type, field + '[result]')
                    this.schema = require("../language/schema")

                    // console.log(dT(), 'override rpc_result', sentMessage, type, result)
                }
            }
        };
        deserializer = new TLDeserialization(buffer, deserializerOptions)
        const response = deserializer.fetchObject('', 'INPUT');

        return {
            response: response,
            messageID: messageID,
            sessionID: sessionID,
            seqNo: seqNo
        }
    }

    sendMessage(message) {
        message.msg_id = this.timeManager.generateMessageID()
        this.sendEncryptedRequest(message).then(result => {
            const response = this.parseResponse(result.data)
            Logger.log("result:", response)
        })
    }

    wrapApiCall(method, params, options) {
        const serializer = new TLSerialization(options);

        if (!this.connectionInited) {
            // TODO replace with const values

            serializer.storeInt(0xda9b0d0d, 'invokeWithLayer')
            serializer.storeInt(105, 'layer')
            serializer.storeInt(0xc7481da6, 'initConnection')
            serializer.storeInt(1147988, 'api_id')
            serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model')
            serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version')
            serializer.storeString("1.4.8.8", 'app_version')
            serializer.storeString(navigator.language || 'en', 'system_lang_code')
            serializer.storeString('', 'lang_pack')
            serializer.storeString(navigator.language || 'en', 'lang_code')
            // TODO init connection
        }

        // if (options.afterMessageID) {
        //     serializer.storeInt(0xcb9f372d, 'invokeAfterMsg')
        //     serializer.storeLong(options.afterMessageID, 'msg_id')
        // }

        options.resultType = serializer.storeMethod(method, params)

        const messageID = this.timeManager.generateMessageID();
        const seqNo = this.generateSeqNo();
        const message = {
            msg_id: messageID,
            seq_no: seqNo,
            body: serializer.getBytes(true),
            isAPI: true
        };

        Logger.debug("Api call", method, params, messageID, seqNo, options)

        return message
    }


    generateSeqNo(notContentRelated) {
        let seqNo = this.seqNo * 2;

        if (!notContentRelated) {
            seqNo++
            this.seqNo++
        }

        return seqNo
    }
}