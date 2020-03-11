/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {FileAPI} from "../../Api/Files/FileAPI"
import MTProto from "../../MTProto/external"

export class WallpaperManagerSingleton {
    init() {
        this.wallpapers = [];
        this.wallpapersDocumentCache = {};

        this._receiveWallpaperList().then(q => {
            //this.setLegendaryCamomileWallpaper();
            this.cacheWallpaperImages();
        })
    }

    _receiveWallpaperList() {
        return MTProto.invokeMethod("account.getWallPapers", {hash: 0}).then(result => {
            for (const wallpaper of result.wallpapers) {
                this.wallpapers.push(wallpaper);
            }
        })
    }

    downloadWallpaper(wallpaper) {
        return FileAPI.getFile(wallpaper.document);
    }

    // 5947530738516623361
    setLegendaryCamomileWallpaper() {
        this.downloadWallpaper(this.wallpapers.find(l => l.id === "5947530738516623361")).then(url => {
            window.document.documentElement.style.setProperty("--chat-bg-image", `url("${url}")`);
        })
    }

    async getWallpapers() {
        if (this.wallpapers.length === 0) {
            return this._receiveWallpaperList();
        } else {
            return this.wallpapers;
        }
    }

    async cacheWallpaperImages() {
        this.getWallpapers().then(wallpapers => {
            let i = 0;
            for (const wallpaper of wallpapers) {
                if (wallpaper.pattern) continue;
                i++;
                setTimeout(_ => {
                    const id = wallpaper.id;
                    this.downloadWallpaper(wallpaper).then(url => {
                        //console.log("downloaded!")
                        this.wallpapersDocumentCache[id] = url;
                    })
                }, 500 * i);
            }
        }).then(_ => {
            return this.wallpapersDocumentCache;
        })
    }
}

const WallpaperManager = new WallpaperManagerSingleton();

export default WallpaperManager;