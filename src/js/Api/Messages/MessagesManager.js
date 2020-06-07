import {Manager} from "../Manager"
import PeersStore from "../Store/PeersStore"
import DialogsManager from "../Dialogs/DialogsManager"
import AppEvents from "../EventBus/AppEvents"
import {Peer} from "../Peers/Objects/Peer"

class MessageManager extends Manager {
    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        this._inited = true
    }

    processNewMessage(peer: Peer, rawMessage) {
        if (rawMessage._ === "messageEmpty") {
            console.log(rawMessage)
            return
        }

        if (!peer) {
            console.error("BUG: processNewMessage peer was not found", rawMessage)
            return
        }


        if (peer.isAbleToHandleUpdates) {
            if (!peer.dialog) {
                console.log("BUG: processNewMessage no dialog", peer, peer.dialog)

                DialogsManager.getPeerDialogs(peer).then(dialogs => {
                    AppEvents.Dialogs.fire("gotNewMany", {
                        dialogs
                    })
                })

                return
            }
        }

        if (peer.messages._sendingMessages.has(rawMessage.id)) {
            const randomId = peer.messages._sendingMessages.get(rawMessage.id)
            peer.messages._sendingMessages.delete(rawMessage.id)
            rawMessage.random_id = randomId
            AppEvents.Dialogs.fire("messageSent", {
                rawMessage: rawMessage,
                dialog: peer.dialog
            })

            return
        }

        const message = peer.messages.putNewRawMessage(rawMessage)

        if (message) {
            message.init()

            if (message.from && message.from.type === "user") {
                peer.dialog.removeAction(message.from)
            }


        peer.fire("messages.new", {
                message,
            })
        }
    }

    getFromPeerMessage(rawMessage) {
        if (rawMessage.out) {
            return PeersStore.self()
        }

        if (rawMessage.from_id) {
            return PeersStore.get("user", rawMessage.from_id)
        }

        if (rawMessage.user_id) {
            return PeersStore.get("user", rawMessage.user_id)
        }

        if (rawMessage.channel_id) {
            return PeersStore.get("channel", rawMessage.channel_id)
        }

        if (rawMessage.chat_id) {
            return PeersStore.get("chat", rawMessage.chat_id)
        }

        // console.debug("no from peer, probably message sent to channel", rawMessage)

        return this.getToPeerMessage(rawMessage)
    }

    getToPeerMessage(rawMessage) {
        if (rawMessage.to_id && rawMessage.to_id._ === "peerChannel") {
            return PeersStore.get("channel", rawMessage.to_id.channel_id)
        }

        if (rawMessage.to_id && rawMessage.to_id._ === "peerChat") {
            return PeersStore.get("chat", rawMessage.to_id.chat_id)
        }

        if (rawMessage.to_id && rawMessage.to_id._ === "peerUser") {
            return PeersStore.get("user", rawMessage.to_id.user_id)
        }

        if (rawMessage.chat_id) {
            return PeersStore.get("chat", rawMessage.chat_id)
        }

        if (rawMessage.user_id) {
            return PeersStore.get("user", rawMessage.user_id)
        }

        // probably redundant, but who knows telegram
        if (rawMessage.channel_id) {
            return PeersStore.get("channel", rawMessage.channel_id)
        }

        console.error("oh shit", rawMessage)
    }
}

const MessagesManager = new MessageManager()

export default MessagesManager
