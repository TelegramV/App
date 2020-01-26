// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PhotoMessage extends AbstractMessage {

    type = MessageType.PHOTO

    show() {
        //
    }
}