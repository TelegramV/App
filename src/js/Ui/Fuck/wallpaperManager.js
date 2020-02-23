import {FileAPI} from "../../Api/Files/FileAPI"
import MTProto from "../../MTProto/external"

export class WallpaperManagerClass {
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
            return this.receiveWallpaperList();
        } else {
            return this.wallpapers;
        }
    }

    async cacheWallpaperImages() {
        this.getWallpapers().then(wallpapers => {
            let i = 0;
            for (const wallpaper of wallpapers) {
                if (wallpaper.pFlags.pattern) continue;
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

const WallpaperManager = new WallpaperManagerClass();

export default WallpaperManager;