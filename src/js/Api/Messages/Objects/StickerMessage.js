// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class StickerMessage extends AbstractMessage {

    type = MessageType.STICKER

    w = 0
    h = 0

    fillRaw(raw: Object): StickerMessage {
        super.fillRaw(raw)

        if (this.media) {
            const size = this.media.document.attributes.find(a => a._ === "documentAttributeImageSize")
            this.w = size ? size.w : null
            this.h = size ? size.h : null
        }

        return this
    }
}