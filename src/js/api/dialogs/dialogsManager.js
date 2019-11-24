import {MTProto} from "../../mtproto"
import {nextRandomInt} from "../../mtproto/utils/bin"
import {getInputPeerFromPeer} from "./util"
import TimeManager from "../../mtproto/timeManager"
import {getMessageLocalID} from "./messageIdManager"
import PeersManager from "../peers/peersManager"
import {Dialog} from "../../dataObjects/dialog";
import {getPeerObject} from "../../dataObjects/peerFactory";
import {Manager} from "../manager";
import {UserPeer} from "../../dataObjects/userPeer";
import {SupergroupPeer} from "../../dataObjects/supergroupPeer";
import {GroupPeer} from "../../dataObjects/groupPeer";
import {ChannelPeer} from "../../dataObjects/channelPeer";
import {Peer} from "../../dataObjects/peer";

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
        MTProto.MessageProcessor.listenUpdateShortMessage(update => {
            console.log("ShortMessage", update)
        })
        MTProto.MessageProcessor.listenUpdateNewChannelMessage(update => {
            // console.log("NewChannelMessage", update)
        })
        MTProto.MessageProcessor.listenUpdateDraftMessage(update => {
            const dialog = this.findByPeer(update.peer)
            if(dialog) {
                dialog._dialog.draft = update.draft
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            }
        })
        MTProto.MessageProcessor.listenUpdateReadHistoryOutbox(update => {
            console.log("outbox", update)
        })
        MTProto.MessageProcessor.listenUpdateReadHistoryInbox(update => {
            console.log("inbox", update)
        })
        MTProto.MessageProcessor.listenUpdateShort(async update => {
            if(update._ === "updateUserStatus") {
                const dialog = this.find("user", update.user_id)

                if (dialog && dialog.peer instanceof UserPeer) {
                    dialog.peer.peer.status = update.status
                    this.resolveListeners({
                        type: "updateSingle",
                        dialog: dialog
                    })
                }
            } else if(update._ === "updateChatUserTyping") {
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

            } else if(update._ === "updateUserTyping") {
                console.log(update)
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
            } else if(update._ === "updateReadChannelOutbox") {
                const dialog = this.find("channel", update.channel_id)

                if (!dialog) {
                    return // prob should be fixed
                }

                dialog._dialog.read_outbox_max_id = update.max_id
                this.resolveListeners({
                    type: "updateSingle",
                    dialog: dialog
                })
            } else if(update._ === "updateReadHistoryOutbox") {
                console.log(update)
            } else {
                console.log("Short", update)
            }
        })
    }

    fetchNextPage({limit = 20}) {
        const latestDialog = this.latestDialog
        const peer = latestDialog.peer

        const offsetPeer = getInputPeerFromPeer(peer.type, peer.id)

        const data = {
            limit: limit,
            offset_peer: offsetPeer
        }

        return this.fetchDialogs(data)
    }

    find(type, id) {
        return this.dialogs[type][id]
    }

    findByPeer(peer) {
        if(peer instanceof Peer) return this.find(peer.type, peer.id)

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

    fetchDialogs({
                     limit = 20,
                     flags = {},
                     exclude_pinned = false,
                     folder_id = "",
                     offset_date = "",
                     offset_id = "",
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
            exclude_pinned: exclude_pinned,
            folder_id: folder_id,
            offset_date: this.offsetDate,
            offset_id: offset_id,
            offset_peer: offset_peer,
            limit: limit,
            hash: hash
        }).then(dialogsSlice => {
            // __is_fetched = false

            if (Number(dialogsSlice.count) === 0) {
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
        if(dialog.type === "channel") return this.updateChannelFull(dialog)

        return MTProto.invokeMethod( "messages.getFullChat", {
            chat_id: dialog.id
        }).then(l => {
            l.users.forEach(q => {
                PeersManager.set(getPeerObject(q))
            })
            if(dialog instanceof GroupPeer) {
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
            if(dialog instanceof ChannelPeer) {
                console.log("ChannelPeer", l)
            } else if(dialog instanceof SupergroupPeer) {
                console.log("SupergroupPeer", l)
            }
        })
    }
}

export default new DialogManager()
