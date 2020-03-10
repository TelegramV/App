import {TimeManager} from "../timeManager";
import DataCenter from "../dataCenter";
import {MTSocket} from "./MTSocket"
import TL from "../language/TL"

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
        const request_length = message.body.byteLength

        const serializer = TL.packer()
        serializer.int(0)
        serializer.int(0)
        serializer.long(message.msg_id)
        serializer.int(request_length)
        serializer.rawBytes(message.body)

        return serializer.toBuffer()
    }


    mtproto_invokeMethod(method, params, options = {}) {
        if (!this.mtproto) {
            console.error("fuck")
            return
        }

        console.debug("invoking", method, params)

        const serializer = TL.packer()

        options.resultType = serializer.method(method, params)

        const messageID = this.timeManager.generateMessageID(this.auth.dcID)
        const message = {
            msg_id: messageID,
            body: serializer.toBuffer(),
            isAPI: false
        }

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
        const deserializer = TL.unpacker(data)
        const auth_key_id = deserializer.long()
        const msg_id = deserializer.long()
        const msg_len = deserializer.int()

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
