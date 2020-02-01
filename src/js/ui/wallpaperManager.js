import {FileAPI} from "../api/fileAPI"
import MTProto from "../mtproto/external"

export class WallpaperManagerClass {
	init() {
		
		this.wallpapers = [];

		this.receiveWallpaperList().then(q => {
			this.setLegendaryCamomileWallpaper();
		})

		
	}

	receiveWallpaperList() {
		return MTProto.invokeMethod("account.getWallPapers", {hash: 0}).then(result => {
			for(const wallpaper of result.wallpapers) {
				this.wallpapers.push(wallpaper);
			}
		})
	}

	downloadWallpaper(wallpaper) {
		return FileAPI.getFile(wallpaper.document);
	}

	setLegendaryCamomileWallpaper() {
		this.downloadWallpaper(this.wallpapers[30]).then(url => {
			window.document.documentElement.style.setProperty("--chat-bg-image", `url("${url}")`);
		})
	}
}
const WallpaperManager = new WallpaperManagerClass();

export default WallpaperManager;