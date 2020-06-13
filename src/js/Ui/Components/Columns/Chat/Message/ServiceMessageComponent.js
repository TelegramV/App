import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import {MessageParser} from "../../../../../Api/Messages/MessageParser"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import PeersStore from "../../../../../Api/Store/PeersStore"
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent"

class ServiceMessageComponent extends GeneralMessageComponent {
    render() {
        const photo = this.props.message?.action?.photo;
        const message = this.prepare();
        return (
            <div className="service">
                <div className="service-msg">{Array.isArray(message) ? message.flat(Infinity) : message}</div>
                {photo && <BetterPhotoComponent className="photo" photo={photo} wrapFigure={false}/>}
            </div>
        )
    }

    prepare() {
        let message = this.props.message;
        let action = message.action;
        let type = action._
        if (type === "messageActionPinMessage") {
            let text = MessageParser.getMediaPreviewName(message.replyToMessage);
            if (text === "") {
                text = `"${message.replyToMessage?.text || "..."}"`;
                if (text.length > 20) {
                    text = text.substring(0, 20) + "...";
                }
            } else {
                text = "a " + text.toLowerCase();
            }
            return [this.wrapPeer(message.from),
                " pinned ",
                <span class="clickable" onClick={_ => this.scrollToMessage(message.replyToMessage)}>{text}</span>]
        }

        if (type === "messageActionChatEditTitle") {
            if (message.from.type === "channel") {
                return `Channel name was changed to "${action.title}"`
            }
            return [this.wrapPeer(message.from),
                " changed group name to ",
                `"${action.title}"`];
        }

        if (type === "messageActionChatDeletePhoto") {
            if (message.from.type === "channel") {
                return "Channel photo removed";
            }
            return [this.wrapPeer(message.from),
                " removed group photo"]
        }

        if (type === "messageActionChatEditPhoto") {
            if (message.from.type === "channel") {
                return "Channel photo updated";
            }
            return [this.wrapPeer(message.from),
                " updated group photo"]
        }

        if (type === "messageActionChatCreate") {
            return [this.wrapPeer(message.from),
                " created the group ",
                `"${action.title}"`]
        }

        if (type === "messageActionChatAddUser") {
            if (action.users.length === 1 && action.users[0] === message.from.id) {
                return [this.wrapPeer(message.from),
                    " joined the group"]
            }

            let users = [];
            for (let userId of action.users) {
                let peer = PeersStore.get("user", userId);
                if (peer) {
                    if (users.length > 0) users.push(", ");
                    users.push(this.wrapPeer(peer));
                }
            }
            return [this.wrapPeer(message.from),
                " added ",
                users
            ]
        }

        if (type === "messageActionChatDeleteUser") {
            let removed = PeersStore.get("user", action.user_id);
            if (message.from === removed) {
                return [this.wrapPeer(message.from),
                    " left the group"]
            }
            return [this.wrapPeer(message.from),
                " removed ",
                this.wrapPeer(removed)
            ]
        }

        if (type === "messageActionChatJoinedByLink") {
            let inviter = PeersStore.get("user", action.inviter_id);
            return [this.wrapPeer(inviter),
                " added ",
                this.wrapPeer(message.from),
                " via invite link"
            ]
        }

        if (type === "messageActionChannelCreate") {
            if (message.from.type === "channel") {
                return `Channel created`;
            } else {
                return [this.wrapPeer(message.from),
                    ` created the group "${action.title}"`]
            }
        }

        if (type === "messageActionGameScore") {
            let game = AppSelectedChat.current.messages.getGamesById(action.game_id)[0];
            let append = [];
            if (game) {
                append = [" in ", game[0].title]
            }
            return [this.wrapPeerWithSelf(message.from),
                " scored " + action.score,
                append]
        }

        if (type === "messageActionScreenshotTaken") {
            return [this.wrapPeerWithSelf(message.from),
                " took a screenshot!"]
        }

        if (type === "messageActionBotAllowed") {
            return ["You allowed this bot to message you when you logged in on ",
                <a class="clickable" href={"http://" + action.domain} target="_blank">{action.domain}</a>]
        }

        if (type === "messageActionContactSignUp") {
            return [this.wrapPeer(message.from),
                " joined Telegram"]
        }

        if (type === "messageActionCustomAction") {
            return action.message;
        }

        if (type === "messageActionEmpty"
            || type === "messageActionChatMigrateTo"
            || type === "messageActionChannelMigrateFrom"
            || type === "messageActionHistoryClear") {
            return "";
        }

        return "Unimplemented " + type + " service message";
    }

    scrollToMessage = (message) => {
        if (!message) return;
        UIEvents.General.fire("chat.showMessage", {message: message})
    }

    wrapPeer = (peer) => {
        if (!peer) return "UNKNOWN USER";
        return (<span class="clickable" onClick={_ => {
            AppSelectedInfoPeer.select(peer)
        }}>{peer.name}</span>);
    }

    wrapPeerWithSelf = (peer) => {
        if (!peer) return "UNKNOWN USER";
        let text = peer.isSelf ? "You" : peer.name;
        return (<span class="clickable" onClick={_ => {
            AppSelectedInfoPeer.select(peer)
        }}>{text}</span>);
    }
}

export default ServiceMessageComponent