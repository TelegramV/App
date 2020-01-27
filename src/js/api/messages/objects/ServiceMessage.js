// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class ServiceMessage extends AbstractMessage {

    type = MessageType.SERVICE

    show() {
        super.show()
    }
}