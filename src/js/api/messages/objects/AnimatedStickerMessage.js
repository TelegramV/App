// @flow

import {MessageType} from "../Message"
import {StickerMessage} from "./StickerMessage"
import {FileAPI} from "../../fileAPI"

export class AnimatedStickerMessage extends StickerMessage {

    type = MessageType.ANIMATED_EMOJI

    show() {
        super.show()
        FileAPI.getFile(this.raw.media.document).then(srcUrl => {
            this.srcUrl = srcUrl
            this.fire("stickerLoaded")
        })
    }

    fillRaw(raw: Object): StickerMessage {
        super.fillRaw(raw)

        const emoji = StickerManager.getAnimatedEmoji(this.text)

        this.raw.media = {
            _: "messageMediaDocument",
            isAnimatedEmoji: true,
            document: emoji
        }

        return this
    }
}