import AppEvents from "../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../V/VRDOM/component/VComponent"
import type {BusEvent} from "../../../../Api/EventBus/EventBus"
import UIEvents from "../../../EventBus/UIEvents"

class ChatInfoNameComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateName", this.peersUpdateName)

        E.bus(UIEvents.General)
            .on("chat.select")
    }

    render() {
        if (AppSelectedChat.isNotSelected) {
            return (
                <div id="messages-title" className="title">
                    ...
                </div>
            )
        }

        const peer = AppSelectedChat.Current

        return (
            <div id="messages-title" className="title" onClick={this.openPeerInfo}>
                {peer.isSelf ? "Saved Messages" : peer.name}
            </div>
        )
    }

    peersUpdateName = (event: BusEvent) => {
        if (AppSelectedChat.check(event.peer)) {
            this.forceUpdate()
        }
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.Current)
    }
}

export default ChatInfoNameComponent