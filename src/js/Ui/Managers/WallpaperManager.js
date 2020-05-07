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

import FileManager from "../../Api/Files/FileManager"
import MTProto from "../../MTProto/External"
import AppEvents from "../../Api/EventBus/AppEvents"
import UIEvents from "../../Ui/EventBus/UIEvents"
import keval from "../../Keval/keval";

class WallpaperManagerSingleton {
    wallpapers = [];
    isFetching = false;

    init() {
        AppEvents.Files.subscribe("fileDownloaded", this.onFileDownloaded);
        keval.getItem("background").then(data => {
            if(!data) return;
            if(data.blob) {
                let url = URL.createObjectURL(data.blob);
                this.setWallpaper(url);
            } else if(data.color) {
                this.setColor(data.color);
            }
        })
    }

    fetchAllWallPapers() {
        if (this.wallpapers.length > 0 || this.isFetching) {
            return Promise.resolve(this.wallpapers);
        }

        this.isFetching = true;

        return MTProto.invokeMethod("account.getWallPapers", {hash: 0}).then(result => {
            this.isFetching = true;

            this.wallpapers = result.wallpapers;

            UIEvents.General.fire("wallpaper.fetched", {wallpapers: this.wallpapers});

            this.wallpapers.forEach(wallpaper => {
                FileManager.downloadDocument(wallpaper.document, undefined, true);
            });

            return this.wallpapers;
        });
    }

    _applyWallpaper(url) {
        
    }

    _applyColor(hex) {
        
    }

    setWallpaper(url) {
        if(!url) {
            window.document.documentElement.style.removeProperty("--chat-bg-image");
            return;
        }
        window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        fetch(url).then(async response => {
            let blob = await response.blob();
            keval.setItem("background", {blob: blob});
        })
    }

    setColor(hex) {
        if(!hex) {
            window.document.documentElement.style.removeProperty("--chat-bg-color");
            return;
        }
        this.setWallpaper(undefined); //remove wallpaper
        window.document.documentElement.style.setProperty("--chat-bg-color", hex);
        keval.setItem("background", {color: hex});
    }

    onFileDownloaded = event => {
        if (!this.wallpapers.find(w => w.document.id === event.fileId)) {
            return;
        }

        UIEvents.General.fire("wallpaper.ready", {
            id: event.fileId,
            wallpaperUrl: event.url
        });
    }
}

const WallpaperManager = new WallpaperManagerSingleton();

export default WallpaperManager;