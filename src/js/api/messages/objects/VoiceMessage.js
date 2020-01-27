// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class VoiceMessage extends AbstractMessage {

    type = MessageType.VOICE

    show() {
        super.show()
    }
}