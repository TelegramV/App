import {RightBarComponent} from "../RightBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"

export default class MessageSearchComponent extends RightBarComponent {
	barName = "messages-search"
	barVisible = false;

	constructor(props) {
		super(props);
	}

	h() {
		return (
			<div class="sidebar right scrollable hidden messages-search">
				<div class="toolbar">
					<span class="btn-icon tgico tgico-close rp rps" onClick={_ => {
						UIEvents.RightSidebar.fire("show", {
				            barName: "nothing"
				        })}}></span>
					<div class="search">
						<div class="input-search">
							<input type="text" placeholder="Search"/>
							<span class="tgico tgico-search"></span>
						</div>
					</div>
				</div>
				<div class="content">
					<div class="section-title">2 messages found</div>

				</div>
			</div>
			)
	}
}