import SettingsPane from "./SettingsPane"
import {ButtonWithIconFragment} from "./SettingsComponent"

export default class BackgroundColorComponent extends SettingsPane {
	barName = "general-settings";

	constructor(props) {
		super(props);

		this.name = "General"
	}

	h() {
		return (
			<div class="sidebar sub-settings general-settings scrollable">
				{this.makeHeader()}
				<div class="section-title">Settings</div>
				<div class="text-size"></div>
				<ButtonWithIconFragment icon="photo" name="Chat Background" click={_ => this.openPane("background-image")}/>
			</div>
			)
	}
}