/**
 * (c) Telegram V
 * (c) webogram
 */

import {Networker} from "./Networker";
import {TLSerialization} from "../language/serialization";
import {TLDeserialization} from "../language/deserialization";
import {createLogger} from "../../api/common/logger";

const Logger = createLogger("MTProtoNetworker")

export class MTProtoNetworker extends Networker {

    handler

    constructor(authContext) {
        super(authContext)
    }

    addHeader(message) {
        const requestLength = message.body.byteLength

        const serializer = new TLSerialization()
        serializer.storeLongP(0, 0, "auth_key_id")
        serializer.storeLong(message.msg_id, "msg_id")
        serializer.storeInt(requestLength, "request_length")
        serializer.storeRawBytes(message.body, "request_body")

        return serializer.getBuffer()
    }

    invokeMethod(method, params, options = {}) {
        const serializer = new TLSerialization(options)

        options.resultType = serializer.storeMethod(method, params)

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const message = {
            msg_id: messageID,
            body: serializer.getBuffer(),
            isAPI: false
        }

        Logger.debug("MTProto call", method, params)

        this.sendMessage(message)

        return new Promise(resolve => {
            this.handler = resolve
        })
    }

    sendMessage(message) {
        super.sendMessage(this.addHeader(message));
    }

    processResponse(data) {
        const deserializer = new TLDeserialization(data, {mtproto: true})
        const auth_key_id = deserializer.fetchLong("auth_key_id")
        const msg_id = deserializer.fetchLong("msg_id")
        const msg_len = deserializer.fetchInt("msg_len")
        Logger.debug("Response")

        this.handler(deserializer)
    }
}