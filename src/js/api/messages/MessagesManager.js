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
         * @param {Dialog} dialog
         * @param {Object} lastMessage
         */
        const updateDialogLastMessage = (dialog, lastMessage) => {
            if (!dialog) {
                console.error("BUG: dialog was not found", lastMessage)
                return
            }


            if(dialog.peer.messages._sendingMessages.has(lastMessage.id)) {
                const randomId = dialog.peer.messages._sendingMessages.get(lastMessage.id)
                dialog.peer.messages._sendingMessages.delete(lastMessage.id)
                lastMessage.random_id = randomId
                AppEvents.Dialogs.fire("messageSent", {
                    rawMessage: lastMessage,
                    dialog
                })

                return
            }
            const message = MessageFactory.fromRaw(dialog, lastMessage)

            if(dialog.peer.messages.appendSingle(message)) {
                message.init()

                if (!message.isOut) {
                    dialog.peer.messages.addUnread(message.id)
                } else {
                    dialog.peer.messages.clearUnread()
                }

                dialog.fire("newMessage", {
                    message
                })

                AppEvents.Dialogs.fire("newMessage", {
                    message,
                    dialog
                })
            }
        }

        MTProto.UpdatesManager.subscribe("updateMessageID", update => {
            update.dialog.handleUpdateMessageID(update.id, update.random_id)
        })

        MTProto.UpdatesManager.subscribe("updateShortSentMessage", async update => {
            updateDialogLastMessage(update.dialog, update)
        })

        MTProto.UpdatesManager.subscribe("updateShortMessage", async update => {
            updateDialogLastMessage(await DialogsManager.findOrFetch("user", update.user_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateShortChatMessage", async update => {
            updateDialogLastMessage(await DialogsManager.findOrFetch("chat", update.chat_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateNewMessage", async update => {
            let dialog = undefined

            if (update.message.pFlags.out) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                dialog = await DialogsManager.findOrFetch(peerType, update.message.to_id[`${peerType}_id`])
            } else if (update.message.to_id && update.message.to_id.user_id !== MTProto.getAuthorizedUser().user.id) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                dialog = await DialogsManager.findOrFetch(peerType, update.message.to_id[`${peerType}_id`])
            } else {
                dialog = await DialogsManager.findOrFetch("user", update.message.from_id)
            }

            updateDialogLastMessage(dialog, update.message)
        })


        MTProto.UpdatesManager.subscribe("updateDeleteChannelMessages", update => {
            const dialog = DialogsStore.get("channel", update.channel_id)

            if (dialog) {
                dialog.peer.messages.startTransaction()

                update.messages.sort().forEach(mId => {
                    dialog.peer.messages.deleteSingle(mId)
                })

                if (!dialog.peer.messages.last) {
                    DialogsManager.getPeerDialogs(dialog.peer).then(dialog => {
                        dialog.fire("updateSingle", {
                            dialog: dialog
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
            DialogsStore.data.forEach((data, type) => data.forEach(/** @param {Dialog} dialog */(dialog, id) => {
                if (dialog.peer.type !== "channel") {
                    dialog.peer.messages.startTransaction()

                    update.messages.sort().forEach(mId => {
                        dialog.peer.messages.deleteSingle(mId)
                    })

                    if (!dialog.peer.messages.last) {
                        DialogsManager.getPeerDialogs(dialog.peer).then(dialog => {
                            dialog.fire("updateSingle", {
                                dialog,
                            })
                        })
                    }

                    dialog.peer.messages.fireTransaction("deleteMessages", {
                        messages: update.messages
                    })
                }
            }))
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
                const messages = AppSelectedPeer.Current.dialog.peer.messages.getPollsById(update.poll_id)
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
            const dialog = await DialogsManager.findOrFetch("channel", update.message.to_id.channel_id)

            updateDialogLastMessage(dialog, update.message)
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
