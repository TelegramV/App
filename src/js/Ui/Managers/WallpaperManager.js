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
        //AppEvents.Files.subscribe("download.done", this.onFileDownloaded);

        keval.getItem("background").then(data => {
            if (!data) {
                this.setWallpaper("../../../../public/static/images/default_bg.jpg")
            }
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

        return this.fetchPromise = MTProto.invokeMethod("account.getWallPapers", {hash: 0}).then(result => {

            this.wallpapers = result.wallpapers;
            //console.log(this.wallpapers);
            this.isFetching = false;

            UIEvents.General.fire("wallpaper.fetched", {wallpapers: this.wallpapers});

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

    async requestFull(wallpaper) {
        return FileManager.downloadDocument(wallpaper.document).then(async ({blob}) => {
            if(wallpaper.pattern) {
                let type = "png";
                let typeAttr = wallpaper.document.attributes.find(attr => attr._ =="documentAttributeFilename");
                if(typeAttr) {
                    let split = typeAttr.file_name.split(".");
                    type = split[split.length-1];
                }
                
                if(type === "tgv") { //gzipped svg
                    blob = await MTProto.performWorkerTask("gzipUncompress", new Uint8Array(await blob.arrayBuffer())).then(bytes => {
                        return new Blob([bytes], {type: "image/svg+xml"});
                    })
                }
            }

            UIEvents.General.fire("wallpaper.fullReady", {
                id: wallpaper.document.id,
                wallpaperUrl: URL.createObjectURL(blob)
            })
            return blob;
        });
    }

    requestAndInstall(wallpaper) {
        this.requestFull(wallpaper).then(async blob => {
            this.setWallpaper(URL.createObjectURL(blob));
        })
        //this.currentWallpaper = wallpaper;
    }

    setWallpaper(url) {
        if (!url) {
            window.document.documentElement.style.setProperty("--chat-bg-image", `none`);
            return;
        }
        window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        fetch(url).then(async response => {
            let blob = await response.blob();
            keval.setItem("background", {blob: blob});
        })
    }

    setColor(hex) {
        if (!hex) {
            window.document.documentElement.style.setProperty("--chat-bg-color", "none");
            return;
        }
        this.setWallpaper(undefined); //remove wallpaper
        window.document.documentElement.style.setProperty("--chat-bg-color", hex);
        keval.setItem("background", {color: hex});
    }

    /*onFileDownloaded = event => {
        if (!this.wallpapers.find(w => w.document.id === event.file.id)) {
            return;
        }

        if (event.thumbSize) {
            UIEvents.General.fire("wallpaper.previewReady", {
                id: event.file.id,
                wallpaperUrl: event.url
            });
        } else {
            if (this.currentWallpaper?.document.id === event.file.id) {
                this.setWallpaper(URL.createObjectURL(event.blob)); //apply full wallpaper
            }

            UIEvents.General.fire("wallpaper.fullReady", {
                id: event.file.id,
                wallpaperUrl: event.url
            });
        }
    }*/
}

const WallpaperManager = new WallpaperManagerSingleton();

export default WallpaperManager;