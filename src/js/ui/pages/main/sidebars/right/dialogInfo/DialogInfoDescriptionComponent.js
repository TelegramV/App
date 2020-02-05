import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../../../../api/eventBus/EventBus"
import {DialogInfoDescriptionFragment} from "./fragments/DialogInfoDescriptionFragment"

export class DialogInfoDescriptionComponent extends VComponent {

    init() {
        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.Default
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateStatus", this.defaultPeersUpdateHandler)
            .on("updateUserStatus", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    h() {
        const peer = this.callbacks.peer

        if (!peer) {
            return (
                <DialogInfoDescriptionFragment name=""
                                               status=""/>
            )
        }

        const name = peer.isSelf ? "Saved Messages" : peer.name

        if (peer.isSelf) {
            return (
                <DialogInfoDescriptionFragment name={name}
                                               status=""/>
            )
        }

        if (peer.statusString.online) {
            return (
                <DialogInfoDescriptionFragment name={name}
                                               status={peer.statusString.text}
                                               isOnline/>
            )
        }

        return (
            <DialogInfoDescriptionFragment name={name}
                                           status={peer.statusString.text}/>
        )
    }

    defaultPeersUpdateHandler = (event: BusEvent) => {
        if (AppSelectedInfoPeer.check(event.peer)) {
            this.__patch()
        }
    }
}