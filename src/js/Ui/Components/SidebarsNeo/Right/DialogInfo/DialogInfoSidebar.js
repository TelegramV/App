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

export class DialogInfoSidebar extends RightSidebar {

    materialsRef = VComponent.createComponentRef()

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("info.select", this.onInfoSelect)

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

        return <this.contentWrapper>
            <AvatarComponent peer={peer}/>
            <Header>{peer?.name}</Header>
            <Subheader isOnline={peer?.statusString.online}>{peer?.statusString.text}</Subheader>

            <Section>
                <IconText icon="info" text={peer?.full?.about} description="Bio"/>
                <IconText icon="username" text={peer?.username} description="Username"/>
                <IconText icon="phone" text={peer?.phone} description="Phone"/>
                <CheckboxButton checked={!muted} text="Notifications" isDescriptionAsState onClick={this.changeNotificationsStatus}/>
            </Section>

            <DialogInfoMaterials ref={this.materialsRef}/>
        </this.contentWrapper>
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
        return "Info"
    }
}