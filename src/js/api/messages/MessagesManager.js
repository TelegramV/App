import {Manager} from "../manager"
import {MTProto} from "../../mtproto"
import PeersStore from "../store/PeersStore"
import AppEvents from "../eventBus/AppEvents"
import {Message} from "../dataObjects/messages/Message"
import DialogsManager from "../dialogs/DialogsManager"
import DialogsStore from "../store/DialogsStore"
import {getPeerTypeFromType} from "../dialogs/util"

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

            const message = new Message(dialog, lastMessage)

            dialog.messages.appendSingle(message)

            if (!message.isOut) {
                dialog.messages.addUnread(message.id)
            }

            AppEvents.Dialogs.fire("newMessage", {
                message,
                dialog // todo: remove
            })
        }

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
                dialog.messages.startTransaction()

                update.messages.sort().forEach(mId => {
                    dialog.messages.deleteSingle(mId)
                })

                if (!dialog.messages.last) {
                    DialogsManager.getPeerDialogs({
                        _: dialog.peer.type,
                        id: dialog.peer.id,
                        access_hash: dialog.peer.accessHash
                    }).then(dialog => {
                        AppEvents.Dialogs.fire("updateSingle", {
                            dialog: dialog
                        })
                    })
                }

                dialog.messages.fireTransaction("deleteChannelMessages", {
                    messages: update.messages
                })
            }
        })

        MTProto.UpdatesManager.subscribe("updateDeleteMessages", update => {
            DialogsStore.data.forEach((data, type) => data.forEach(/** @param {Dialog} dialog */(dialog, id) => {
                if (dialog.peer.type !== "channel") {
                    dialog.messages.startTransaction()

                    update.messages.sort().forEach(mId => {
                        dialog.messages.deleteSingle(mId)
                    })

                    if (!dialog.messages.last) {
                        DialogsManager.getPeerDialogs({
                            _: dialog.peer.type,
                            id: dialog.peer.id
                        }).then(dialog => {
                            AppEvents.Dialogs.fire("updateSingle", {
                                dialog,
                            })
                        })
                    }

                    dialog.messages.fireTransaction("deleteMessages", {
                        messages: update.messages
                    })
                }
            }))
        })

        MTProto.UpdatesManager.subscribe("updateEditMessage", update => {
            const to = this.getToPeerMessage(update.message)

            if (to) {
                const message = to.dialog.messages.data.get(update.message.id)

                if (message) {
                    message.fillRaw(update.message)

                    AppEvents.Dialogs.fire("editMessage", {
                        message: message,
                        dialog: to.dialog,
                    })
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateEditChannelMessage", update => {
            const to = this.getToPeerMessage(update.message)

            if (to) {
                const message = to.dialog.messages.data.get(update.message.id)

                if (message) {
                    message.fillRaw(update.message)

                    AppEvents.Dialogs.fire("editMessage", {
                        message: message,
                        dialog: to.dialog,
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
