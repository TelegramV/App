import {MessageParser} from "./MessageParser"
import {AbstractMessage} from "./AbstractMessage"
import type {Message} from "./Message"

export class SearchMessage extends AbstractMessage {

    raw: Object

    type: number

    constructor(dialog) {
        super(dialog)
    }

    fillRaw(raw: Object): Message {
        this.type = MessageParser.getType(raw)
        return super.fillRaw(raw)
    }
}