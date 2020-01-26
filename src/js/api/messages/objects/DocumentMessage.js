// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class DocumentMessage extends AbstractMessage {

    type = MessageType.DOCUMENT

    show() {
        //
    }
}