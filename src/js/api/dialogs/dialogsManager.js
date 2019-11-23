import {MTProto} from "../../mtproto"
import {nextRandomInt} from "../../mtproto/utils/bin"
import {getInputPeerFromPeer} from "./util"
import TimeManager from "../../mtproto/timeManager"
import {getMessageLocalID} from "./messageIdManager"
import PeersManager from "../peers/peersManager"
import {Dialog} from "../../dataObjects/dialog";
import {getPeerObject} from "../../dataObjects/peerFactory";
import {Manager} from "../manager";

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


            dialogsToPush.forEach(async l => {
                await l.peer.getAvatar()
            })

        })

    }
}

export default new DialogManager()





function init() {
    /*MTProto.MessageProcessor.listenUpdateShortMessage(update => {
        const messageUser = PeersManager.find("user", update.user_id)
        let messageUsername = `${getPeerName(messageUser, false)}`
        let messageSelf = messageUser ? messageUser.id === update.user_id : false

        const message = update

        const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

        updateSingle({_: "user", id: message.user_id} , {
            message: {
                sender: messageUsername + msgPrefix,
                text: submsg,
                self: messageSelf,
                date: date,
                id: message.id,
            }
        })
    })*/
}
