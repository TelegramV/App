import {createLogger} from "../../common/logger";
import {ApiNetworker} from "./apiNetworker";
import {
    mt_file_set_connect_processor,
    mt_file_set_disconnect_processor,
    mt_file_ws_set_processor, mt_file_ws_transport
} from "./mt_ws_file_transport"
import {MessageProcessor} from "./messageProcessor"
import {mt_ws_transport} from "./mt_ws_transport"
import {TLSerialization} from "../language/serialization"

const Logger = createLogger("FileNetworker")

export class FileNetworker extends ApiNetworker {
    constructor(authContext) {
        super(authContext, false)
        this.messageProcessor = new MessageProcessor({
            networker: this
        })


        mt_file_set_disconnect_processor(this.onDisconnect, this.dcUrl)
        mt_file_set_connect_processor(this.onConnect, this.dcUrl)

        mt_file_ws_set_processor(data_buffer => {

            if (data_buffer.byteLength <= 4) {
                //some another protocol violation here
                throw new Error("404?? " + this.auth.dcID)
            }
            this.processResponse(data_buffer)
            //this.messageProcessor.process(response.response, response.messageID, response.sessionID)
        }, this, this.dcUrl)
    }

    onDisconnect() {
        console.error(`File networker died, respawning...`)
    }

    initPings() {
        this.pings = {}
    }

    sendMessage(message) {
        this.messageProcessor.sentMessages.set(message.msg_id, message)

        const dataWithPadding = this.addHeader(message)

        return this.getEncryptedMessage(dataWithPadding).then(encryptedResult => {
            const request = new TLSerialization({startMaxLength: encryptedResult.bytes.byteLength + 256})
            request.storeIntBytes(this.auth.authKeyID, 64, "auth_key_id")
            request.storeIntBytes(encryptedResult.msgKey, 128, "msg_key")
            request.storeRawBytes(encryptedResult.bytes, "encrypted_data")

            mt_file_ws_transport(this.dcUrl, request.getBuffer())
        })

    }
}
