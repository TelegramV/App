import {Manager} from "./manager";
import MTProto from "../mtproto/external";

class StickersManager extends Manager {
    constructor(props) {
        super(props);
        this.stickerSets = {}
    }

    getStickerSet(stickerSet) {
        if (stickerSet._ === "inputStickerSetAnimatedEmoji") stickerSet.id = "inputStickerSetAnimatedEmoji"
        if (this.stickerSets[stickerSet.id]) return Promise.resolve(this.stickerSets[stickerSet.id])
        MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: stickerSet
        }).then(l => {
            l.packs.forEach(q => {
                q.document = l.documents.find(z => z.id === q.documents[0])
            })
            const k = this.stickerSets[stickerSet._ === "inputStickerSetAnimatedEmoji" ? stickerSet._ : l.set.id] = l
            console.log(this.stickerSets)
            return k
        })
        // TODO change that to promise maybe
        return null
    }

    getAnimatedEmojiSet() {
        return this.getStickerSet({_: "inputStickerSetAnimatedEmoji"})
    }

    getAnimatedEmoji(text) {
        if (this.stickerSets["inputStickerSetAnimatedEmoji"]) {
            const sticker = this.stickerSets["inputStickerSetAnimatedEmoji"].packs.find(l => {
                // TODO dirty hack, should check some other way...
                return text === l.emoticon || (text === "❤️" && l.emoticon === "❤")
            })
            if (sticker) {
                return sticker.document
            }
        }
        return null
    }
}

export const StickerManager = new StickersManager()
