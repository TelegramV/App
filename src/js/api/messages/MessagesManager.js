import {Manager} from "../manager"
import {MTProto} from "../../mtproto/external"
import PeersStore from "../store/PeersStore"
import DialogsManager from "../dialogs/DialogsManager"
import DialogsStore from "../store/DialogsStore"
import {getPeerTypeFromType} from "../dialogs/util"
import {MessageFactory} from "./MessageFactory"
import AppEvents from "../eventBus/AppEvents"
import AppSelectedPeer from "../../ui/reactive/SelectedPeer"

class MessageManager extends Manager {
    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        /**
         * @param {Peer} peer
         * @param {Object} lastMessage
         */
        const updatePeerLastMessage = (peer, lastMessage) => {
            if (!peer) {
                console.error("BUG: peer was not found", lastMessage)
                return
            }


            if (peer.isAbleToHandleUpdates && !peer.dialog) {
                console.log("no dialog", peer, peer.dialog)

                DialogsManager.getPeerDialogs(peer).then(dialogs => {
                    AppEvents.Dialogs.fire("gotNewMany", {
                        dialogs
                    })
                })

                return
            }

            if (peer.messages._sendingMessages.has(lastMessage.id)) {
                const randomId = peer.messages._sendingMessages.get(lastMessage.id)
                peer.messages._sendingMessages.delete(lastMessage.id)
                lastMessage.random_id = randomId
                AppEvents.Dialogs.fire("messageSent", {
                    rawMessage: lastMessage,
                    dialog: peer.dialog
                })

                return
            }

            const message = MessageFactory.fromRaw(peer, lastMessage)

            peer.messages.appendSingle(message)
            message.init()

            if (message.from && message.from.type === "user") {
                peer.dialog.removeActionByUserId(message.from.id)
            }

            peer.dialog.fire("newMessage", {
                message
            })

            AppEvents.Dialogs.fire("newMessage", {
                message,
                dialog: peer.dialog
            })
        }

        MTProto.UpdatesManager.subscribe("updateMessageID", update => {
            update.dialog && update.dialog.handleUpdateMessageID(update.id, update.random_id)
        })

        MTProto.UpdatesManager.subscribe("updateShortSentMessage", async update => {
            updatePeerLastMessage(update.dialog.peer, update)
        })

        MTProto.UpdatesManager.subscribe("updateShortMessage", update => {
            updatePeerLastMessage(PeersStore.get("user", update.user_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateShortChatMessage", update => {
            updatePeerLastMessage(PeersStore.get("chat", update.chat_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateNewMessage", update => {
            let peer = undefined

            if (update.message.pFlags.out) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`])
            } else if (update.message.to_id && update.message.to_id.user_id !== MTProto.getAuthorizedUser().user.id) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`])
            } else {
                peer = PeersStore.get("user", update.message.from_id)
            }

            updatePeerLastMessage(peer, update.message)
        })


        MTProto.UpdatesManager.subscribe("updateDeleteChannelMessages", update => {
            const dialog = DialogsStore.get("channel", update.channel_id)

            if (dialog) {
                dialog.peer.messages.startTransaction()

                update.messages.sort().forEach(mId => {
                    dialog.peer.messages.deleteSingle(mId)
                })

                if (!dialog.peer.messages.last) {
                    DialogsManager.getPeerDialogs(dialog.peer).then(dialogs => {
                        dialogs[0].fire("updateSingle", {
                            dialog: dialogs[0]
                        })
                    })
                }

                dialog.peer.messages.fireTransaction("deleteChannelMessages", {
                    messages: update.messages
                })

                dialog.peer.messages.fireTransaction("deleteMessages", {
                    messages: update.messages
                })
            }
        })

        MTProto.UpdatesManager.subscribe("updateDeleteMessages", update => {
            DialogsStore.toArray().forEach(dialog => {
                if (dialog.peer.type !== "channel") {
                    dialog.peer.messages.startTransaction()

                    update.messages.sort().forEach(mId => {
                        dialog.peer.messages.deleteSingle(mId)
                    })

                    if (!dialog.peer.messages.last) {
                        dialog.refresh()
                    }

                    dialog.peer.messages.fireTransaction("deleteMessages", {
                        messages: update.messages
                    })
                }
            })
        })

        MTProto.UpdatesManager.subscribe("updateEditMessage", update => {
            const to = this.getToPeerMessage(update.message)

            if (to) {
                const message = to.dialog.peer.messages.get(update.message.id)

                if (message) {
                    message.fillRaw(update.message)

                    message.fire("edit")

                    to.dialog.fire("editMessage", {
                        message: message,
                    })
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateMessagePoll", update => {
            if (AppSelectedPeer.isSelected) {
                const messages = AppSelectedPeer.Current.messages.getPollsById(update.poll_id)
                for (const message of messages) {
                    message.fillPoll(update.poll, update.results)

                    message.fire("pollEdit")
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateEditChannelMessage", update => {
            const to = this.getToPeerMessage(update.message)

            if (to) {
                const message = to.dialog.peer.messages.get(update.message.id)

                if (message) {
                    message.fillRaw(update.message)

                    message.fire("edit")

                    to.dialog.fire("editMessage", {
                        message: message,
                    })
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessage", async update => {
            const peer = PeersStore.get("channel", update.message.to_id.channel_id)

            updatePeerLastMessage(peer, update.message)
        })

        MTProto.UpdatesManager.subscribe("updateDraftMessage", update => {
            const dialog = DialogsManager.findByPeer(update.peer)

            if (dialog) {
                dialog.draft.fillRawAndFire(update.draft)
            }
        })

        this._inited = true
    }

    getFromPeerMessage(rawMessage) {
        if (rawMessage.pFlags && rawMessage.pFlags.out) {
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

        console.error("FUCK NO DESTINATION DEATH FOR NATION", rawMessage)
    }
}

const MessagesManager = new MessageManager()

export default MessagesManager
