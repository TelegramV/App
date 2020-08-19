import {RightSidebar} from "../RightSidebar";
import AvatarComponent from "../../../Basic/AvatarComponent";
import Header from "../../Fragments/Header";
import Subheader from "../../Fragments/Subheader";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import UIEvents from "../../../../EventBus/UIEvents";
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import {Section} from "../../Fragments/Section";
import IconText from "../../Fragments/IconText";
import CheckboxButton from "../../Fragments/CheckboxButton";
import {DialogInfoMaterials} from "./Fragments/DialogInfoMaterials";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import {getNewlines} from "../../../../../Utils/htmlHelpers"

export class DialogInfoSidebar extends RightSidebar {

    materialsRef = VComponent.createComponentRef()

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("info.select", this.onInfoSelect)
            .on("chat.select", this.onChatSelect)


        E.bus(AppEvents.Peers)
            .filter(event => AppSelectedInfoPeer.check(event.peer))
            .updateOn("updateStatus")
            .updateOn("updateUserStatus")
            .updateOn("updateChatOnlineCount")
            .updateOn("updateBio")
            .updateOn("updateUsername")
            .updateOn("updateNotificationStatus")
            .updateOn("fullLoaded")
    }


    content(): * {
        const peer = AppSelectedInfoPeer.Current
        const muted = !peer || !peer.full || !peer.full.notify_settings || peer.full.notify_settings.mute_until > 0 || peer.full.notify_settings.silent

        let bio = getNewlines(peer?.full?.about);
        return <this.contentWrapper onScroll={this.materialsRef.component?.onScroll}>
            <AvatarComponent peer={peer} alwaysPlay/>
            <Header>{peer?.isSelf ? this.l("lng_saved_messages") : peer?.name}</Header>
            <Subheader>{this.lp(peer?.status)}</Subheader>

            <Section>
                <IconText icon="info" text={bio} description={this.l("lng_info_bio_label")}/>
                <IconText icon="username" text={peer?.username} description={this.l("lng_info_username_label")}/>
                <IconText icon="phone" text={peer?.phone} description={this.l("lng_info_mobile_label")}/>
                <CheckboxButton checked={!muted} text={this.l("lng_profile_enable_notifications")} isDescriptionAsState onClick={this.changeNotificationsStatus}/>
            </Section>

            <DialogInfoMaterials ref={this.materialsRef}/>
        </this.contentWrapper>
    }

    onChatSelect = (event) => {
        if(!this.state.hidden) {
            AppSelectedInfoPeer.select(event.peer)
        }
    }

    onInfoSelect = () => {
        UIEvents.Sidebars.fire("push", DialogInfoSidebar)
    }

    changeNotificationsStatus = () => {
        const peer = AppSelectedInfoPeer.Current
        const nowMuted = !peer || !peer.full || !peer.full.notify_settings || peer.full.notify_settings.mute_until > 0 || peer.full.notify_settings.silent
        peer.api.updateNotifySettings({mute_until: nowMuted ? 0 : 2147483647}).then(_ => {
            this.forceUpdate()
        })
    }

    onShown(params) {
        if (!AppSelectedInfoPeer.Current.full) {
            AppSelectedInfoPeer.Current.fetchFull()
        }

        this.materialsRef.component.update()
    }

    update() {
        // this.forceUpdate()
        this.materialsRef.component.update()
    }

    get headerBorder(): boolean {
        return false
    }

    get title(): string | * {
        return this.l("lng_profile_info_section")
    }
}