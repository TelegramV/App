import {Manager} from "../Manager";
import PeersStore from "../Store/PeersStore";
import DialogsManager from "../Dialogs/DialogsManager";
import AppEvents from "../EventBus/AppEvents";
import {Peer} from "../Peers/Objects/Peer";

class MessageManager extends Manager {
    init() {
        if (this._inited) {
            return Promise.resolve();
        }

        this._inited = true;
    }

    processNewMessage(peer: Peer, rawMessage) {
        if (rawMessage._ === "messageEmpty") {
            console.log(rawMessage);
            return;
        }

        if (!peer) {
            console.error("BUG: processNewMessage peer was not found", rawMessage);
            return;
        }


        if (peer.isAbleToHandleUpdates) {
            if (!peer.dialog) {
                console.log("BUG: processNewMessage no dialog", peer, peer.dialog);

                DialogsManager.getPeerDialogs(peer).then(dialogs => {
                    AppEvents.Dialogs.fire("gotNewMany", {
                        dialogs
                    });
                });

                return;
            }
        }

        const sendingMessage = peer.messages.getById(rawMessage.id);

        if (sendingMessage) {
            sendingMessage.fillRaw(rawMessage);
        } else {
            const message = peer.messages.putNewRawMessage(rawMessage);

            if (message) {
                message.init();

                if (message.from && message.from.type === "user") {
                    peer.dialog.removeAction(message.from);
                }

                peer.fire("messages.new", {
                    message,
                });
            }
        }
    }

    getFromPeerMessage(rawMessage) {
        if (rawMessage.out) {
            return PeersStore.self();
        }

        if (rawMessage.from_id) {
            rawMessage = rawMessage.from_id // Костиль, тре переписати тут все
        }

        if (rawMessage.user_id) {
            return PeersStore.get("user", rawMessage.user_id);
        }

        if (rawMessage.channel_id) {
            return PeersStore.get("channel", rawMessage.channel_id);
        }

        if (rawMessage.chat_id) {
            return PeersStore.get("chat", rawMessage.chat_id);
        }

        // console.debug("no from peer, probably message sent to channel", rawMessage)

        return this.getToPeerMessage(rawMessage, true);
    }

    getToPeerMessage(rawMessage, isFrom) {
        let to;

        if (rawMessage.peer_id && rawMessage.peer_id._ === "peerChannel") {
            to = PeersStore.get("channel", rawMessage.peer_id.channel_id);
        } else if (rawMessage.peer_id && rawMessage.peer_id._ === "peerChat") {
            to = PeersStore.get("chat", rawMessage.peer_id.chat_id);
        } else if (rawMessage.peer_id && rawMessage.peer_id._ === "peerUser") {
            to = PeersStore.get("user", rawMessage.peer_id.user_id);
        } else if (rawMessage.chat_id) {
            to = PeersStore.get("chat", rawMessage.chat_id);
        } else if (rawMessage.user_id) {
            to = PeersStore.get("user", rawMessage.user_id);
        } else if (rawMessage.channel_id) {        // probably redundant, but who knows telegram
            to = PeersStore.get("channel", rawMessage.channel_id);
        }

        if (!isFrom && to === PeersStore.self()) {
            return this.getFromPeerMessage(rawMessage);
        } else {
            if (!to) {
                console.error("oh shit", rawMessage);
            }

            return to;
        }
    }
}

const MessagesManager = new MessageManager();

export default MessagesManager;
