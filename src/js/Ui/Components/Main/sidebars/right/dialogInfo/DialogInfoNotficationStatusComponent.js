import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import {DialogInfoDetailsCheckboxFragment} from "./fragments/DialogInfoDetailsCheckboxFragment"
import MTProto from "../../../../../../MTProto/external";

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


    render() {
        const peer = this.callbacks.peer
        const muted = !peer || !peer.full || !peer.full.notify_settings || peer.full.notify_settings.mute_until > 0 || peer.full.notify_settings.pFlags.silent

        return (
            <DialogInfoDetailsCheckboxFragment text="Notifications" label={!muted ? "Enabled" : "Disabled"} checked={!muted} onChange={l => this.onChange(l)}/>
        )
    }

    onChange(ev) {
        AppSelectedInfoPeer.Current.api.updateNotifySettings({mute_until: ev.target.checked ? 0 : 2147483647}).then(l => {
            this.forceUpdate()
        })
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.forceUpdate()
        }
    }
}