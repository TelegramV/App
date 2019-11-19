import {Networker} from "./networker";
import {TLSerialization} from "../language/serialization";
import TimeManager from "../timeManager";
import DataCenter from "../dataCenter";
import {mt_ws_set_processor, mt_ws_transport} from "./mt_ws_transport";
import {TLDeserialization} from "../language/deserialization";
import AppConfiguration from "../../configuration";
import {createLogger} from "../../common/logger";

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

        const messageID = this.timeManager.generateMessageID()
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

        this.handler(deserializer)
    }
}