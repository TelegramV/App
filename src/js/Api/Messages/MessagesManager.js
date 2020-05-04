import {Manager} from "../Manager"
import MTProto from "../../MTProto/External"
import PeersStore from "../Store/PeersStore"
import DialogsManager from "../Dialogs/DialogsManager"
import DialogsStore from "../Store/DialogsStore"
import {getPeerTypeFromType} from "../Dialogs/util"
import AppEvents from "../EventBus/AppEvents"
import API from "../Telegram/API"
import UpdatesManager from "../Updates/UpdatesManager"
import AppSelectedChat from "../../Ui/Reactive/SelectedChat"

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
            if (lastMessage._ === "messageEmpty") {
                return
            }

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

            const message = peer.messages.putNewRawMessage(lastMessage)
            message.init()

            if (message.from && message.from.type === "user") {
                peer.dialog.removeAction(message.from)
            }

            peer.dialog.fire("newMessage", {
                message
            })
        }

        MTProto.UpdatesManager.subscribe("updateMessageID", update => {
            update.dialog && update.dialog.handleUpdateMessageID(update.id, update.random_id)
        })

        MTProto.UpdatesManager.subscribe("updateShortSentMessage", async update => {
            updatePeerLastMessage(update.peer, update)
        })

        MTProto.UpdatesManager.subscribe("updateShortMessage", update => {
            const user = PeersStore.get("user", update.user_id)

            if (!user) {
                UpdatesManager.defaultUpdatesProcessor.getDifference({
                    pts: UpdatesManager.State.pts - 1
                }).then(diff => {
                    UpdatesManager.defaultUpdatesProcessor.processDifference(diff)
                })
                // API.messages.getUsers([InputUser]).then(users => {
                //     updatePeerLastMessage(users[0], update)
                // })
            } else {
                updatePeerLastMessage(user, update)
            }
        })

        MTProto.UpdatesManager.subscribe("updateShortChatMessage", update => {
            const chat = PeersStore.get("chat", update.chat_id)

            if (!chat) {
                API.messages.getChats([update.chat_id]).then(chats => {
                    console.log(chats)
                    updatePeerLastMessage(chats[0], update)
                })
            } else {
                updatePeerLastMessage(chat, update)
            }
        })

        MTProto.UpdatesManager.subscribe("updateNewMessage", update => {
            let peer = undefined

            if (update.message.out) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`])
            } else if (update.message.to_id && update.message.to_id.user_id !== MTProto.getAuthorizedUserId()) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`])
            } else {
                peer = PeersStore.get("user", update.message.from_id)
            }

            updatePeerLastMessage(peer, update.message)
        })

        MTProto.UpdatesManager.subscribe("updateNewScheduledMessage", update => {
            let peer = undefined

            if (update.message.out) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                peer = PeersStore.get(peerType, update.message.to_id[`${peerType}_id`])
            } else if (update.message.to_id && update.message.to_id.user_id !== MTProto.getAuthorizedUserId()) {
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
                    dialog.refresh()
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
                const message = to.dialog.peer.messages.getById(update.message.id)

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
            if (AppSelectedChat.isSelected) {
                const messages = AppSelectedChat.current.messages.getPollsById(update.poll_id)
                for (const message of messages) {
                    message.fillPoll(update.poll, update.results)

                    message.fire("pollEdit")
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateEditChannelMessage", update => {
            const to = this.getToPeerMessage(update.message)

            if (to) {
                const message = to.dialog.peer.messages.getById(update.message.id)

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
