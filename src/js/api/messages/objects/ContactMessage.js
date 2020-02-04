// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class ContactMessage extends AbstractMessage {

    type = MessageType.CONTACT

    show() {
        super.show()
    }
}