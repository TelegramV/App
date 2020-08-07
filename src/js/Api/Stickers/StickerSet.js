/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {FileAPI} from "../Files/FileAPI"
import API from "../Telegram/API"
import DocumentParser from "../Files/DocumentParser"

const setsStore = new Map()

class StickerSet {
    thumbUrl: string;

    rawStickerSet: Object;

    constructor(raw, isAnimated) {
        this.raw = raw;
        this._isAnimated = isAnimated;
    }

    isEmpty() {
        return this.raw._ === "inputStickerSetEmpty";
    }

    get input() {
        if(this.raw.short_name) {
            return {
                _: "inputStickerSetShortName",
                short_name: this.raw.short_name
            }
        }
        return {
            _: "inputStickerSetID",
            id: this.raw.id,
            access_hash: this.raw.access_hash,
        };
    }

    get documents() {
        return this.rawStickerSet?.documents;
    }

    get set() {
        return this.rawStickerSet?.set;
    }

    get isFetched() {
        return !!this.rawStickerSet
    }

    getStickerSet() {
        if (!this.isFetched) {
            if (this.fetchingPromise) return this.fetchingPromise;

            return this.fetchingPromise = API.messages.getStickerSet({
                stickerset: this.input
            }).then(StickerSet => {
                this.rawStickerSet = StickerSet;
                this.raw = StickerSet.set;
                return StickerSet;
            });
        }

        return Promise.resolve(this.rawStickerSet)
    }

    fetchThumb(): Promise<string> {
        if (this.thumbUrl) {
            return Promise.resolve(this.thumbUrl);
        }

        const download = () => {
            return FileAPI.downloadStickerSetThumb(this).then(blob => {
                if (this.raw.animated) {
                    return FileAPI.decodeAnimatedSticker(blob).then(json => {
                        const blob = new Blob([JSON.stringify(json)], {
                            type: "application/json",
                        });

                        this.thumbUrl = URL.createObjectURL(blob);
                    })
                }

                this.thumbUrl = FileAPI.getUrl(blob);

                return this.thumbUrl;
            });
        }

        if (!this.raw.thumb) {
            return this.getStickerSet().then(() => {
                return download();
            });
        }

        return download();
    }

    fillRaw(raw): StickerSet {
        this.raw = raw;
        return this;
    }

    static fromRaw(raw, isAnimated): StickerSet {
        if (setsStore.has(raw.id)) {
            const set = setsStore.get(raw.id);
            set.fillRaw(raw);
            return set;
        } else {
            const set = new StickerSet(raw, isAnimated);
            setsStore.set(raw.id, set);
            return set;
        }
    }

    static fromSticker(document): StickerSet {
        this.document = document;
        this.sticker = DocumentParser.attributeSticker(document);

        // if (setsStore.has(raw.id)) {
        //     const set = setsStore.get(raw.id);
        //     set.fillRaw(raw);
        //     return set;
        // } else {
        //     const set = new StickerSet(raw, isAnimated);
        //     setsStore.set(raw.id, set);
        //     return set;
        // }
    }

    isAnimated() {
        return this.raw.animated;
    }
}

class InputStickerSet {
    constructor(input) {
        this.input = input;
    }
}

export default StickerSet;