import VUI from "../../Ui/VUI"
import {StickerSetModal} from "../../Ui/Components/Modals/StickerSetModal"
import StickerSet from "../Stickers/StickerSet"
import {SetLanguageModal} from "../../Ui/Components/Modals/SetLanguageModal"

class DeepLinkManager {

	init() {
		window.onclick = this.processEvent
		window.onauxclick = this.processEvent
	}

	processEvent = (ev) => {
		let href = ev.srcElement?.closest("a")?.href;

		if(this.isTmeLink(href) && this.processTmeLink(href)) {
		 	ev.preventDefault();
		}
		if(this.isDeepLink(href)) {
			ev.preventDefault();
			this.processDeepLink(href);
		}
	}

	processTmeLink(href) {
		if(!href) return false;
		let url = new URL(href);
		if(this.isMirror(url.hostname)) { //proccess t.me or mirror

			let tgDeepLink = null;

			let location = url.pathname.startsWith("/") ? url.pathname.substr(1) : ur.pathname;
			let split = location.split("/");
			switch(split[0]) {
				case "addstickers":
					tgDeepLink = "tg://addstickers?set="+split[1];
					break;
				case "setlanguage":
					tgDeepLink = "tg://setlanguage?lang="+split[1];
					break;
				case "c":
					this.changeLocation("/#/?p=channel."+split[1]); // tg://privatepost ?
					return true;
				// todo: joinchat
				case "s": //channel preview on web
					return false;
				default:
					if(split[0].length === 0) return false;
					if(split.length == 1) {
						// TODO work with numbers too
						tgDeepLink = "tg://resolve?domain="+split[0];
					} else {
						// open message by id
					}
			}
			if(tgDeepLink) {
				this.processDeepLink(tgDeepLink);
				return true;
			}
		}
		return false;
	}

	processDeepLink(tgLink) {
		// help.getDeepLinkInfo if we don't know what to do with link
		let url = new URL(tgLink);
		if(url.protocol !=="tg:") return;
		switch(url.pathname.replace("//","")) {
			case "setlanguage":
				const code = url.searchParams.get("lang");
				VUI.Modal.open(<SetLanguageModal code={code}/>);
				break;
			case "addstickers":
				const set = url.searchParams.get("set");
				this.showStickerModal(set);
				break;
			case "resolve":
				if(url.searchParams.has("domain")) {
					const user = url.searchParams.get("domain");
					this.changeLocation("/#/?p=@"+user);
				}
				break;
		}
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
		window.location = newHref; //TODO replace with history api, or proper method?
	}

	isTmeLink(text) {
		if(!text) return false;
		let url = new URL(text);
		return this.isMirror(url.hostname);
	}

	isDeepLink(text) {
		if(!text) return false;
		return new URL(text).protocol === "tg:"
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

export default new DeepLinkManager();