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

class StickerSet {
    thumbUrl: string;

    rawStickerSet: Object;

    constructor(raw) {
        this.raw = raw;
    }

    get input() {
        return {
            _: "inputStickerSetID",
            id: this.raw.id,
            access_hash: this.raw.access_hash,
        };
    }

    getStickerSet() {
        if (!this.rawStickerSet) {
            return API.messages.getStickerSet({
                stickerset: {
                    _: "inputStickerSetID",
                    id: this.raw.id,
                    access_hash: this.raw.access_hash,
                }
            }).then(StickerSet => {
                this.rawStickerSet = StickerSet;
                return StickerSet;
            });
        }

        return Promise.resolve(this.rawStickerSet)
    }

    fetchThumb(): Promise<string> {
        if (this.json) {
            return Promise.resolve(this.json);
        } else if (this.thumbUrl) {
            return Promise.resolve(this.thumbUrl);
        }

        const download = () => {
            return FileAPI.downloadStickerSetThumb(this).then(blob => {
                if (this.raw.animated) {
                    return FileAPI.decodeAnimatedSticker(blob).then(json => this.json = json)
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
    }
}

export default StickerSet;