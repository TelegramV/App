import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import {UserPeer} from "../../../../../Api/Peers/Objects/UserPeer";
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import {CallsManager} from "../../../../../Api/Calls/CallManager";

class ChatInfoCallButtonComponent extends StatelessComponent {

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    render() {
        const canCall = AppSelectedChat.current instanceof UserPeer && !AppSelectedChat.current.isBot
        console.log("CAN CALL", canCall)
        return (
            <div className={{"btn-icon rp rps tgico-phone": true, "hidden": !canCall}} onClick={this.callContact}/>
        )
    }

    callContact = () => {
        CallsManager.startCall(AppSelectedChat.current)
    }

    onChatSelect = (event) => {
        this.forceUpdate()
    }
}

export default ChatInfoCallButtonComponent