// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import {StickerManager} from "../../Stickers/StickersManager"

export class DiceMessage extends AbstractMessage {

    type = MessageType.DICE

    show() {
        super.show()
    }

    get value() {
    	return this.raw.media.value;
    }

    fillRaw(raw: Object): DiceMessage {
        super.fillRaw(raw)

        if (this.raw.media) {
            this.animated = true;
            this.raw.media.document = StickerManager.getDice(this.value);
        }

        return this
    }
}