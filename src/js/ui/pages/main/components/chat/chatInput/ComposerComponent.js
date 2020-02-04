import Component from "../../../../../v/vrdom/Component";
import VRDOM from "../../../../../v/vrdom/VRDOM";
import TabSelectorComponent from "../../basic/TabSelectorComponent"
import StickerComponent from "../message/common/StickerComponent"
import {ChatInputManager} from "./ChatInputComponent"
import {emojiCategories, replaceEmoji} from "../../../../../utils/emoji"
import {StickerManager} from "../../../../../../api/stickersManager"
import {FileAPI} from "../../../../../../api/fileAPI"
import MTProto from "../../../../../../mtproto/external"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import lottie from "lottie-web"

export default class ComposerComponent extends Component {
	constructor(props) {
		super(props);

		this.tabItems = [
			{
				text: "Emoji",
				click: this.openEmoji.bind(this),
				selected: true
			},
			{
				text: "Stickers",
				click: this.openStickers.bind(this),
			},
			{
				text: "GIFs",
				click: this.openGIF.bind(this),
			}
		]
	}

	h() {
		return (
			<div class="composer" onMouseEnter={this.props.mouseEnter} onMouseLeave={this.props.mouseLeave}>
				<TabSelectorComponent items={this.tabItems}/>
				<div class="content">
					<div class="emoji-wrapper">
						<div class="emoji-table">
							<div class="recent" data-category="recent"></div>
							<div class="people" data-category="people"/>
							<div class="nature" data-category="nature"></div>
							<div class="food" data-category="food"></div>
							<div class="travel" data-category="travel"></div>
							<div class="activity" data-category="activity"></div>
							<div class="objects" data-category="objects"></div>
							<div class="symbols" data-category="symbols"></div>
						</div>
						<div class="emoji-types">
							<div class="rp emoji-type-item" data-category="recent" onClick={this._emojiTypeClick}><i class="tgico tgico-sending"/></div>
							<div class="rp emoji-type-item selected" data-category="people" onClick={this._emojiTypeClick}><i class="tgico tgico-smile"/></div>
							<div class="rp emoji-type-item" data-category="nature" onClick={this._emojiTypeClick}><i class="tgico tgico-animals"/></div>
							<div class="rp emoji-type-item" data-category="food" onClick={this._emojiTypeClick}><i class="tgico tgico-eats"/></div>
							<div class="rp emoji-type-item" data-category="travel" onClick={this._emojiTypeClick}><i class="tgico tgico-car"/></div>
							<div class="rp emoji-type-item" data-category="activity" onClick={this._emojiTypeClick}><i class="tgico tgico-sport"/></div>
							<div class="rp emoji-type-item" data-category="objects" onClick={this._emojiTypeClick}><i class="tgico tgico-lamp"/></div>
							<div class="rp emoji-type-item" data-category="symbols" onClick={this._emojiTypeClick}><i class="tgico tgico-flag"/></div>
						</div>
					</div>
					<div class="sticker-wrapper hidden">
						<div class="sticker-table">
							<div class="selected">

							</div>
						</div>
						<div class="sticker-packs">
							<div class="rp sticker-packs-item selected"><i class="tgico tgico-sending"/></div>
						</div>
					</div>
				</div>
			</div>
			)
	}

	mounted() {
		this.emojiPanel = this.$el.querySelector(".emoji-wrapper");
		this.stickerPanel = this.$el.querySelector(".sticker-wrapper");
		this.$el.querySelector(".emoji-types").childNodes.forEach(el => {
			if(el.classList.contains("selected")) {
				el.click() //TODO rewrite this to not imitate click
			}
		})
	}

	onHide() {
		this.stickerPanel.querySelector(".selected").childNodes.forEach(node => {
			if(node.id) lottie.pause(node.id);
		})
		this.paused = true;
	}

	onShow() {
		if(!this.paused) return;
		this.stickerPanel.querySelector(".selected").childNodes.forEach(node => {
			if(node.id) lottie.play(node.id);
		})
	}

	openEmoji() {
		if(!this.emojiPanel) return;
		this.stickerPanel.classList.add("hidden");
		this.emojiPanel.classList.remove("hidden");
	}

	openStickers() {
		if(!this.stickerPanel) return;
		this.loadRecentStickers().then(_ => {
			this._bindStickerClickEvents();
		})
		this.loadInstalledStickerSets();
		this.emojiPanel.classList.add("hidden");
		this.stickerPanel.classList.remove("hidden");
	}

	openGIF() {

	}

	_emojiTypeClick(ev) {
		let el = ev.currentTarget;
		let category = el.getAttribute("data-category");
		if(!category) return;
		this.$el.querySelector(".emoji-types").childNodes.forEach(node => node.classList.remove("selected"));
		el.classList.add("selected");
		this.$el.querySelector(".emoji-table").childNodes.forEach(node => node.classList.remove("selected"));
		let newEl = this.$el.querySelector(".emoji-table").querySelector("."+category);
		newEl.classList.add("selected");
		while(newEl.firstChild) newEl.removeChild(newEl.firstChild)
		newEl.innerText = emojiCategories[category];
		replaceEmoji(newEl);
		this._bindEmojiClickEvents();
	}

	_bindEmojiClickEvents() {
		this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
			node.addEventListener("click", this._emojiClick);
		})
	}

	_emojiClick(ev) {
		let emoji = ev.currentTarget;
		ChatInputManager.appendText(emoji.alt);
	}

	loadInstalledStickerSets() {
		StickerManager.getInstalledStickerSets().then(async sets => {
			let container = this.stickerPanel.querySelector(".sticker-packs");
			for(const set of sets) {
				if(set.set.thumb) {
					//download thumb
				} else { //first sticker
					let url = await FileAPI.getThumb(set.documents[0], "min");
					VRDOM.append(<StickerSetItemFragment setId={set.set.id} url={url} click={this._stickerPackClick.bind(this)}/>, container);
				}
			}
		})
	}

	_stickerPackClick(ev) {
		let id = ev.currentTarget.getAttribute("set-id");
		if(!id) return;
		this.setStickerSet(id);
	}

	setStickerSet(id) {
		let table = this.stickerPanel.querySelector(".selected");
		while(table.firstChild) table.removeChild(table.firstChild);
		let set = StickerManager.getCachedStickerSet(id);
		for(const sticker of set.documents) {
			VRDOM.append(<StickerComponent width={75} sticker={sticker}/>, table);
		}
		this._bindStickerClickEvents();
	}

	loadRecentStickers() {
		return MTProto.invokeMethod("messages.getRecentStickers", {
			flags:0,
			hash:0
		}).then(response => {
			let packs = response.packs;
			let stickers = response.stickers;
			let table = this.stickerPanel.querySelector(".selected");
			for(let i = 0; i<Math.min(25, stickers.length); i++) {
				VRDOM.append(<StickerComponent width={75} sticker={stickers[i]}/>, table);
			}
		})
	}

	_bindStickerClickEvents() {
		this.$el.querySelector(".sticker-table > .selected").childNodes.forEach(node => {
			node.addEventListener("click", this._stickerClick);
		})
	}

	_stickerClick(ev) {
		let ref = ev.currentTarget.getAttribute("data-component-id");
		if(!ref) return;
		console.log(ref)
		let sticker = this.refs.get(ref).sticker;
		console.log(sticker)
		AppSelectedPeer.Current.api.sendSticker(sticker);
	}
}

const StickerSetItemFragment = ({setId, url, click}) => {
	return (
		<div class="sticker-packs-item" set-id={setId} onClick={click}><img src={url}/></div>
		)
}