import MTProto from "../../../mtproto"
import PeersManager from "../../peers/peersManager"
import {Message} from "../messages/message"
import AppEvents from "../../eventBus/appEvents"
import {getInputFromPeer, getInputPeerFromPeer} from "../../dialogs/util"
import TimeManager from "../../../mtproto/timeManager"
import {FileAPI} from "../../fileAPI"

/**
 * @property {Dialog} dialog
 */
export class DialogAPI {

    /**
     * @param {Dialog} dialog
     */
    constructor(dialog) {
        this.dialog = dialog
    }

    /**
     * @param props
     * @return {Promise<Message[]>}
     */
    async getHistory(props = {offset_id: 0, limit: 20}) {
        const messagesSlice = await MTProto.invokeMethod("messages.getHistory", {
            peer: this.dialog.peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: 0,
            add_offset: 0,
            limit: props.limit || 20,
            max_id: 0,
            min_id: 0,
            hash: 0
        })

        messagesSlice.chats.forEach(chat => {
            PeersManager.setFromRawAndFire(chat)
        })

        messagesSlice.users.forEach(user => {
            PeersManager.setFromRawAndFire(user)
        })

        return messagesSlice.messages.map(rawMessage => {
            return new Message(this.dialog, rawMessage)
        })
    }


    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                this.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedInitialMessages", {
                    dialog: this.dialog,
                    messages: messages
                })
            }
        })
    }


    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => {
            this.pinned = l
        })
    }

    fetchNextPage() {
        let oldest = this.dialog.messages.oldest

        return this.getHistory({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
                this.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedMessagesNextPage", {
                    dialog: this.dialog,
                    messages: messages
                })
            }
        })
    }

    readHistory(maxId) {
        if (this.dialog.peer.type === "channel") {
            return MTProto.invokeMethod("channels.readHistory", {
                channel: getInputFromPeer(this.dialog.peer.type, this.dialog.peer.id, this.dialog.peer.accessHash),
                max_id: maxId
            }).then(response => {
                if (response._ === "boolTrue") {
                    this.dialog.messages.deleteUnreadBy(maxId)
                    // this.dialog.messages.clearUnread()
                    AppEvents.Dialogs.fire("readHistory", {
                        dialog: this.dialog
                    })
                }
            })
        } else {
            return MTProto.invokeMethod("messages.readHistory", {
                peer: getInputPeerFromPeer(this.dialog.peer.type, this.dialog.peer.id, this.dialog.peer.accessHash),
                max_id: maxId
            }).then(response => {
                this.dialog.messages.deleteUnreadBy(maxId)
                // this.dialog.messages.clearUnread()
                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this.dialog
                })
            })
        }
    }

    readAllHistory() {
        this.readHistory(this.dialog.messages.last.id)
    }

    // Should be moved to peer?
    sendMessage(text, replyTo = null, silent = false, clearDraft = true) {
        MTProto.invokeMethod("messages.sendMessage", {
            pFlags: {
                clear_draft: clearDraft,
                silent: silent,
                reply_to_msg_id: replyTo
            },

            peer: this.dialog.peer.inputPeer,
            message: text,
            random_id: TimeManager.generateMessageID()
        }).then(response => {
            response.dialog = this.dialog
            response.message = text
            response.reply_to_msg_id = replyTo
            response.silent = silent
            MTProto.UpdatesManager.process(response)
        })
    }

    sendMedia(text, file, f) {
        FileAPI.saveFilePart(f.file.id, file).then(l => {
            MTProto.invokeMethod("messages.sendMedia", {
                peer: this.dialog.peer.inputPeer,
                message: text,
                media: f,
                random_id: TimeManager.generateMessageID()
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
        })
    }

    markDialogUnread(unread) {
        MTProto.invokeMethod("messages.markDialogUnread", {
            flags: 0,
            pFlags: {
                unread: unread
            },
            unread: unread,
            peer: this.dialog.peer.inputPeer
        }).then(response => {
            console.log(response)
        })
    }
}