import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"
import UIEvents from "../../../../EventBus/UIEvents"

export class DialogInfoPhoneComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .updateOn("updatePhone")
            .updateOn("fullLoaded")

        E.bus(UIEvents.General)
            .updateOn("info.select")
    }


    render() {
        const peer = AppSelectedInfoPeer.Current

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