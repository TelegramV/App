import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {DialogInfoDetailsFragment} from "./Fragments/DialogInfoDetailsFragment"
import UIEvents from "../../../../EventBus/UIEvents"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

export class DialogInfoUsernameComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => AppSelectedInfoPeer.check(event.peer))
            .updateOn("updateUsername")
            .updateOn("fullLoaded")

        E.bus(UIEvents.General)
            .updateOn("info.select")
    }


    render() {
        const peer = AppSelectedInfoPeer.Current

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