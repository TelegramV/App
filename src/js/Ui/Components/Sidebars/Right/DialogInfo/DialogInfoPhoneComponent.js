import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"
import UIEvents from "../../../../EventBus/UIEvents"

export class DialogInfoPhoneComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updatePhone")
            .on("fullLoaded")

        E.bus(UIEvents.General)
            .on("info.select")
    }


    render() {
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
}