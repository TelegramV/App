import Component from "../../../../../../v/vrdom/Component"
import SettingsPane from "../SettingsPane"

export class BackgroundColorComponent extends SettingsPane {
	constructor(props) {
		super(props);

		this.defaultColors = [
			"#FF0000",
			"#FFFF00",
			"#00FF00",
			"#00FFFF",
			"#0000FF",
			"#FF00FF",
			"#123456"
		]
	}

	getId() {
		return "background-color"
	}

	h() {
		return (
			<div class="background-color hidden">
				{this.makeHeader()}
				<div class="pallete">
					Pallete goes here...
				</div>
				<div class="gallery color-list">
					{this.generateColorList()}
				</div>
			</div>
			)
	}

	getName() {
		return "Set a Color"
	}

	generateColorList() {
		let elements = [];
		for(const color of this.defaultColors) {
			elements.push(<ColorSquareFragment color={color} click={this._fragmentClick}/>);
		}
		return elements;
	}

	applyColor(color) {
		window.document.documentElement.style.setProperty("--chat-bg-color", color)
	}

	_fragmentClick(ev) {
		this.applyColor(ev.currentTarget.getAttribute("color"));
	}
}

const ColorSquareFragment = ({color, click}) => {
	return(
		<div class="color-square" color={color} onClick={click} style={"background-color:"+color}/>
		)
}