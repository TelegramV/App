import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../Reactive/SelectedPeer"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import type {BusEvent} from "../../../../../Api/EventBus/EventBus"

class ChatInfoNameComponent extends VComponent {

    patchingStrategy = VRDOM.COMPONENT_PATCH_FAST

    callbacks = {
        peer: AppSelectedPeer.Reactive.PatchOnly
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateName", this.peersUpdateName)
    }

    render() {
        if (!this.callbacks.peer) {
            return (
                <div id="messages-title" className="title">
                    ...
                </div>
            )
        }

        const peer = this.callbacks.peer

        return (
            <div id="messages-title" className="title" onClick={this.openPeerInfo}>
                {peer.isSelf ? "Saved Messages" : peer.name}
            </div>
        )
    }

    peersUpdateName = (event: BusEvent) => {
        if (AppSelectedPeer.check(event.peer)) {
                this.forceUpdate()
        }
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(this.callbacks.peer)
    }
}

export default ChatInfoNameComponent