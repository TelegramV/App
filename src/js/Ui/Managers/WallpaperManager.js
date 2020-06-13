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
                this.setWallpaper("./static/images/default_bg.jpg")
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
        this.requestFull(wallpaper).then(blob => {
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