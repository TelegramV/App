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

class DialogManager extends Manager {
    constructor() {
        super()
        this.dialogs = {
            chat: {},
            channel: {},
            user: {}
        }
        this.latestDialog = undefined
        this.dialogsOffsetDate = 0 // TODO
        this.offsetDate = 0
    }


    init() {
        MTProto.MessageProcessor.listenUpdateShortMessage(async update => {
            let dialog = undefined

            dialog = await this.findOrFetch("user", update.user_id)

            if (!dialog) return

            if (!update.pFlags.out) {
                dialog.incrementUnreadCountWithoutUpdate()
            }

            dialog.lastMessage = new Message(dialog, update)
        })

        MTProto.MessageProcessor.listenUpdateShortChatMessage(async update => {
            let dialog = undefined

            dialog = await this.findOrFetch("chat", update.chat_id)

            if (!dialog) return

            if (!update.pFlags.out) {
                dialog.incrementUnreadCountWithoutUpdate()
            }

            dialog.lastMessage = new Message(dialog, update)
        })

        MTProto.MessageProcessor.listenUpdateNewMessage(async update => {
            let dialog = undefined

            if (update.message.to_id) {
                const peerName = getPeerNameFromType(update.message.to_id._)
                dialog = await this.findOrFetch(peerName, update.message.to_id[`${peerName}_id`])
            } else {
                dialog = await this.findOrFetch("user", update.message.from_id)
            }

            if (!dialog) return

            if (!update.message.pFlags.out) {
                dialog.incrementUnreadCountWithoutUpdate()
            }

            dialog.lastMessage = new Message(dialog, update.message)
        })

        MTProto.MessageProcessor.listenUpdateDialogPinned(async update => {
            const peerName = getPeerNameFromType(update.peer.peer._)
            const dialog = await this.findOrFetch(peerName, update.peer.peer[`${peerName}_id`])

            if (!dialog) return

            dialog.pinned = update.pFlags.pinned || false
        })

        MTProto.MessageProcessor.listenUpdateNewChannelMessage(async update => {
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


            if (!dialog) return

            if (!update.message.pFlags.out) {
                dialog.incrementUnreadCountWithoutUpdate()
            }

            dialog.lastMessage = new Message(dialog, update.message)
        })

        MTProto.MessageProcessor.listenUpdateDraftMessage(update => {
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

        MTProto.MessageProcessor.listenUpdateReadHistoryInbox(update => {
            // console.log("inbox", update)
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog._dialog.read_inbox_max_id = update.max_id
                dialog._dialog.unread_count = update.still_unread_count
                if (dialog._dialog.unread_count === 0) {
                    dialog._dialog.unread_mentions_count = 0
                }
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.MessageProcessor.listenUpdateReadHistoryOutbox(update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.MessageProcessor.listenUpdateReadChannelInbox(update => {
            // console.log("inbox", update)
            const dialog = this.find("channel", update.channel_id)
            if (dialog) {
                dialog._dialog.read_inbox_max_id = update.max_id
                dialog._dialog.unread_count = update.still_unread_count
                if (dialog._dialog.unread_count === 0) {
                    dialog._dialog.unread_mentions_count = 0
                }
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.MessageProcessor.listenUpdateReadChannelOutbox(update => {
            const dialog = this.find("channel", update.channel_id)
            if (dialog) {
                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })

        MTProto.MessageProcessor.listenUpdateShort(async update => {
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
        return this.dialogs[type][id]
    }

    /**
     * @param type
     * @param id
     * @return {Promise<Dialog|null>}
     */
    async findOrFetch(type, id) {
        let dialog = this.dialogs[type][id]

        if (!dialog) {
            await this.fetchPlainPeerDialogs({_: type, id})
        }

        return this.dialogs[type][id]
    }

    findByUsername(username) {
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
        }).then(dialogsSlice => {
            if (parseInt(dialogsSlice.count) === 0) {
                return
            }

            dialogsSlice.users.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })
            dialogsSlice.chats.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })

            const dialogsToPush = dialogsSlice.dialogs.map(dialog => {
                const keys = {
                    peerUser: "user_id",
                    peerChannel: "channel_id",
                    peerChat: "chat_id"
                }
                const key = keys[dialog.peer._]
                const peer = (dialog.peer._ === "peerUser" ? dialogsSlice.users : dialogsSlice.chats).find(l => l.id === dialog.peer[key])
                const lastMessage = dialogsSlice.messages.find(l => l.id === dialog.top_message)
                this.offsetDate = lastMessage.date
                if (this.offsetDate && !dialog.pFlags.pinned && (!this.dialogsOffsetDate || this.offsetDate < this.dialogsOffsetDate)) {
                    this.dialogsOffsetDate = this.offsetDate
                }
                const p = getPeerObject(peer)
                PeersManager.set(p)

                const d = new Dialog(dialog, p, lastMessage)
                this.dialogs[d.type][d.id] = d

                return d
            })

            if (dialogsToPush[0]) {
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialogsToPush[0],
                })
            }

            dialogsToPush.forEach(l => {
                l.peer.getAvatar()
            })
        })
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

        // __is_latest_sorted = false
        // __is_fetching = true

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
        }).then(dialogsSlice => {
            // __is_fetched = false

            if (parseInt(dialogsSlice.count) === 0) {
                // __is_empty = true
                return
            }

            dialogsSlice.users.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })
            dialogsSlice.chats.forEach(l => {
                PeersManager.set(getPeerObject(l))
            })

            const dialogsToPush = []
            dialogsSlice.dialogs.map(dialog => {
                const keys = {
                    peerUser: "user_id",
                    peerChannel: "channel_id",
                    peerChat: "chat_id"
                }
                const key = keys[dialog.peer._]
                const peer = (dialog.peer._ === "peerUser" ? dialogsSlice.users : dialogsSlice.chats).find(l => l.id === dialog.peer[key])
                const lastMessage = dialogsSlice.messages.find(l => l.id === dialog.top_message)
                this.offsetDate = lastMessage.date
                if (this.offsetDate && !dialog.pFlags.pinned && (!this.dialogsOffsetDate || this.offsetDate < this.dialogsOffsetDate)) {
                    this.dialogsOffsetDate = this.offsetDate
                }
                const p = getPeerObject(peer)
                PeersManager.set(p)

                const d = new Dialog(dialog, p, lastMessage)
                this.dialogs[d.type][d.id] = d
                dialogsToPush.push(d)
                // this.resolveListeners({
                //     type: "dialogLoaded",
                //     dialog: d
                // }) // TODO remove
                return d
            })

            // const dialogsToPush = dialogs.filter(l => !l.pinned)
            // const pinnedDialogsToPush = dialogs.filter(l => l.pinned)

            // $pinnedDialogs.push(...pinnedDialogsToPush)
            // $dialogs.push(...dialogsToPush)

            // __is_fetching = false
            // __is_fetched = true

            this.latestDialog = dialogsToPush[dialogsToPush.length - 1]

            this.resolveListeners({
                type: "updateMany",
                dialogs: dialogsToPush.filter(l => !l.pinned),
                pinnedDialogs: dialogsToPush.filter(l => l.pinned)
            })

            dialogsToPush.forEach(l => {
                l.peer.getAvatar()
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
}

export default new DialogManager()
