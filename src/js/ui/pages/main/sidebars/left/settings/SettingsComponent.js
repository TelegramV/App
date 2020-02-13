import Component from "../../../../../v/vrdom/Component"
import PeersStore from "../../../../../../api/store/PeersStore"
import { LeftBarComponent } from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import BackgroundColorComponent from "./background/BackgroundColorComponent"
import BackgroundImageComponent from "./background/BackgroundImageComponent"
import { ContextMenuManager } from "../../../../../contextMenuManager";
import GeneralSettingsComponent from "./GeneralSettingsComponent"
import {logout} from "../../../../../../api/logout"

export class SettingsComponent extends LeftBarComponent {
    barName = "settings";
    constructor(props) {
        super(props);
    }

    h() {
        return (
            <div class="settings sidebar scrollable hidden">
				<div class="settings-main">
					<div class="sidebar-header">
						<i class="btn-icon tgico tgico-back" onClick={_ => this.openPane("dialogs")}/>
						<div class="sidebar-title">Settings</div>
						<span class="btn-icon tgico tgico-more rp rps" onClick={ev => {
							ContextMenuManager.openBelow([
							{
								icon: "logout",
	                            title: "Log out",
	                            onClick: _ => {
                                    logout()
                                }
							}
							], ev.currentTarget, "right-top")}}/>
					</div>
					<div class="photo-container">
	                    <img class="photo" src=""/>
	                </div>
	                <div class="username"></div>
	                <div class="phone-number"></div>
	                <div class="list-menu">
	                	<ButtonWithIconFragment icon="edit" name="Edit Profile"/>
	                	<ButtonWithIconFragment icon="settings" name="General settings" click={_=>this.openPane("general-settings")}/>
	                	<ButtonWithIconFragment icon="unmute" name="Notifications"/>
	                	<ButtonWithIconFragment icon="lock" name="Privacy and Security"/>
	                	<ButtonWithIconFragment icon="language" name="Language"/>
	                </div>
				</div>
				<GeneralSettingsComponent previous="settings"/>
				<BackgroundImageComponent previous="general-settings"/>
				<BackgroundColorComponent previous="background-image"/>
			</div>
        )
    }

    barOnShow = () => {
        this.open();
    }

    open = () => {
        this.fill();
        this.$el.classList.remove("hidden");
    }

    openPane = (name) => {
        UIEvents.LeftSidebar.fire("show", {
            barName: name
        })
    }

    fill = () => {
        if (this.filled) return;

        let peer = PeersStore.self();
        if (!peer) {
            this.openPane("dialogs") //cancelling opening, no info loaded yet
            return;
        }
        if (peer.photo.bigUrl) {
            this.$el.querySelector(".photo-container > .photo").src = peer.photo.bigUrl;
        } else {
            peer.photo.fetchBig().then(url => this.$el.querySelector(".photo-container > .photo").src = url);
        }

        this.$el.querySelector(".username").innerText = peer.name;
        this.$el.querySelector(".phone-number").innerText = peer.phone;

        this.filled = true;
    }

    barOnHide = (ev) => {
        if (this._isSettingsBar(ev.barName)) return;
        this.close();
    }

    close = () => {
        this.$el.classList.add("hidden");
    }

    _isSettingsBar = (name) => {
        switch (name) {
            case "background-color":
            case "general-settings":
                return true;
            default:
                return false;
        }
    }
}

export const ButtonWithIconFragment = ({ icon, name, click, slot }) => {
    let iconClasses = ["button-icon", "tgico", "tgico-" + icon]
    return (
        <div class="button-with-icon rp" onClick={click}>
			{icon? <i class={iconClasses.join(" ")}/> : slot}
			<div class="button-title">{name}</div>
		</div>
    )
}