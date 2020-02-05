import AppEvents from "../../../../../../api/eventBus/AppEvents"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import type {BusEvent} from "../../../../../../api/eventBus/EventBus"

class ChatInfoStatusComponent extends VComponent {

    patchingStrategy = VRDOM.COMPONENT_PATCH_FAST

    callbacks = {
        peer: AppSelectedPeer.Reactive.PatchOnly
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updateUserStatus", this.peersBusFired)
            .on("fullLoaded", this.peersBusFired)
    }

    h() {
        return (
            <div className="bottom">
                <div css-display={AppSelectedPeer.isSelected && AppSelectedPeer.Current.isSelf ? "none" : ""}
                     className={["info", this.statusLine.online ? "online" : ""]}>{this.statusLine.text}</div>
            </div>
        )
    }

    get statusLine() {
        if (AppSelectedPeer.isNotSelected) {
            return "..."
        }

        const peer = AppSelectedPeer.Current

        return peer.statusString
    }

    peersBusFired = (event: BusEvent) => {
        if (AppSelectedPeer.check(event.peer)) {
            this.__patch()
        }
    }
}

export default ChatInfoStatusComponent