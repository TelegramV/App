import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsCheckboxFragment} from "./Fragments/DialogInfoDetailsCheckboxFragment"
import UIEvents from "../../../../EventBus/UIEvents"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

export class DialogInfoNotificationStatusComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updateNotificationStatus")
            .on("fullLoaded")

        E.bus(UIEvents.General)
            .on("info.select")
    }


    render() {
        const peer = AppSelectedInfoPeer.Current

        const muted = !peer || !peer.full || !peer.full.notify_settings || peer.full.notify_settings.mute_until > 0 || peer.full.notify_settings.silent

        return (
            <DialogInfoDetailsCheckboxFragment text="Notifications"
                                               label={!muted ? "Enabled" : "Disabled"}
                                               checked={!muted}
                                               onChange={event => this.onChange(event)}/>
        )
    }

    onChange(ev) {
        AppSelectedInfoPeer.Current.api.updateNotifySettings({mute_until: ev.target.checked ? 0 : 2147483647}).then(l => {
            this.forceUpdate()
        })
    }
}