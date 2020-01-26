// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PollMessage extends AbstractMessage {

    type = MessageType.POLL

    show() {
        //
    }
}