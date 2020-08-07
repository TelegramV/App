// @flow

import {MessageType} from "../Message"
import {AnimatedStickerMessage} from "./AnimatedStickerMessage"
import {TextMessage} from "./TextMessage"
import {StickerManager} from "../../Stickers/StickersManager";

export class AnimatedEmojiMessage extends AnimatedStickerMessage {

    type = MessageType.ANIMATED_EMOJI

    fillRaw(raw: Object): AnimatedStickerMessage {
        super.fillRaw(raw)

        let emoji = StickerManager.getAnimatedEmoji(this.text); // why should we check here, when we have same check in MessageParser?
        if (emoji) {
            this.raw.media = {
                _: "messageMediaDocument",
                document: emoji
            }
        } else {
        	return new TextMessage(this.peer).fillRaw(raw); // very very bad, don't do this
        }

        return this;
    }

}