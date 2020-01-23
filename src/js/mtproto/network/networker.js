import {TimeManager} from "../timeManager";
import {
    mt_set_connect_processor,
    mt_set_disconnect_processor,
    mt_ws_set_processor,
    mt_ws_transport
} from "./mt_ws_transport";
import DataCenter from "../dataCenter";

export class Networker {
    constructor(auth) {
        this.timeManager = TimeManager

        this.auth = auth
        this.dcUrl = DataCenter.chooseServer(this.auth.dcID)

        mt_set_disconnect_processor(this.onDisconnect, this.dcUrl)
        mt_set_connect_processor(this.onConnect, this.dcUrl)

        mt_ws_set_processor(data_buffer => {
            if (data_buffer.byteLength <= 4) {
                //some another protocol violation here
                throw new Error("404?? " + this.auth.dcID)
            }
            this.processResponse(data_buffer)
            //this.messageProcessor.process(response.response, response.messageID, response.sessionID)
        }, this, this.dcUrl)
    }

    onDisconnect() {

    }

    onConnect() {

    }

    sendMessage(message) {
        mt_ws_transport(this.dcUrl, message)
    }

    addHeader(message) {
        throw new Error("Not implemented yet")
    }

    processResponse(data) {
        throw new Error("Not implemented yet")
    }
}
