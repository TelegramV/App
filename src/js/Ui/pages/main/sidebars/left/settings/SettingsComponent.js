import PeersStore from "../../../../../../Api/Store/PeersStore"
import {LeftBarComponent} from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import BackgroundColorComponent from "./background/BackgroundColorComponent"
import BackgroundImageComponent from "./background/BackgroundImageComponent"
import {ContextMenuManager} from "../../../../../contextMenuManager";
import GeneralSettingsComponent from "./GeneralSettingsComponent"
import {logout} from "../../../../../../Api/General/logout"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"

const SettingsMainFragment = ({me, selfAvatarFragmentRef, openPane}) => {
    return (
        <div className="settings-main">
            <div className="sidebar-header">
                <i className="btn-icon tgico tgico-back" onClick={_ => openPane("dialogs")}/>
                <div className="sidebar-title">Settings</div>
                <span className="btn-icon tgico tgico-more rp rps" onClick={ev => {
                    ContextMenuManager.openBelow([
                        {
                            icon: "logout",
                            title: "Log out",
                            onClick: _ => {
                                logout()
                            }
                        }
                    ], ev.currentTarget, "right-top")
                }}/>
            </div>
            <div class="photo-container ">

                {me ? <img ref={selfAvatarFragmentRef} className="photo" src={me.photo.smallUrl} alt="avatar"/> : <div/>}
            </div>
            <div className="username">{me ? me.name : ""}</div>
            <div className="phone-number">+{me ? me.phone : ""}</div>
            <div className="list-menu">
                <ButtonWithIconFragment icon="edit" name="Edit Profile"/>
                <ButtonWithIconFragment icon="settings" name="General settings"
                                        click={_ => openPane("general-settings")}/>
                <ButtonWithIconFragment icon="unmute" name="Notifications"/>
                <ButtonWithIconFragment icon="lock" name="Privacy and Security"/>
                <ButtonWithIconFragment icon="language" name="Language"/>
            </div>
        </div>
    )
}

export class SettingsComponent extends LeftBarComponent {

    barName = "settings"

    selfAvatarFragmentRef = VComponent.createFragmentRef()
    settingsMainRef = VComponent.createFragmentRef()

    reactive(R) {
        PeersStore.onSet(({peer}) => {
            if (peer.isSelf) {
                R.object(peer)
                    .on("updatePhotoSmall", this.onSelfPhotoUpdate)
                    .on("updatePhoto", this.onSelfPhotoUpdate)

                this.settingsMainRef.patch({
                    me: peer
                })
            }
        })
    }

    h() {
        const me = PeersStore.self()

        return (
            <div class="settings sidebar scrollable hidden">
                <SettingsMainFragment me={me}
                                      ref={this.settingsMainRef}
                                      selfAvatarFragmentRef={this.selfAvatarFragmentRef}
                                      openPane={this.openPane}/>
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

    onSelfPhotoUpdate = _ => {
        // this.selfAvatarFragmentRef.patch({
        //     photo: PeersStore.self().photo
        // })
    }

    fill = () => {
        if (this.filled) return;

        let peer = PeersStore.self();
        if (!peer) {
            this.openPane("dialogs") //cancelling opening, no info loaded yet
            return;
        }

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

export const ButtonWithIconFragment = ({icon, name, click, slot}) => {
    let iconClasses = ["button-icon", "tgico", "tgico-" + icon]
    return (
        <div class="button-with-icon rp" onClick={click}>
            {icon ? <i class={iconClasses.join(" ")}/> : slot}
            <div class="button-title">{name}</div>
        </div>
    )
}