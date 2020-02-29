import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"
import UIEvents from "../../../../../EventBus/UIEvents"

export class DialogInfoBioComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updateBio")
            .on("fullLoaded")

        E.bus(UIEvents.General)
            .on("info.select")
    }


    render() {
        const peer = AppSelectedInfoPeer.Current

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
}