import AppEvents from "../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import type {BusEvent} from "../../../../Api/EventBus/EventBus"
import UIEvents from "../../../EventBus/UIEvents"

class ChatInfoStatusComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("updateActions", this.onDialogsUpdateActions)

        E.bus(AppEvents.Peers)
            .on("updateUserStatus", this.peersBusFired)
            .on("updateChatOnlineCount", this.peersBusFired)
            .on("fullLoaded", this.peersBusFired)

        E.bus(UIEvents.General)
            .on("chat.select")
    }

    render() {
        return (
            <div className="bottom">
                <div css-display={AppSelectedChat.isSelected && AppSelectedChat.Current.isSelf ? "none" : ""}
                     className={["info", this.statusLine.online ? "online" : "", this.statusLine.isAction ? "loading-text" : ""]}>{this.statusLine.text}</div>
            </div>
        )
    }

    onDialogsUpdateActions = event => {
        if (AppSelectedChat.check(event.dialog.peer)) {
            this.forceUpdate()
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
        if (AppSelectedChat.isNotSelected) {
            return "..."
        }

        const action = this.action

        if (action) {
            return {text: action, isAction: true}
        }

        const peer = AppSelectedChat.Current

        return peer.statusString
    }

    peersBusFired = (event: BusEvent) => {
        if (AppSelectedChat.check(event.peer)) {
            this.forceUpdate()
        }
    }
}

export default ChatInfoStatusComponent