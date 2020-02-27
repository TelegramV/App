import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import type {BusEvent} from "../../../../../../Api/EventBus/EventBus"
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
            .on("updateChatOnlineCount", this.defaultPeersUpdateHandler)
            .on("fullLoaded", this.defaultPeersUpdateHandler)
    }


    render() {
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
            this.forceUpdate()
        }
    }
}