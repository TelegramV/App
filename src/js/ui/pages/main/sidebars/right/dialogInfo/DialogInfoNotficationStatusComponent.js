import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../api/eventBus/EventBus"
import {DialogInfoDetailsCheckboxFragment} from "./fragments/DialogInfoDetailsCheckboxFragment"
import MTProto from "../../../../../../mtproto/external";

export class DialogInfoNotficationStatusComponent extends VComponent {

    init() {
        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.Default
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateNotificationStatus", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    h() {
        const peer = this.callbacks.peer
        const muted = !peer || !peer.full || !peer.full.notify_settings || peer.full.notify_settings.mute_until > 0 || peer.full.notify_settings.pFlags.silent

        return (
            <DialogInfoDetailsCheckboxFragment text="Notifications" label={!muted ? "Enabled" : "Disabled"} checked={!muted} onChange={l => this.onChange(l)}/>
        )
    }

    onChange(ev) {
        AppSelectedInfoPeer.Current.api.updateNotifySettings({mute_until: ev.target.checked ? 0 : 2147483647}).then(l => {
            this.__patch()
        })
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}