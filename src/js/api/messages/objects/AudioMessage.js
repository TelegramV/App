// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class AudioMessage extends AbstractMessage {

    type = MessageType.AUDIO

    show() {
        super.show()
    }
}