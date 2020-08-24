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
                <div className="service-msg">{message}</div>
                {photo && <BetterPhotoComponent className="photo" 
                                                autoplay
                                                muted
                                                loop
                                                photo={photo} 
                                                wrapFigure={false} 
                                                size={photo.video_sizes && photo.video_sizes[0]}/>}
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
                text = message.replyToMessage?.text || "...";
                if (text.length > 20) {
                    text = text.substring(0, 20) + "...";
                }
                return this.l("lng_action_pinned_message", {
                    from: this.wrapPeer(message.from),
                    text: <span class="clickable" onClick={_ => this.scrollToMessage(message.replyToMessage)}>{text}</span>
                })
            } else {
                return this.l("lng_action_pinned_media", {
                    from: this.wrapPeer(message.from),
                    media: <span class="clickable" onClick={_ => this.scrollToMessage(message.replyToMessage)}>{text}</span>
                })
            }
        }

        if (type === "messageActionChatEditTitle") {
            if (message.from.type === "channel") {
                return this.l("lng_action_changed_title_channel", {
                    title: action.title
                })
            }
            return this.l("lng_action_changed_title", {
                from: this.wrapPeer(message.from),
                title: action.title
            })
        }

        if (type === "messageActionChatDeletePhoto") {
            if (message.from.type === "channel") {
                return this.l("lng_action_removed_photo_channel")
            }
            return this.lp("lng_action_removed_photo", {
                from: this.wrapPeer(message.from)
            })
        }

        if (type === "messageActionChatEditPhoto") {
            // no difference for video or photo on Desktop
            /*if(action.photo?.video_sizes) {
                if (message.from.type === "channel") {
                    return "Channel video updated";
                }
                return [this.wrapPeer(message.from),
                    " changed group video"]
            } else {*/
                if (message.from.type === "channel") {
                    return this.l("lng_action_changed_photo_channel")
                }
                return this.l("lng_action_changed_photo", {
                    from: this.wrapPeer(message.from)
                })
            //}
        }

        if (type === "messageActionChatCreate") {
            return this.l("lng_action_created_chat", {
                from: this.wrapPeer(message.from),
                title: action.title
            })
        }

        if (type === "messageActionChatAddUser") {
            if (action.users.length === 1 && action.users[0] === message.from.id) {
                return this.l("lng_action_user_joined", {
                    from: this.wrapPeer(message.from)
                })
            }

            let users = [];
            for (let userId of action.users) {
                let peer = PeersStore.get("user", userId);
                if (peer) {
                    if (users.length > 0) users.push(", ");
                    users.push(this.wrapPeer(peer));
                }
            }
            if(users.length > 1) {
                return this.l("lng_action_add_users_many", {
                    from: this.wrapPeer(message.from),
                    users: users
                })
            } else {
                return this.l("lng_action_add_user", {
                    from: this.wrapPeer(message.from),
                    user: users[0]
                })
            }
        }

        if (type === "messageActionChatDeleteUser") {
            let removed = PeersStore.get("user", action.user_id);
            if (message.from === removed) {
                return this.l("lng_action_user_left", {
                    from: this.wrapPeer(message.from)
                })
            }
            return this.l("lng_action_kick_user", {
                from: this.wrapPeer(message.from),
                user: this.wrapPeer(removed)
            })
        }

        if (type === "messageActionChatJoinedByLink") {
            //let inviter = PeersStore.get("user", action.inviter_id);
            return this.l("lng_action_user_joined_by_link", {
                from: this.wrapPeer(message.from)
            })
        }

        if (type === "messageActionChannelCreate") {
            if (message.from.type === "channel") {
                return this.l("lng_action_created_channel");
            } else {
                return this.l("lng_action_created_chat", {
                    from: this.wrapPeer(message.from),
                    title: action.title
                })
            }
        }

        if (type === "messageActionGameScore") {
            let game = AppSelectedChat.current.messages.getGamesById(action.game_id)[0];
            let append = [];
            if (game[0]?.title) {
                return this.l("lng_action_game_score", action.score, {
                    from: this.wrapPeerWithSelf(message.from),
                    count: action.count,
                    game: game[0].title
                })
            } else {
                return this.lp("lng_action_game_score_no_game", action.score, {
                    from: this.wrapPeerWithSelf(message.from),
                    count: action.score
                })
            }
        }

        if (type === "messageActionScreenshotTaken") {
            return this.l("lng_action_took_screenshot", {
                from: this.wrapPeerWithSelf(message.from),
            })
        }

        if (type === "messageActionBotAllowed") {
            return this.l("lng_action_bot_allowed_from_domain", {
                domain: <a class="clickable" href={"http://" + action.domain} target="_blank">{action.domain}</a>
            })
        }

        if (type === "messageActionContactSignUp") {
            return this.l("lng_action_user_registered", {
                from: this.wrapPeer(message.from)
            })
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