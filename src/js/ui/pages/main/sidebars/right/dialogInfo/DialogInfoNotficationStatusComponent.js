import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../api/eventBus/EventBus"
import {DialogInfoDetailsCheckboxFragment} from "./fragments/DialogInfoDetailsCheckboxFragment"

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

        return (
            <DialogInfoDetailsCheckboxFragment text="Notifications" label="Enabled"/>
        )
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}