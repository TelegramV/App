import MTProto from "../../../mtproto"
import PeersManager from "../../peers/PeersManager"
import {Message} from "../messages/Message"
import AppEvents from "../../eventBus/AppEvents"
import {getInputFromPeer, getInputPeerFromPeer} from "../../dialogs/util"
import TimeManager from "../../../mtproto/timeManager"
import {FileAPI} from "../../fileAPI"

export class PeerApi {
    /**
     * @param {Peer} peer
     */
    constructor(peer) {
        this.peer = peer
    }

    /**
     * @param props
     * @return {Promise<Message[]>}
     */
    async getHistory(props = {offset_id: 0, limit: 20}) {
        const messagesSlice = await MTProto.invokeMethod("messages.getHistory", {
            peer: this.peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: 0,
            add_offset: 0,
            limit: props.limit || 100,
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
            return new Message(this.peer.dialog, rawMessage)
        })
    }

    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                this.peer.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedInitialMessages", {
                    dialog: this.peer.dialog,
                    messages: messages
                })
            }
        })
    }

    fetchNextPage() {
        let oldest = this.peer.dialog.messages.oldest

        return this.getHistory({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
                this.peer.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedMessagesNextPage", {
                    dialog: this.peer.dialog,
                    messages: messages
                })
            }
        })
    }

    readHistory(maxId) {
        if (this.peer.type === "channel") {
            return MTProto.invokeMethod("channels.readHistory", {
                channel: getInputFromPeer(this.peer.type, this.peer.id, this.peer.accessHash),
                max_id: maxId
            }).then(response => {
                if (response._ === "boolTrue") {
                    this.peer.dialog.messages.deleteUnreadBy(maxId)
                    // this.dialog.messages.clearUnread()
                    AppEvents.Dialogs.fire("readHistory", {
                        dialog: this.peer.dialog
                    })
                }
            })
        } else {
            return MTProto.invokeMethod("messages.readHistory", {
                peer: getInputPeerFromPeer(this.peer.type, this.peer.id, this.peer.accessHash),
                max_id: maxId
            }).then(response => {
                this.peer.dialog.messages.deleteUnreadBy(maxId)
                // this.dialog.messages.clearUnread()
                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this.peer.dialog
                })
            })
        }
    }

    readAllHistory() {
        if (this.peer.dialog.messages.last) {
            this.readHistory(this.peer.dialog.messages.last.id)
        }
    }

    sendMessage(text, replyTo = null, silent = false, clearDraft = true) {
        MTProto.invokeMethod("messages.sendMessage", {
            pFlags: {
                clear_draft: clearDraft,
                silent: silent,
                reply_to_msg_id: replyTo
            },

            peer: this.peer.inputPeer,
            message: text,
            random_id: TimeManager.generateMessageID()
        }).then(response => {
            response.dialog = this.peer.dialog
            response.message = text
            response.reply_to_msg_id = replyTo
            response.silent = silent
            MTProto.UpdatesManager.process(response)
        })
    }

    sendMedia(text, file, f) {
        FileAPI.saveFilePart(f.file.id, file).then(l => {
            MTProto.invokeMethod("messages.sendMedia", {
                peer: this.peer.inputPeer,
                message: text,
                media: f,
                random_id: TimeManager.generateMessageID()
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
        })
    }
}