import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"

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


    render() {
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
            this.forceUpdate()
        }
    }
}