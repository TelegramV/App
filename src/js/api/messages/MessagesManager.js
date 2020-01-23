import {Manager} from "../manager"
import {MTProto} from "../../mtproto"
import PeersStore from "../store/peersStore"
import AppEvents from "../eventBus/appEvents"

class MessageManager extends Manager {
    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        MTProto.UpdatesManager.subscribe("updateEditMessage", update => {
            const from = this.getFromPeerMessage(update.message)

            if (from) {
                const message = from.dialog.messages.data.get(update.message.id)

                if (message) {
                    message.fillRaw(update.message)

                    AppEvents.Dialogs.fire("editMessage", {
                        message: message,
                        dialog: from.dialog,
                    })
                }
            }
        })

        this._inited = true
    }

    getFromPeerMessage(rawMessage) {
        if (rawMessage.pFlags && rawMessage.pFlags.out) {
            return PeersStore.self()
        } else if (rawMessage.from_id) {
            return PeersStore.get("user", rawMessage.from_id)
        } else if (rawMessage.user_id) {
            return PeersStore.get("user", rawMessage.user_id)
        } else if (rawMessage.channel_id) {
            return PeersStore.get("channel", rawMessage.channel_id)
        } else if (rawMessage.chat_id) {
            return PeersStore.get("chat", rawMessage.chat_id)
        } else {
            return this.getToPeerMessage(rawMessage)
        }
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
    }
}

const MessagesManager = new MessageManager()

export default MessagesManager
