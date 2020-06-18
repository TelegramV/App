import {Manager} from "../Manager";
import MTProto from "../../MTProto/External";
import StickersState from "../../Ui/SharedStates/StickersState"
import messages from "../Telegram/messages"

class StickersManager extends Manager {
    constructor(props) {
        super(props);
        this.stickerSets = {}
        this.pendingSets = {}
    }

    //currently accepts only wrapped
    installStickerSet(stickerSet, archive = false) {
        messages.installStickerSet(stickerSet.input, archive).then(result => {
            //success or archive, currently ignored
            stickerSet.getStickerSet().then(set => {
                StickersState.addSet(set.set)
            })
        })
    }

    uninstallStickerSet(stickerSet) {
        messages.uninstallStickerSet(stickerSet.input).then(result => {
            if(result) {
                stickerSet.getStickerSet().then(set => {
                    StickersState.removeSet(set.set)
                })
            }
        })
    }

    fetchSpecialSets() {
        MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: {_: "inputStickerSetAnimatedEmoji"}
        }).then(l => {
            l.packs.forEach(q => {
                q.document = l.documents.find(z => z.id === q.documents[0])
            })

            this.stickerSets["inputStickerSetAnimatedEmoji"] = l;
            //console.log("Animated Emoji Set ready!");
        })
    }

    getCachedStickerSet(id) {
        return this.stickerSets[id];
    }

    getAnimatedEmojiSet() {
        return this.getCachedStickerSet("inputStickerSetAnimatedEmoji")
    }

    getAnimatedEmoji(text) {
        let set = this.getAnimatedEmojiSet();
        if (set) {
            const sticker = set.packs.find(l => {
                // TODO dirty hack, should check some other way...
                return text === l.emoticon || (text === "❤️" && l.emoticon === "❤")
            })
            if (sticker) {
                return sticker.document
            }
        }
        return null
    }

    async getDiceSet(emoji) {
        let set = this.getCachedStickerSet(emoji);
        if (set) return set;

        set = this.pendingSets[emoji];
        if (set) return set;

        set = this.pendingSets[emoji] = MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: {_: "inputStickerSetDice", emoticon: emoji}
        }).then(l => {
            l.packs.forEach(q => { //idk why it's here, but it works anyway
                q.document = l.documents.find(z => z.id === q.documents[0])
            })

            this.stickerSets[emoji] = l;
            //console.log("Dice Set ready: " + emoji);
            return l;
        })
        return set;
    }

    async getDice(value, emoji = "🎲") {
        if (value < 1 || value > 6) return null;
        let set = await this.getDiceSet(emoji);
        if (set) {
            return set.documents[value];
        }
        return null
    }
}

export const StickerManager = new StickersManager()