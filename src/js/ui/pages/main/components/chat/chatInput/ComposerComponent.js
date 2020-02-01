import Component from "../../../../../v/vrdom/Component";
import TabSelectorComponent from "../../basic/TabSelectorComponent"

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
							<div class="recent"></div>
							<div class="people selected">😃😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗☺😚😙😋😛😜🤪😝🤑🤗🤭🤫🤔🤐🤨😐😑😶😏😒🙄😬🤥😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳😎🤓🧐😕😟🙁☹😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😣😞😓😩😫😤😡😠🤬😈👿💀☠💩🤡👹👺👻👽👾🤖😺😸😹😻😼😽🙀😿😾💋👋🤚🖐✋🖖👌✌🤞🤟🤘🤙👈👉👆🖕👇☝👍👎✊👊🤛🤜👏🙌👐🤲🤝🙏✍💅🤳💪🦵🦶👂👃🧠🦷🦴👀👁👅👄👶🧒👦👧🧑👱👨🧔👨‍🦰👨‍🦱👨‍🦳👨‍🦲👩👩‍🦰👩‍🦱👩‍🦳👩‍🦲👱‍♀️👱‍♂️🧓👴👵🙍🙍‍♂️🙍‍♀️🙎🙎‍♂️🙎‍♀️🙅🙅‍♂️🙅‍♀️🙆🙆‍♂️🙆‍♀️💁💁‍♂️💁‍♀️🙋🙋‍♂️🙋‍♀️🙇🙇‍♂️🙇‍♀️🤦🤦‍♂️🤦‍♀️🤷🤷‍♂️🤷‍♀️👨‍⚕️👩‍⚕️👨‍🎓👩‍🎓👨‍🏫👩‍🏫👨‍⚖️👩‍⚖️👨‍🌾👩‍🌾👨‍🍳👩‍🍳👨‍🔧👩‍🔧👨‍🏭👩‍🏭👨‍💼👩‍💼👨‍🔬👩‍🔬👨‍💻👩‍💻👨‍🎤👩‍🎤👨‍🎨👩‍🎨👨‍✈️👩‍✈️👨‍🚀👩‍🚀👨‍🚒👩‍🚒👮👮‍♂️👮‍♀️🕵🕵️‍♂️🕵️‍♀️💂💂‍♂️💂‍♀️👷👷‍♂️👷‍♀️🤴👸👳👳‍♂️👳‍♀️👲🧕🤵👰🤰🤱👼🎅🤶🦸🦸‍♂️🦸‍♀️🦹🦹‍♂️🦹‍♀️🧙🧙‍♂️🧙‍♀️🧚🧚‍♂️🧚‍♀️🧛🧛‍♂️🧛‍♀️🧜🧜‍♂️🧜‍♀️🧝🧝‍♂️🧝‍♀️🧞🧞‍♂️🧞‍♀️🧟🧟‍♂️🧟‍♀️💆💆‍♂️💆‍♀️💇💇‍♂️💇‍♀️🚶🚶‍♂️🚶‍♀️🏃🏃‍♂️🏃‍♀️💃🕺🕴👯👯‍♂️👯‍♀️🧖🧖‍♂️🧖‍♀️🧘👭👫👬💏👨‍❤️‍💋‍👨👩‍❤️‍💋‍👩💑👨‍❤️‍👨👩‍❤️‍👩👪👨‍👩‍👦👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧‍👧👨‍👨‍👦👨‍👨‍👧👨‍👨‍👧‍👦👨‍👨‍👦‍👦👨‍👨‍👧‍👧👩‍👩‍👦👩‍👩‍👧👩‍👩‍👧‍👦👩‍👩‍👦‍👦👩‍👩‍👧‍👧👨‍👦👨‍👦‍👦👨‍👧👨‍👧‍👦👨‍👧‍👧👩‍👦👩‍👦‍👦👩‍👧👩‍👧‍👦👩‍👧‍👧🗣👤👥👣🧳🌂☂🧵🧶👓🕶🥽🥼👔👕👖🧣🧤🧥🧦👗👘👙👚👛👜👝🎒👞👟🥾🥿👠👡👢👑👒🎩🎓🧢⛑💄💍💼</div>
							<div class="nature"></div>
							<div class="food"></div>
							<div class="activity"></div>
							<div class="travel"></div>
							<div class="objects"></div>
							<div class="symbols"></div>
						</div>
						<div class="emoji-types">
							<div class="rp emoji-type-item"><i class="tgico tgico-sending"/></div>
							<div class="rp emoji-type-item selected"><i class="tgico tgico-smile"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-animals"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-eats"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-car"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-sport"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-lamp"/></div>
							<div class="rp emoji-type-item"><i class="tgico tgico-flag"/></div>
						</div>
					</div>
				</div>
			</div>
			)
	}

	mounted() {
		this.emojiPanel = this.$el.querySelector(".emoji-wrapper");
	}

	openEmoji() {
		this.emojiPanel.classList.remove("hidden");
	}
}