import {MTProto} from "../../mtproto"
import {getInputPeerFromPeer, getInputPeerFromPeerWithoutAccessHash, getPeerNameFromType} from "./util"
import TimeManager from "../../mtproto/timeManager"
import PeersManager from "../peers/peersManager"
import {Dialog} from "../../dataObjects/dialog";
import {getPeerObject} from "../../dataObjects/peerFactory";
import {Manager} from "../manager";
import {UserPeer} from "../../dataObjects/userPeer";
import {SupergroupPeer} from "../../dataObjects/supergroupPeer";
import {GroupPeer} from "../../dataObjects/groupPeer";
import {ChannelPeer} from "../../dataObjects/channelPeer";
import {Peer} from "../../dataObjects/peer";
import {Message} from "../../dataObjects/message";
import {PeerAPI} from "../peerAPI"

class DialogManager extends Manager {
    constructor() {
        super()
        this.dialogs = new Map([
            ["chat", new Map()],
            ["channel", new Map()],
            ["user", new Map()],
        ])
        // this.dialogs = {
        //     chat: {},
        //     channel: {},
        //     user: {}
        // }
        this.latestDialog = undefined
        this.dialogsOffsetDate = 0 // TODO
        this.offsetDate = 0
    }


    init() {
        /**
         * @param {Dialog} dialog
         * @param {Object} lastMessage
         */
        const updateDialogLastMessage = (dialog, lastMessage) => {
            if (!dialog) return

            dialog.lastMessage = new Message(dialog, lastMessage)
        }

        MTProto.UpdatesManager.listenUpdate("updateShortMessage", async update => {
            updateDialogLastMessage(await this.findOrFetch("user", update.user_id), update)
        })

        MTProto.UpdatesManager.listenUpdate("updateShortChatMessage", async update => {
            updateDialogLastMessage(await this.findOrFetch("chat", update.chat_id), update)
        })

        MTProto.UpdatesManager.listenUpdate("updateNewMessage", async update => {
            let dialog = undefined

            if (update.message.to_id) {
                const peerName = getPeerNameFromType(update.message.to_id._)
                dialog = await this.findOrFetch(peerName, update.message.to_id[`${peerName}_id`])
            } else {
                dialog = await this.findOrFetch("user", update.message.from_id)
            }

            updateDialogLastMessage(dialog, update.message)
        })

        MTProto.UpdatesManager.listenUpdate("updateDeleteChannelMessages", update => {
            const dialog = this.find("channel", update.channel_id)

            if (dialog) {
                update.messages.forEach(mId => {
                    dialog._unreadMessageIds.delete(mId)
                })
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateDeleteMessages", async update => {
            console.log("deleted", update)
        })

        MTProto.UpdatesManager.listenUpdate("updateDialogPinned", async update => {
            const peerName = getPeerNameFromType(update.peer.peer._)
            const dialog = await this.findOrFetch(peerName, update.peer.peer[`${peerName}_id`])

            if (!dialog) return

            dialog.pinned = update.pFlags.pinned || false
        })

        MTProto.UpdatesManager.listenUpdate("updateNewChannelMessage", async update => {
            const dialog = await this.findOrFetch("channel", update.message.to_id.channel_id)
            // if(!dialog || !PeersManager.find("user", update.message.from_id)) {
            //     MTProto.invokeMethod("updates.getDifference", {
            //         flags: 0,
            //         pts: 683207,
            //         qts: "",
            //         date: update.message.date
            //     }).then(l => {
            //         l.users.forEach(q => {
            //             PeersManager.set(getPeerObject(q))
            //         })
            //         l.chats.forEach(q => {
            //             PeersManager.set(getPeerObject(q))
            //         })
            //         console.log("resp diff", l)
            //     }).catch(l => {
            //         console.log(l)
            //     })
            //     return
            // }

            updateDialogLastMessage(dialog, update.message)
        })

        MTProto.UpdatesManager.listenUpdate("updateDraftMessage", update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog._dialog.draft = update.draft

                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        // MTProto.MessageProcessor.listenUpdateDialogUnreadMark(update => {
        //     const dialog = this.findByPeer(update.peer.peer)
        //     if(dialog) {
        //         dialog._dialog.pFlags.unread_mark = update.pFlags.unread
        //         this.resolveListeners({
        //             type: "updateSingle",
        //             dialog: dialog
        //         })
        //     }
        // })

        MTProto.UpdatesManager.listenUpdate("updateReadHistoryInbox", update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog._dialog.read_inbox_max_id = update.max_id
                dialog._dialog.unread_count = update.still_unread_count
                if (dialog._dialog.unread_count === 0) {
                    dialog.clearUnreadCount()
                }
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateReadHistoryOutbox", update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateReadChannelInbox", update => {
            // console.log("inbox", update)
            const dialog = this.find("channel", update.channel_id)
            if (dialog) {
                dialog._dialog.read_inbox_max_id = update.max_id
                dialog._dialog.unread_count = update.still_unread_count
                if (dialog._dialog.unread_count === 0) {
                    dialog.clearUnreadCount()
                }
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateReadChannelOutbox", update => {
            const dialog = this.find("channel", update.channel_id)
            if (dialog) {
                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateShort", async update => {
            if (update._ === "updateUserStatus") {
                const dialog = this.find("user", update.user_id)

                if (dialog && dialog.peer instanceof UserPeer) {
                    dialog.peer.peer.status = update.status
                    this.resolveListeners({
                        type: "updateSingle",
                        dialog: dialog
                    })
                }
            } else if (update._ === "updateChatUserTyping") {
                const dialog = this.find("chat", update.chat_id) || this.find("channel", update.chat_id)

                if (!dialog) {
                    return; // prob should download the chat
                }

                let peer = PeersManager.find("user", update.user_id)
                if (!peer) {
                    await this.updateChatFull(dialog)

                    peer = PeersManager.find("user", update.user_id)
                    if (!peer) {
                        return
                    }
                }
                if (dialog && peer) {
                    dialog.addMessageAction(peer, update.action)
                    this.resolveListeners({
                        type: "updateSingle",
                        dialog: dialog
                    })
                }

            } else if (update._ === "updateUserTyping") {
                // console.log(update)
                const dialog = this.find("user", update.user_id)

                if (!dialog) {
                    return; // prob should download the chat
                }

                if (dialog) {
                    dialog.addMessageAction(dialog.peer, update.action)
                    this.resolveListeners({
                        type: "updateSingle",
                        dialog: dialog
                    })
                }
            } else if (update._ === "updateReadChannelOutbox") {
                const dialog = this.find("channel", update.channel_id)

                if (!dialog) {
                    return // prob should be fixed
                }

                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            } else if (update._ === "updateReadHistoryOutbox") {
                console.log("updateReadHistoryOutbox", update)
            } else {
                console.log("Short", update)
            }
        })
    }

    fetchNextPage({limit = 20}) {
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
     * @return {Dialog}
     */
    find(type, id) {
        return this.dialogs.get(type).get(id)
    }

    /**
     * @param type
     * @param id
     * @return {Promise<Dialog|null>}
     */
    async findOrFetch(type, id) {
        let dialog = this.find(type, id)

        if (!dialog) {
            await this.fetchPlainPeerDialogs({_: type, id})
        }

        return this.find(type, id)
    }

    findByUsername(username) {
        return null // todo: fix
        for (const [k, data] of Object.entries(this.dialogs)) {
            for (const [id, dialog] of Object.entries(data)) {
                if (dialog.peer.username === username) {
                    return dialog
                }
            }
        }
        return null
    }

    /**
     * @param peer
     * @return {Dialog}
     */
    findByPeer(peer) {
        if (peer instanceof Peer) return this.find(peer.type, peer.id)

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
        return this.find(key, peer[keyId])
    }

    fetchPlainPeerDialogs(peer) {
        const peerData = {
            _: "inputDialogPeer",
            peer: getInputPeerFromPeerWithoutAccessHash(peer._, peer.id)
        }

        return MTProto.invokeMethod("messages.getPeerDialogs", {
            peers: [peerData]
        }).then(_dialogsSlice => {
            _dialogsSlice.users.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })
            _dialogsSlice.chats.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })

            const dialogs = _dialogsSlice.dialogs.map(_dialog => {
                return this.resolveDialogWithSlice(_dialog, _dialogsSlice)
            })

            if (dialogs.length) {
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialogs[0],
                })
            }

            dialogs.forEach(async dialog => {
                await dialog.peer.getAvatar()
            })
        })
    }

    /**
     * @param {Object} _dialog
     * @param {Object} _slice
     * @param config
     * @return {Dialog|undefined}
     */
    resolveDialogWithSlice(_dialog, _slice, config = {}) {
        const plainPeer = PeerAPI.getPlain(_dialog.peer, false)

        const _peer = (plainPeer._ === "user" ? _slice.users : _slice.chats).find(l => l.id === plainPeer.id)
        const _lastMessage = _slice.messages.find(l => l.id === _dialog.top_message)

        const peer = getPeerObject(_peer)
        PeersManager.set(peer)

        const dialog = new Dialog(_dialog, peer, _lastMessage)

        this.set(dialog, config.dispatchEvent || false)

        return dialog
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
                PeersManager.set(getPeerObject(l))
            })
            _dialogsSlice.chats.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })

            const dialogs = _dialogsSlice.dialogs.map(_dialog => {
                const dialog = this.resolveDialogWithSlice(_dialog, _dialogsSlice)

                // todo: rewrite this
                this.offsetDate = dialog.lastMessage.date
                if (this.offsetDate && !dialog.pinned && (!this.dialogsOffsetDate || this.offsetDate < this.dialogsOffsetDate)) {
                    this.dialogsOffsetDate = this.offsetDate
                }

                return dialog
            })

            this.latestDialog = dialogs[dialogs.length - 1]

            this.resolveListeners({
                type: "updateMany",
                dialogs: dialogs.filter(l => !l.pinned),
                pinnedDialogs: dialogs.filter(l => l.pinned)
            })

            dialogs.forEach(async dialog => {
                await dialog.peer.getAvatar()
            })
        })

    }

    updateChatFull(dialog) {
        if (dialog.type === "channel") return this.updateChannelFull(dialog)

        return MTProto.invokeMethod("messages.getFullChat", {
            chat_id: dialog.id
        }).then(l => {
            l.users.forEach(q => {
                PeersManager.set(getPeerObject(q))
            })
            if (dialog instanceof GroupPeer) {
                console.log("GroupPeer", l)
            }
        })
    }

    updateChannelFull(dialog) {
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: getInputPeerFromPeer("channel", dialog.id, dialog.peer.peer.access_hash)
        }).then(l => {
            l.users.forEach(q => {
                PeersManager.set(getPeerObject(q))
            })
            if (dialog instanceof ChannelPeer) {
                console.log("ChannelPeer", l)
            } else if (dialog instanceof SupergroupPeer) {
                console.log("SupergroupPeer", l)
            }
        })
    }

    set(dialog, dispatchEvent = true) {
        if (dialog instanceof Dialog) {
            this.dialogs.get(dialog.type).set(dialog.id, dialog)

            if (dispatchEvent) {
                console.log("setting")
                this.resolveListeners({
                    type: "updateSingle", // todo: create specific event
                    dialog
                })
            }
        } else {
            console.error("invalid dialog passed")
        }
    }
}

export default new DialogManager()
