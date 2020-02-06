import Component from "../../../../../v/vrdom/Component"
import PeersStore from "../../../../../../api/store/PeersStore"
import { LeftBarComponent } from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import { BackgroundColorComponent } from "./background/BackgroundColorComponent"
import { ContextMenuManager } from "../../../../../contextMenuManager";

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
	                            onClick: _ => {}
							}
							], ev.currentTarget, "right-top")}}/>
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
				<BackgroundColorComponent previous="settings"/>
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

    barOnHide = (name) => {
        if (this._isSettingsBar(name)) return;
        this.close();
    }

    close = () => {
        this.$el.classList.add("hidden");
    }

    _isSettingsBar = (name) => {
        switch (name) {
            case "background-color":
                return true;
            default:
                return false;
        }
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