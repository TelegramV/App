// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class GameMessage extends AbstractMessage {

    type = MessageType.GAME

    get game() {
    	return this.raw?.media?.game;
    }

    show() {
        super.show()
    }
}