// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {StickerManager} from "../../Stickers/StickersManager"

export class DiceMessage extends AbstractMessage {

    type = MessageType.DICE

    get value() {
    	return this.raw.media.value;
    }

    get emoji() {
        return this.raw.media.emoticon;
    }

    fillRaw(raw: Object): DiceMessage {
        super.fillRaw(raw)

        if (this.raw.media) {
            this.animated = true;
            this.raw.media.document = StickerManager.getDice(this.value, this.emoji);
        }

        return this
    }
}