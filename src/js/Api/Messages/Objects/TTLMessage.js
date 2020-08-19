import AbstractMessage from "../AbstractMessage"
import {MessageType} from "../Message"

export class TTLMessage extends AbstractMessage {

	type = MessageType.TTL

    get text() {
        return ""
    }
}