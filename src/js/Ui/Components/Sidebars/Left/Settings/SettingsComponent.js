import PeersStore from "../../../../../Api/Store/PeersStore"
import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import BackgroundColorComponent from "./Background/BackgroundColorComponent"
import BackgroundImageComponent from "./Background/BackgroundImageComponent"
import GeneralSettingsComponent from "./GeneralSettingsComponent"
import {logout} from "../../../../../Api/General/logout"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import VUI from "../../../../VUI"
import {ButtonWithIconFragment} from "../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../Fragments/SectionFragment";
import AvatarComponent from "../../../Basic/AvatarComponent"
import EditProfilePane from "./EditProfilePane"
import PrivacyAndSecurityPane from "./Privacy/PrivacyAndSecurityPane"
import {BurgerAndBackComponent} from "../BurgerAndBackComponent";
import FoldersPane from "./Folders/FoldersPane";

const SettingsMainFragment = ({me, selfAvatarFragmentRef, openPane}) => {
    return (
        <div className="settings-main">
            <div className="sidebar-header no-borders">
                <BurgerAndBackComponent/>
                {/*<i className="btn-icon tgico tgico-back rp rps" onClick={_ => openPane("dialogs")}/>*/}
                <div className="sidebar-title">Settings</div>
                <span className="btn-icon tgico tgico-more rp rps" onClick={ev => {
                    VUI.ContextMenu.openBelow([
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
            <div class="photo-container">
                {me ? <AvatarComponent peer={me}/> : <div/>}
            </div>
            <div className="username">{me ? me.name : ""}</div>
            <div className="phone-number">+{me ? me.phone : ""}</div>
            <SectionFragment noBorders>
                <ButtonWithIconFragment icon="edit"
                                        name="Edit Profile"
                                        onClick={() => openPane("edit-profile")}/>
                <ButtonWithIconFragment icon="settings"
                                        name="General settings"
                                        onClick={_ => openPane("general-settings")}/>

                <ButtonWithIconFragment icon="unmute" name="Notifications"/>
                <ButtonWithIconFragment icon="lock"
                                        name="Privacy and Security"
                                        onClick={_ => openPane("privacy-security")}/>

                <ButtonWithIconFragment icon="smile"
                                        name="Folders"
                                        onClick={_ => openPane("folder-settings")}/>
                <ButtonWithIconFragment icon="language" name="Language"/>
            </SectionFragment>
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

    appEvents(E) {
        super.appEvents(E)
        E.bus(UIEvents.LeftSidebar)
            .on("burger.backPressed", this.onBackPressed)
    }

    render() {
        const me = PeersStore.self()

        return (
            <div class="settings sidebar scrollable hidden">
                <SettingsMainFragment me={me}
                                      ref={this.settingsMainRef}
                                      selfAvatarFragmentRef={this.selfAvatarFragmentRef}
                                      openPane={this.openPane}/>

                <EditProfilePane previous="settings"/>
                <FoldersPane previous="settings"/>
                <PrivacyAndSecurityPane previous="settings"/>
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
        UIEvents.LeftSidebar.fire("burger.changeToBack", {
            id: this.barName
        })
        this.fill();
        this.$el.classList.remove("hidden");
    }

    openPane = (name) => {
        UIEvents.LeftSidebar.fire("show", {
            barName: name
        })
    }

    onBackPressed = (event) => {
        if(event.id === this.barName) {
            this.openPane("dialogs")
        }
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
        UIEvents.LeftSidebar.fire("burger.changeToBurger", {})
    }

    // dich
    _isSettingsBar = (name) => {
        switch (name) {
            case "background-color":
            case "general-settings":
            case "folder-settings":
            case "privacy-security":
            case "edit-profile":
                return true;
            default:
                return false;
        }
    }
}
