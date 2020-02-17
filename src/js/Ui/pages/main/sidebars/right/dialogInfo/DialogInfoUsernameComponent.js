import {VComponent} from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import {DialogInfoDetailsFragment} from "./fragments/DialogInfoDetailsFragment"

export class DialogInfoUsernameComponent extends VComponent {

    init() {
        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.Default
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateUsername", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    h() {
        const peer = this.callbacks.peer

        if (!peer || !peer.username) {
            return (
                <DialogInfoDetailsFragment icon="username"
                                           hidden
                                           label="Username"/>
            )
        }

        return (
            <DialogInfoDetailsFragment icon="username"
                                       text={peer.username}
                                       label="Username"/>
        )
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}