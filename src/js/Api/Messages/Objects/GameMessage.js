// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class GameMessage extends AbstractMessage {

    type = MessageType.GAME

    show() {
        super.show()
    }
}