// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class
TextMessage extends AbstractMessage {

    type = MessageType.TEXT

    show() {
        super.show()
    }
}