import VUI from "../../Ui/VUI"
import {StickerSetModal} from "../../Ui/Components/Modals/StickerSetModal"
import StickerSet from "../Stickers/StickerSet"

class TMeManager {

	init() {
		window.onclick = this.processEvent
		window.onauxclick = this.processEvent
	}

	processEvent = (ev) => {
		let href = ev.srcElement?.closest("a")?.href;

		if(this.isDeepLink(href) && this.processDeepLink(href)) {
		 	ev.preventDefault();
		}
	}

	processDeepLink(href) {
		if(!href) return false;
		let url = new URL(href);
		if(url.protocol === "tg:") { // process deep link
			return true;
		}

		if(this.isMirror(url.hostname)) { //proccess t.me or mirror
			let location = url.pathname.startsWith("/") ? url.pathname.substr(1) : ur.pathname;
			let split = location.split("/");
			switch(split[0]) {
				case "addstickers":
					this.showStickerModal(split[1])
					return true;
					break;
				default:
					if(split[0].length === 0) return false;
					if(split.length == 1) {
						// TODO work with numbers too
						this.changeLocation("/#/?p=@"+split[0]);
						return true;
					} else {
						// open message by id
					}
			}
		}
		return false;
	}

	showStickerModal(name) {
		let inputStickerSet = {
			_: "inputStickerSetShortName",
			short_name: name
		}
		let stickerSet = new StickerSet(inputStickerSet);
		VUI.Modal.open(<StickerSetModal set={stickerSet}/>)
	}

	changeLocation(newHref) {
		window.location = newHref;
	}

	isDeepLink(text) {
		if(!text) return false;
		let url = new URL(text);
		if(url.protocol === "tg:" || this.isMirror(url.hostname)) return true;
		return false;
	}

	isMirror(hostname) {
		switch(hostname) {
			case "t.me":
			case "telegram.me":
			case "telegram.dog":
			case "telesco.pe":
				return true;
			default:
				return false;
		}
	}

}

export default new TMeManager();