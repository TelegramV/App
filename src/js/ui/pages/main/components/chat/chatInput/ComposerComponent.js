import Component from "../../../../../v/vrdom/Component";
import TabSelectorComponent from "../../basic/TabSelectorComponent"
import {ChatInputManager} from "./ChatInputComponent"
import {emojiCategories, replaceEmoji} from "../../../../../utils/emoji"

export default class ComposerComponent extends Component {
	constructor(props) {
		super(props);

		this.tabItems = [
			{
				text: "Emoji",
				click: this.openEmoji,
				selected: true
			},
			{
				text: "Stickers",
				click: this.openStickers
			},
			{
				text: "GIFs",
				click: this.openGIF
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
							<div class="people selected" data-category="people"/>
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
				</div>
			</div>
			)
	}

	mounted() {
		this.emojiPanel = this.$el.querySelector(".emoji-wrapper");
		this.$el.querySelector(".emoji-types").childNodes.forEach(el => {
			if(el.classList.contains("selected")) {
				el.click() //TODO rewrite this to not imitate click
			}
		})
	}

	openEmoji() {
		if(!this.emojiPanel) return;
		this.emojiPanel.classList.remove("hidden");
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
}