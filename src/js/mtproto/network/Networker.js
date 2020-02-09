import {TimeManager} from "../timeManager";
import DataCenter from "../dataCenter";
import {MTSocket} from "./MTSocket"

export class Networker {
    constructor(auth) {
        this.timeManager = TimeManager

        this.auth = auth
        this.dcUrl = DataCenter.chooseServer(this.auth.dcID)

        this.socket = new MTSocket({
            networker: this
        })
    }

    onDisconnect() {

    }

    onConnect() {

    }

    sendMessage(message) {
        this.socket.transport(message)
        // mt_ws_transport(this.dcUrl, message)
    }

    addHeader(message) {
        throw new Error("Not implemented yet")
    }

    processResponse(data) {
        throw new Error("Not implemented yet")
    }
}
