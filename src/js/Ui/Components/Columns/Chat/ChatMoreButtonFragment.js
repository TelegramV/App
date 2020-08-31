import { IS_MOBILE_SCREEN } from "../../../../Utils/browser";
import VUI from "../../../VUI"
import API from "../../../../Api/Telegram/API"
import UIEvents from "../../../EventBus/UIEvents"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import {UserPeer} from "../../../../Api/Peers/Objects/UserPeer";
import {CallsManager} from "../../../../Api/Calls/CallManager";

const ChatMoreButtonFragment = ({}) => {
    const buttons = [];
    const current = AppSelectedChat.current;
    if (IS_MOBILE_SCREEN && current) {
        buttons.push({
            icon: "search",
            title: "Search",
            onClick: () => UIEvents.General.fire("search.open")
        })

        const canCall = current instanceof UserPeer && !current.isBot
        if (canCall) {
            buttons.push({
                icon: "phone",
                title: "Call",
                onClick: () => CallsManager.startCall(AppSelectedChat.current)
            })
        }

        if(current.type === "channel") {
            if(current.isLeft) {
                buttons.push({
                    icon: "adduser",
                    title: "Subscribe",
                    onClick: () => {API.channels.joinChannel(current)}
                })
            } else {
                buttons.push({
                    icon: "logout",
                    title: "Leave",
                    onClick: () => {API.channels.leaveChannel(current)}
                })
            }
        }

    }
    return (
        <div className="btn-icon rp rps tgico-more" onClick={VUI.ContextMenu.listener(buttons)}/>
    )
}

export default ChatMoreButtonFragment;