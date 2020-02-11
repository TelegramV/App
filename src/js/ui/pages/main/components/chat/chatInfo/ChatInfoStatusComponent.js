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
        E.bus(AppEvents.Dialogs)
            .on("updateActions", this.onDialogsUpdateActions)

        E.bus(AppEvents.Peers)
            .on("updateUserStatus", this.peersBusFired)
            .on("updateChatOnlineCount", this.peersBusFired)
            .on("fullLoaded", this.peersBusFired)
    }

    h() {
        return (
            <div className="bottom">
                <div css-display={AppSelectedPeer.isSelected && AppSelectedPeer.Current.isSelf ? "none" : ""}
                     className={["info", this.statusLine.online ? "online" : "", this.statusLine.isAction ? "loading-text" : ""]}>{this.statusLine.text}</div>
            </div>
        )
    }

    onDialogsUpdateActions = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            this.__patch()
        }
    }

    get action() {
        if (this.callbacks.peer && this.callbacks.peer.dialog && this.callbacks.peer.dialog.actions.size > 0) {
            const action = this.callbacks.peer.dialog.actionText

            if (action) {
                return action.user + " " + action.action
            }
        }

        return false
    }


    get statusLine() {
        if (AppSelectedPeer.isNotSelected) {
            return "..."
        }

        const action = this.action

        if (action) {
            return {text: action, isAction: true}
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