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
import {FoldersSidebar} from "./Folders/FoldersSidebar";
import {SuperSecretSettingsSidebar} from "./SuperSecretSettingsSidebar";

export class SettingsSidebar extends LeftSidebar {

    content() {
        const me = PeersStore.self()

        return <this.contentWrapper>
            <AvatarComponent noSaved peer={me}/>
            <Header isLoading={!me}>{me?.name}</Header>
            <Subheader isLoading={!me}>{me ? "+" + me.phone : ""}</Subheader>

            <Section>
                <IconButton icon="edit" text={this.l("lng_settings_information")} onClick={_ => {
                }}/>
                <IconButton icon="folder" text={this.l("lng_settings_section_filters")}
                            onClick={_ => UIEvents.Sidebars.fire("push", FoldersSidebar)}/>
                <IconButton icon="settings" text={this.l("lng_settings_section_general")}
                            onClick={_ => UIEvents.Sidebars.fire("push", GeneralSidebar)}/>
                <IconButton icon="unmute" text={this.l("lng_settings_section_notify")}
                            onClick={_ => UIEvents.Sidebars.fire("push", NotificationsSidebar)}/>
                <IconButton icon="lock" text={this.l("lng_settings_section_privacy")}
                            onClick={_ => UIEvents.Sidebars.fire("push", PrivacySidebar)}/>
                <IconButton icon="language" text={this.l("lng_settings_language")}
                            onClick={_ => UIEvents.Sidebars.fire("push", LanguageSidebar)}/>
            </Section>
        </this.contentWrapper>
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
        return this.l("lng_menu_settings")
    }


    onMoreClicked = (ev) => {
        VUI.ContextMenu.openBelow([
            {
                icon: "logout",
                title: this.l("lng_settings_logout"),
                onClick: _ => {
                    logout()
                }
            },
            {
                icon: "eats",
                title: "Super Secret Settings",
                onClick: _ => {
                    UIEvents.Sidebars.fire("push", SuperSecretSettingsSidebar)
                }
            }
        ], ev.currentTarget, "right-top")
    }
}