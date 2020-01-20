import {MTProto} from "../../mtproto"
import {getInputPeerFromPeer, getInputPeerFromPeerWithoutAccessHash, getPeerTypeFromType} from "./util"
import TimeManager from "../../mtproto/timeManager"
import PeersManager from "../peers/peersManager"
import {Dialog} from "../dataObjects/dialog/dialog";
import {Manager} from "../manager";
import {UserPeer} from "../dataObjects/peer/userPeer";
import {Peer} from "../dataObjects/peer/peer";
import {Message} from "../dataObjects/message";
import {PeerAPI} from "../peerAPI"
import DialogsStore from "../store/dialogsStore"
import AppEvents from "../eventBus/appEvents"
import AppSelectedDialog from "./selectedDialog"

class DialogManager extends Manager {
    constructor() {
        super()

        this.latestDialog = undefined
        this.dialogsOffsetDate = 0 // TODO
        this.offsetDate = 0
    }


    init() {
        if (this._inited) {
            return
        }

        AppSelectedDialog.subscribe(_ => {
            if (AppSelectedDialog.PreviousDialog) {
                AppSelectedDialog.PreviousDialog.messages.clear()
            }
        })

        /**
         * @param {Dialog} dialog
         * @param {Object} lastMessage
         */
        const updateDialogLastMessage = (dialog, lastMessage) => {
            if (!dialog) return

            const message = new Message(dialog, lastMessage)

            dialog.messages.appendSingle(message)

            if (!message.isOut) {
                dialog.messages.addUnread(message.id)
            }

            if (message.from instanceof UserPeer) {
                dialog.removeMessageAction(message.from)
            }

            AppEvents.Dialogs.fire("newMessage", {
                message,
                dialog // todo: remove
            })
        }

        MTProto.UpdatesManager.subscribe("updateShortMessage", async update => {
            console.log(update)
            updateDialogLastMessage(await this.findOrFetch("user", update.user_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateShortChatMessage", async update => {
            console.log(update)
            updateDialogLastMessage(await this.findOrFetch("chat", update.chat_id), update)
        })

        MTProto.UpdatesManager.subscribe("updateNewMessage", async update => {
            console.log(update)

            let dialog = undefined

            if (update.message.pFlags.out || update.message.to_id) {
                const peerType = getPeerTypeFromType(update.message.to_id._)
                dialog = await this.findOrFetch(peerType, update.message.to_id[`${peerType}_id`])
            } else {
                dialog = await this.findOrFetch("user", update.message.from_id)
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
                    this.fetchPlainPeerDialogs({
                        _: dialog.peer.type,
                        id: dialog.peer.id,
                        access_hash: dialog.peer.accessHash
                    })
                } else {
                    dialog.messages.fireTransaction()
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateDeleteMessages", update => {
            DialogsStore.data.forEach((data, type) => data.forEach(/** @param {Dialog} dialog */(dialog, id) => {
                if (dialog.type !== "channel") {
                    dialog.messages.startTransaction()

                    update.messages.sort().forEach(mId => {
                        dialog.messages.deleteSingle(mId)
                    })

                    if (!dialog.messages.last) {
                        this.fetchPlainPeerDialogs({
                            _: dialog.peer.type,
                            id: dialog.peer.id
                        })
                    }
                    dialog.messages.fireTransaction()
                }
            }))
        })

        MTProto.UpdatesManager.subscribe("updateDialogPinned", async update => {
            const peerType = getPeerTypeFromType(update.peer.peer._)
            const dialog = await this.findOrFetch(peerType, update.peer.peer[`${peerType}_id`])

            if (!dialog) return

            dialog.pinned = update.pFlags.pinned || false
        })


        MTProto.UpdatesManager.subscribe("updateChannel", async update => {
            await this.findOrFetch("channel", update.channel_id)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessage", async update => {
            const dialog = await this.findOrFetch("channel", update.message.to_id.channel_id)

            updateDialogLastMessage(dialog, update.message)
        })

        MTProto.UpdatesManager.subscribe("updateDraftMessage", update => {
            const dialog = this.findByPeer(update.peer)

            if (dialog) {
                dialog.draft.fillRawAndFire(update.draft)
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadHistoryInbox", update => {
            const dialog = this.findByPeer(update.peer)

            if (dialog) {
                dialog.messages.readInboxMaxId = update.max_id

                if (update.still_unread_count === 0) {
                    dialog.messages.clearUnread()
                } else {
                    dialog.messages.unreadCount = update.still_unread_count
                    dialog.messages.clearUnreadIds()
                }
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadHistoryOutbox", update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog.messages.readOutboxMaxId = update.max_id
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadChannelInbox", update => {
            const dialog = this.find("channel", update.channel_id)

            if (dialog) {
                dialog.messages.startTransaction()
                dialog.messages.readInboxMaxId = update.max_id
                if (update.still_unread_count === 0) {
                    dialog.messages.clearUnread()
                } else {
                    dialog.messages.unreadCount = update.still_unread_count
                    dialog.messages.clearUnreadIds()
                }
                dialog.messages.stopTransaction()

                AppEvents.Dialogs.fire("updateReadChannelInbox", {
                    dialog
                })
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadChannelOutbox", update => {
            const dialog = this.find("channel", update.channel_id)
            if (dialog) {
                dialog.messages.readOutboxMaxId = update.max_id

                AppEvents.Dialogs.fire("updateReadChannelOutbox", {
                    dialog: dialog
                })
            }
        })

        this._inited = true

        // MTProto.UpdatesManager.listenUpdate("updateShort", async update => {
        //     if (update._ === "updateUserStatus") {
        //         const dialog = this.find("user", update.user_id)
        //
        //         if (dialog && dialog.peer instanceof UserPeer) {
        //             dialog.peer.peer.status = update.status
        //             this.resolveListeners({
        //                 type: "updateUserStatus",
        //                 dialog: dialog
        //             })
        //         }
        //     } else if (update._ === "updateChatUserTyping") {
        //         const dialog = this.find("chat", update.chat_id) || this.find("channel", update.chat_id)
        //
        //         if (!dialog) {
        //             return; // prob should download the chat
        //         }
        //
        //         let peer = PeersManager.find("user", update.user_id)
        //         if (!peer) {
        //             await this.updateChatFull(dialog)
        //
        //             peer = PeersManager.find("user", update.user_id)
        //             if (!peer) {
        //                 return
        //             }
        //         }
        //         if (dialog && peer) {
        //             dialog.addMessageAction(peer, update.action)
        //             this.resolveListeners({
        //                 type: "updateSingle",
        //                 dialog: dialog
        //             })
        //         }
        //
        //     } else if (update._ === "updateUserTyping") {
        //         // console.log(update)
        //         const dialog = this.find("user", update.user_id)
        //
        //         if (!dialog) {
        //             return; // prob should download the chat
        //         }
        //
        //         if (dialog) {
        //             dialog.addMessageAction(dialog.peer, update.action)
        //             this.resolveListeners({
        //                 type: "updateSingle",
        //                 dialog: dialog
        //             })
        //         }
        //     } else if (update._ === "updateReadChannelOutbox") {
        //         const dialog = this.find("channel", update.channel_id)
        //
        //         if (!dialog) {
        //             return // prob should be fixed
        //         }
        //
        //         dialog._dialog.read_outbox_max_id = update.max_id
        //         this.resolveListeners({
        //             type: "updateSingle",
        //             dialog: dialog
        //         })
        //     } else if (update._ === "updateReadHistoryOutbox") {
        //         console.log("updateReadHistoryOutbox", update)
        //     } else {
        //         console.log("Short", update)
        //     }
        // })
    }

    fetchNextPage({limit = 40}) {
        const latestDialog = this.latestDialog
        const peer = latestDialog.peer

        const offsetPeer = peer.inputPeer

        const data = {
            limit: limit,
            offset_peer: offsetPeer
        }

        return this.fetchDialogs(data)
    }

    /**
     * @param type
     * @param id
     * @return {Dialog|undefined}
     */
    find(type, id) {
        return DialogsStore.get(type, id)
    }

    /**
     * @param type
     * @param id
     * @return {Promise<Dialog|null>}
     */
    async findOrFetch(type, id) {
        let dialog = DialogsStore.get(type, id)

        if (!dialog) {
            dialog = await this.fetchPlainPeerDialogs({_: type, id})
        }

        return dialog
    }

    /**
     * @param peer
     * @return {Dialog}
     */
    findByPeer(peer) {
        if (peer instanceof Peer) return DialogsStore.get(peer.type, peer.id)

        const keys = {
            peerUser: "user",
            peerChannel: "channel",
            peerChat: "chat"
        }

        const key = keys[peer._]
        const keysId = {
            peerUser: "user_id",
            peerChannel: "channel_id",
            peerChat: "chat_id"
        }
        const keyId = keysId[peer._]
        return DialogsStore.get(key, peer[keyId])
    }

    fetchFromMessage(rawMessage) {
        const peerData = {
            _: "inputDialogPeer",
            peer: {
                _: "inputPeerUserFromMessage",
                peer: {}
            }
        }

        return MTProto.invokeMethod("messages.getPeerDialogs", {
            peers: [peerData]
        }).then(_dialogsSlice => {
            _dialogsSlice.users.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })
            _dialogsSlice.chats.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })

            const dialogs = _dialogsSlice.dialogs.map(_dialog => {
                return this.resolveDialogWithSlice(_dialog, _dialogsSlice)
            })

            AppEvents.Dialogs.fire("updateSingle", {
                dialog: dialogs[0],
            })
        })
    }

    fetchPlainPeerDialogs(peer) {
        const peerData = {
            _: "inputDialogPeer",
            peer: !peer.access_hash ? getInputPeerFromPeerWithoutAccessHash(peer._, peer.id) : getInputPeerFromPeer(peer._, peer.id, peer.access_hash)
        }

        return MTProto.invokeMethod("messages.getPeerDialogs", {
            peers: [peerData]
        }).then(_dialogsSlice => {
            _dialogsSlice.users.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })
            _dialogsSlice.chats.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })

            const dialogs = _dialogsSlice.dialogs.map(_dialog => {
                return this.resolveDialogWithSlice(_dialog, _dialogsSlice)
            })

            AppEvents.Dialogs.fire("updateSingle", {
                dialog: dialogs[0],
            })
        })
    }

    /**
     * @param {Object} rawDialog
     * @param {Object} _slice
     * @param config
     * @return {Dialog|undefined}
     */
    resolveDialogWithSlice(rawDialog, _slice, config = {}) {
        const plainPeer = PeerAPI.getPlain(rawDialog.peer, false)

        const rawPeer = (plainPeer._ === "user" ? _slice.users : _slice.chats).find(l => l.id === plainPeer.id)
        const rawTopMessage = _slice.messages.find(l => l.id === rawDialog.top_message)

        const peer = PeersManager.setFromRawAndFire(rawPeer)

        return this.setFromRaw(rawDialog, peer, new Message(undefined, rawTopMessage))
    }

    fetchDialogs({
                     limit = 20,
                     flags = 0,
                     exclude_pinned = false,
                     folder_id = -1,
                     offset_date = this.offsetDate,
                     offset_id = -1,
                     offset_peer = {
                         _: "inputPeerEmpty"
                     },
                     hash = ""
                 }) {

        if (this.dialogsOffsetDate) {
            this.offsetDate = this.dialogsOffsetDate + TimeManager.timeOffset
            flags |= 1
        }

        return MTProto.invokeMethod("messages.getDialogs", {
            flags: flags,
            pFlags: {
                exclude_pinned: exclude_pinned
            },
            folder_id: folder_id,
            offset_date: offset_date,
            offset_id: offset_id,
            offset_peer: offset_peer,
            limit: limit,
            hash: hash
        }).then(_dialogsSlice => {

            if (parseInt(_dialogsSlice.count) === 0) {
                return
            }

            _dialogsSlice.users.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })
            _dialogsSlice.chats.forEach(l => {
                PeersManager.setFromRawAndFire(l)
            })

            const dialogs = _dialogsSlice.dialogs.map(_dialog => {
                const dialog = this.resolveDialogWithSlice(_dialog, _dialogsSlice)

                // todo: rewrite this
                this.offsetDate = dialog.messages.last.date
                if (this.offsetDate && !dialog.isPinned && (!this.dialogsOffsetDate || this.offsetDate < this.dialogsOffsetDate)) {
                    this.dialogsOffsetDate = this.offsetDate
                }

                return dialog
            })

            this.latestDialog = dialogs[dialogs.length - 1]

            AppEvents.Dialogs.fire("updateMany", {
                dialogs: dialogs.filter(l => !l.isPinned),
                pinnedDialogs: dialogs.filter(l => l.isPinned)
            })
        })

    }

    setFromRaw(rawDialog, peer, topMessage) {
        const plainPeer = PeerAPI.getPlain(rawDialog.peer, false)

        if (DialogsStore.has(plainPeer._, plainPeer.id)) {
            const dialog = DialogsStore.get(plainPeer._, plainPeer.id)
            dialog.fillRaw(rawDialog)
            return dialog
        } else {
            const dialog = new Dialog(rawDialog, {peer, topMessage})
            DialogsStore.set(dialog)
            return dialog
        }
    }

    setFromRawAndFire(rawDialog, peer, topMessage) {
        const plainPeer = PeerAPI.getPlain(rawDialog.peer, false)

        if (DialogsStore.has(plainPeer._, plainPeer.id)) {
            const dialog = DialogsStore.get(plainPeer._, plainPeer.id)
            dialog.fillRawAndFire(rawDialog)
            return dialog
        } else {
            const dialog = new Dialog(rawDialog, {peer, topMessage})
            DialogsStore.set(dialog)

            AppEvents.Dialogs.fire("updateSingle", {
                dialog: dialog
            })

            return dialog
        }
    }
}

const DialogsManager = new DialogManager()

export default DialogsManager