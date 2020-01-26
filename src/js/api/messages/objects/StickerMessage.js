// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class StickerMessage extends AbstractMessage {

    type = MessageType.STICKER

    show() {
        //
    }
}