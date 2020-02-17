import {VComponent} from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import {DialogInfoDetailsFragment} from "./fragments/DialogInfoDetailsFragment"

export class DialogInfoPhoneComponent extends VComponent {

    init() {
        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.Default
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updatePhone", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    h() {
        const peer = this.callbacks.peer

        if (!peer || !peer.phone) {
            return (
                <DialogInfoDetailsFragment icon="phone"
                                           hidden
                                           label="Phone"/>
            )
        }

        return (
            <DialogInfoDetailsFragment icon="phone"
                                       text={`+${peer.phone}`}
                                       label="Phone"/>
        )
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}