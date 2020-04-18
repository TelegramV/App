import {Manager} from "../Manager";
import MTProto from "../../MTProto/External";

class StickersManager extends Manager {
    constructor(props) {
        super(props);
        this.stickerSets = {}
    }

    fetchSpecialSets() {
        /*MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: {_: "inputStickerSetDice"}
        }).then(l => {
            l.packs.forEach(q => {
                q.document = l.documents.find(z => z.id === q.documents[0])
            })

            this.stickerSets["inputStickerSetDice"] = l;
            console.log("Dice Set ready!");
        })*/

        MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: {_: "inputStickerSetAnimatedEmoji"}
        }).then(l => {
            l.packs.forEach(q => {
                q.document = l.documents.find(z => z.id === q.documents[0])
            })

            this.stickerSets["inputStickerSetAnimatedEmoji"] = l;
            console.log("Animated Emoji Set ready!");
        })
    }

    getInstalledStickerSets() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            MTProto.invokeMethod("messages.getAllStickers", {
                hash: 0
            }).then(async function (response) {
                let sets = response.sets;
                let parsed = [];
                for (const set of sets) {
                    if (set.archived) continue; //currently ignoring archived
                    let st = await that.getStickerSet({
                        _: "inputStickerSetID",
                        id: set.id,
                        access_hash: set.access_hash,
                    });
                    parsed.push(st);
                }
                resolve(parsed);
            })
        })
    }

    getCachedStickerSet(id) {
        return this.stickerSets[id];
    }

    //do not call to get special set
    getStickerSet(stickerSet) {
        if (this.stickerSets[stickerSet.id]) return Promise.resolve(this.stickerSets[stickerSet.id])

        return MTProto.invokeMethod("messages.getStickerSet", {
            stickerset: stickerSet
        }).then(l => {
            l.packs.forEach(q => {
                q.document = l.documents.find(z => z.id === q.documents[0])
            })

            let id = l.set.id;
            if (stickerSet._ === "inputStickerSetAnimatedEmoji") id = "inputStickerSetAnimatedEmoji"
            if (stickerSet._ === "inputStickerSetDice") id = "inputStickerSetDice"
            const k = this.stickerSets[id] = l;
            console.log(this.stickerSets)
            return k
        })
        // TODO change that to promise maybe
        return null
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

    getDiceSet() {
        return this.getCachedStickerSet("inputStickerSetDice")
    }

    getDice(value) {
        if(value < 1 || value > 6) return null;
        let set = this.getDiceSet();
        if (set) {
            return set.documents[value-1];
        }
        return null
    }
}

export const StickerManager = new StickersManager()