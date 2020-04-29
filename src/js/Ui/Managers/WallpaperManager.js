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

class WallpaperManagerSingleton {
    wallpapers = [];
    isFetching = false;

    init() {
        AppEvents.Files.subscribe("fileDownloaded", this.onFileDownloaded);
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