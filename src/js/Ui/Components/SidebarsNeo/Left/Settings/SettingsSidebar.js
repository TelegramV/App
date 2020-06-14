import {LeftSidebar} from "../LeftSidebar";
import {Section} from "../../Fragments/Section";
import VUI from "../../../../VUI";
import {logout} from "../../../../../Api/General/logout";
import AvatarComponent from "../../../Basic/AvatarComponent";
import PeersStore from "../../../../../Api/Store/PeersStore";
import Header from "../../Fragments/Header";
import Subheader from "../../Fragments/Subheader";
import IconButton from "../../Fragments/IconButton";
import UIEvents from "../../../../EventBus/UIEvents";
import {GeneralSidebar} from "./General/GeneralSidebar";
import {NotificationsSidebar} from "./Notifications/NotificationsSidebar";
import {PrivacySidebar} from "./Privacy/PrivacySidebar";
import {LanguageSidebar} from "./LanguageSidebar";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";

export class SettingsSidebar extends LeftSidebar {

    content() {
        const me = PeersStore.self()

        return <this.contentWrapper>
            <AvatarComponent peer={me}/>
            <Header isLoading={!me}>{me?.name}</Header>
            <Subheader isLoading={!me}>{me ? "+" + me.phone : ""}</Subheader>

            <Section>
                <IconButton icon="edit" text="Edit Profile" onClick={_ => {}}/>
                <IconButton icon="folder" text="Folders" onClick={_ => {}}/>
                <IconButton icon="settings" text="General Settings" onClick={_ => UIEvents.Sidebars.fire("push", GeneralSidebar)}/>
                <IconButton icon="unmute" text="Notifications" onClick={_ => UIEvents.Sidebars.fire("push", NotificationsSidebar)}/>
                <IconButton icon="lock" text="Privacy and Security" onClick={_ => UIEvents.Sidebars.fire("push", PrivacySidebar)}/>
                <IconButton icon="language" text="Language" onClick={_ => UIEvents.Sidebars.fire("push", LanguageSidebar)}/>
            </Section>
        </this.contentWrapper>
    }

    reactive(R) {
        PeersStore.onSet(({peer}) => {
            if (peer.isSelf) {
                R.object(peer)
                    .on("updatePhotoSmall", this.forceUpdate)
                    .on("updatePhoto", this.forceUpdate)

                this.forceUpdate()
            }
        })
    }



    get rightButtons(): *[] {
        return [{
            icon: "more",
            onClick: this.onMoreClicked
        }]
    }

    get headerBorder(): boolean {
        return false
    }

    get title(): string | * {
        return "Settings"
    }


    onMoreClicked = (ev) => {
        VUI.ContextMenu.openBelow([
            {
                icon: "logout",
                title: "Log out",
                onClick: _ => {
                    logout()
                }
            }
        ], ev.currentTarget, "right-top")
    }
}