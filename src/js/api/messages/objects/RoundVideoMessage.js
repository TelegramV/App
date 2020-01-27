// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class RoundVideoMessage extends AbstractMessage {

    type = MessageType.ROUND

    show() {
        super.show()
    }
}