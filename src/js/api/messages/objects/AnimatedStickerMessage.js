// @flow

import {MessageType} from "../Message"
import {StickerMessage} from "./StickerMessage"
import {FileAPI} from "../../fileAPI"

export class AnimatedStickerMessage extends StickerMessage {

    type = MessageType.ANIMATED_STICKER

    fillRaw(raw: Object): AnimatedStickerMessage {
        super.fillRaw(raw)

        if (this.raw.media.document.mime_type !== "application/x-tgsticker") {
            this.raw.media.isAnimatedEmoji = true

            const size = this.raw.media.document.attributes.find(a => a._ === "documentAttributeImageSize")
            this.w = size ? size.w : null
            this.h = size ? size.h : null
        }


        return this
    }
}