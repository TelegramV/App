import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../api/eventBus/EventBus"
import {DialogInfoDetailsFragment} from "./fragments/DialogInfoDetailsFragment"

export class DialogInfoBioComponent extends VComponent {

    init() {
        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.Default
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateBio", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    h() {
        const peer = this.callbacks.peer

        if (!peer || !peer.full || !peer.full.about) {
            return (
                <DialogInfoDetailsFragment icon="info"
                                           hidden
                                           label="Bio"/>
            )
        }

        return (
            <DialogInfoDetailsFragment icon="info"
                                       text={peer.full.about}
                                       label="Bio"/>
        )
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}