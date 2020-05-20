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

class StickerSet {
    thumbUrl: string;

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

    fetchThumb(): Promise<string> {
        if (!this.raw.thumb) {
            return Promise.resolve("no thumb");
        }

        console.log(this.raw.thumb);

        return FileAPI.downloadStickerSetThumb(this).then(blob => {
            return URL.createObjectURL(blob);
        });
    }

    fillRaw(raw): StickerSet {
        this.raw = raw;
    }
}

export default StickerSet;