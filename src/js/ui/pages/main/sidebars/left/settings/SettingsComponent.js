import Component from "../../../../../v/vrdom/Component"
import {BackgroundColorComponent} from "./background/BackgroundColorComponent"

export let SettingsComp;

export class SettingsComponent extends Component {
	constructor(props) {
		super(props);

		SettingsComp = this;
	}
	h() {
		return (
			<div class="settings sidebar hidden">
				<BackgroundColorComponent back={this.close}/>
			</div>
			)
	}

	open() {
		this.$el.classList.remove("hidden");
	}

	close() {
		console.log("close")
		this.$el.classList.add("hidden");
	}
}