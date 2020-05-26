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
import {FileAPI} from "../../Api/Files/FileAPI"
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
            if (!data) return;
            if (data.blob) {
                let url = URL.createObjectURL(data.blob);
                this.setWallpaper(url);
            } else if (data.color) {
                this.setColor(data.color);
            }
        })
    }

    fetchAllWallPapers() {
        if (this.isFetching) {
            return this.fetchPromise;
        }

        if (this.wallpapers.length > 0) {
            return Promise.resolve(this.wallpapers);
        }

        this.isFetching = true;

        return this.fetchPromise = MTProto.invokeMethod("account.getWallPapers", { hash: 0 }).then(result => {

            this.wallpapers = result.wallpapers;
            //console.log(this.wallpapers);
            this.isFetching = false;

            UIEvents.General.fire("wallpaper.fetched", { wallpapers: this.wallpapers });

            /*this.wallpapers.forEach(wallpaper => { // don't download with fetching
                FileManager.downloadDocument(wallpaper.document, undefined, true);
            });*/

            return this.wallpapers;
        });
    }

    async fetchPreview(wallpaper) {
        return FileAPI.photoThumbnail(wallpaper.document).then(thumb => {
            return thumb.src;
        });
    }

    requestFull(wallpaper) {
        FileManager.downloadDocument(wallpaper.document, undefined, true);
    }

    requestAndInstall(wallpaper) {
        this.requestFull(wallpaper);
        this.currentWallpaper = wallpaper;
    }

    setWallpaper(url) {
        if (!url) {
            window.document.documentElement.style.removeProperty("--chat-bg-image");
            return;
        }
        window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        fetch(url).then(async response => {
            let blob = await response.blob();
            keval.setItem("background", { blob: blob });
        })
    }

    setColor(hex) {
        if (!hex) {
            window.document.documentElement.style.removeProperty("--chat-bg-color");
            return;
        }
        this.setWallpaper(undefined); //remove wallpaper
        window.document.documentElement.style.setProperty("--chat-bg-color", hex);
        keval.setItem("background", { color: hex });
    }

    onFileDownloaded = event => {
        if (!this.wallpapers.find(w => w.document.id === event.fileId)) {
            return;
        }
        if (event.thumbSize) {
            UIEvents.General.fire("wallpaper.previewReady", {
                id: event.fileId,
                wallpaperUrl: event.url
            });
        } else {
            if(this.currentWallpaper?.document.id === event.fileId) {
                this.setWallpaper(event.url); //apply full wallpaper
            }

            UIEvents.General.fire("wallpaper.fullReady", {
                id: event.fileId,
                wallpaperUrl: event.url
            });
        }
    }
}

const WallpaperManager = new WallpaperManagerSingleton();

export default WallpaperManager;