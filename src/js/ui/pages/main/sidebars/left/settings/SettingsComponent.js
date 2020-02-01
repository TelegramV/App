import Component from "../../../../../v/vrdom/Component"
import {BackgroundColorComponent} from "./background/BackgroundColorComponent"
import PeersStore from "../../../../../../api/store/PeersStore"

export let Settings;

export class SettingsComponent extends Component {
	constructor(props) {
		super(props);

		Settings = this;

		this.panes = new Map();
	}

	h() {
		return (
			<div class="settings sidebar hidden">
				<div class="settings-main">
					<div class="sidebar-header">
						<i class="btn-icon tgico tgico-back" onClick={this.close}/>
						<div class="sidebar-title">Settings</div>
						<span class="btn-icon tgico tgico-more rp rps"/>
					</div>
					<div class="photo-container">
	                    <img class="photo" src=""/>
	                </div>
	                <div class="username"></div>
	                <div class="phone-number"></div>
	                <div class="list-menu">
	                	<MenuItemFragment icon="edit" name="Edit Profile"/>
	                	<MenuItemFragment icon="settings" name="General settings" click={_=>this.openPane("background-color")}/>
	                	<MenuItemFragment icon="unmute" name="Notifications"/>
	                	<MenuItemFragment icon="lock" name="Privacy and Security"/>
	                	<MenuItemFragment icon="language" name="Language"/>
	                </div>
				</div>
				<BackgroundColorComponent addPane={this.addPane} previousPane={this}/>
			</div>
			)
	}

	open() {
		this.fill();
		this.$el.classList.remove("hidden");
		this.$el.querySelector(".settings-main").style.display="block"
	}

	openPane(name) {
		let pane = this.panes.get(name);
		if(pane) pane.open();
		setTimeout(_ => {this.$el.querySelector(".settings-main").style.display="none"},500)
	}

	addPane(name, pane) {
		if(!this.panes.has(name)) this.panes.set(name, pane)
	}

	fill() {
		if(this.filled) return;

		let peer = PeersStore.self();
		if(peer.photo.bigUrl) {
			this.$el.querySelector(".photo-container > .photo").src = peer.photo.bigUrl;
		} else {
			peer.photo.fetchBig().then(url => this.$el.querySelector(".photo-container > .photo").src = url);
		}
		
		this.$el.querySelector(".username").innerText = peer.name;
		this.$el.querySelector(".phone-number").innerText = peer.phone;

		this.filled = true;
	}

	close() {
		this.$el.classList.toggle("hidden");
	}
}

const MenuItemFragment = ({ icon, name, click }) => {
    let iconClasses = ["menu-icon", "tgico", "tgico-" + icon]
    return (
        <div class="menu-item rp" onClick={click}>
			<i class={iconClasses.join(" ")}/>
			<div class="menu-title">{name}</div>
		</div>
    )
}