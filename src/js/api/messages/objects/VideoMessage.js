// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class VideoMessage extends AbstractMessage {

    type = MessageType.VIDEO

    show() {
        super.show()
    }
}