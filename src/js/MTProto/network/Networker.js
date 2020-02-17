import {TimeManager} from "../timeManager";
import DataCenter from "../dataCenter";
import {MTSocket} from "./MTSocket"
import {TLSerialization} from "../language/serialization"
import {TLDeserialization} from "../language/deserialization"

export class Networker {
    constructor(auth, mtproto = false) {
        this.timeManager = TimeManager

        this.auth = auth
        this.dcUrl = DataCenter.chooseServer(this.auth.dcID)

        this.mtproto = mtproto

        this.socket = new MTSocket({
            networker: this
        })
    }


    mtproto_addHeader(message) {
        if (!this.mtproto) {
            console.error("fuck")
            return
        }
        const requestLength = message.body.byteLength

        const serializer = new TLSerialization()
        serializer.storeLongP(0, 0, "auth_key_id")
        serializer.storeLong(message.msg_id, "msg_id")
        serializer.storeInt(requestLength, "request_length")
        serializer.storeRawBytes(message.body, "request_body")

        return serializer.getBuffer()
    }


    mtproto_invokeMethod(method, params, options = {}) {
        if (!this.mtproto) {
            console.error("fuck")
            return
        }
        const serializer = new TLSerialization(options)

        options.resultType = serializer.storeMethod(method, params)

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const message = {
            msg_id: messageID,
            body: serializer.getBuffer(),
            isAPI: false
        }

        console.debug("MTProto call", method, params)

        this.sendMessage(message)

        return new Promise(resolve => {
            this.handler = resolve
        })
    }

    mtproto_processResponse(data) {
        if (!this.mtproto) {
            console.error("fuck")
            return
        }
        const deserializer = new TLDeserialization(data, {mtproto: true})
        const auth_key_id = deserializer.fetchLong("auth_key_id")
        const msg_id = deserializer.fetchLong("msg_id")
        const msg_len = deserializer.fetchInt("msg_len")
        console.debug("Response")

        this.handler(deserializer)
    }

    onDisconnect() {

    }

    onConnect() {

    }

    sendMessage(message) {
        if (this.mtproto) {
            this.socket.transport(this.mtproto_addHeader(message))
        } else {
            this.socket.transport(message)
        }
    }

    addHeader(message) {
        throw new Error("Not implemented yet")
    }

    processResponse(data) {
        throw new Error("Not implemented yet")
    }
}
