import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogInfoDescriptionFragment} from "./Fragments/DialogInfoDescriptionFragment"
import UIEvents from "../../../../../EventBus/UIEvents"

export class DialogInfoDescriptionComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updateStatus")
            .on("updateUserStatus")
            .on("updateChatOnlineCount")
            .on("fullLoaded")

        E.bus(UIEvents.General)
            .on("info.select")
    }


    render() {
        const peer = AppSelectedInfoPeer.Current

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
}