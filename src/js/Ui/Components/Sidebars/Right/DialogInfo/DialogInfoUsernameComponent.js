import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"
import UIEvents from "../../../../EventBus/UIEvents"

export class DialogInfoUsernameComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updateUsername")
            .on("fullLoaded")

        E.bus(UIEvents.General)
            .on("info.select")
    }


    render() {
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
}