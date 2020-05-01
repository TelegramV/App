import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import VApp from "../../../../../V/vapp"
import UIEvents from "../../../../EventBus/UIEvents"
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import {CallsManager} from "../../../../../Api/Calls/CallManager";
import {UserPeer} from "../../../../../Api/Peers/Objects/UserPeer";

class ChatInfoCallButtonComponent extends VComponent {

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
        //CallsManager.startCall(AppSelectedChat.current)
    }

    onChatSelect = (event) => {
        this.forceUpdate()
    }
}

export default ChatInfoCallButtonComponent