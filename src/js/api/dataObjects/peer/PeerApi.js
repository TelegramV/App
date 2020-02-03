import MTProto from "../../../mtproto/external"
import PeersManager from "../../peers/PeersManager"
import AppEvents from "../../eventBus/AppEvents"
import {getInputFromPeer, getInputPeerFromPeer} from "../../dialogs/util"
import TimeManager from "../../../mtproto/timeManager"
import {FileAPI} from "../../fileAPI"
import {MessageFactory} from "../../messages/MessageFactory"
import AppConfiguration from "../../../configuration"

export class PeerApi {

    /**
     * @type {Peer}
     */
    _peer

    /**
     * @param {Peer} peer
     */
    constructor(peer) {
        this._peer = peer
    }

    /**
     * @param props
     * @return {Promise<Message[]>}
     */
    async getHistory(props = {offset_id: 0, limit: 20}) {
        const Messages = await MTProto.invokeMethod("messages.getHistory", {
            peer: this._peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: props.offset_date || 0,
            add_offset: props.add_offset || 0,
            limit: props.limit || 50,
            max_id: props.max_id || 0,
            min_id: props.min_id || 0,
            hash: props.hash || 0
        })


        if (Messages._ === "messages.channelMessages") {
            this._peer.dialog.pts = Messages.pts
        }

        Messages.chats.forEach(chat => {
            PeersManager.setFromRawAndFire(chat)
        })

        Messages.users.forEach(user => {
            PeersManager.setFromRawAndFire(user)
        })

        return Messages.messages.map(rawMessage => {
            return MessageFactory.fromRaw(this._peer.dialog, rawMessage)
        })
    }

    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                this._peer.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedInitialMessages", {
                    dialog: this._peer.dialog,
                    messages: messages
                })
            }
        })
    }

    fetchNextPage() {
        let oldest = this._peer.dialog.messages.oldest

        console.log(oldest)

        return this.getHistory({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
                this._peer.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedMessagesNextPage", {
                    dialog: this._peer.dialog,
                    messages: messages
                })
            }
        })
    }

    readHistory(maxId) {
        if (this._peer.type === "channel") {
            return MTProto.invokeMethod("channels.readHistory", {
                channel: getInputFromPeer(this._peer.type, this._peer.id, this._peer.accessHash),
                max_id: maxId
            }).then(response => {
                if (response._ === "boolTrue") {
                    this._peer.dialog.messages.deleteUnreadBy(maxId)
                    // this.dialog.messages.clearUnread()
                    AppEvents.Dialogs.fire("readHistory", {
                        dialog: this._peer.dialog
                    })
                }
            })
        } else {
            return MTProto.invokeMethod("messages.readHistory", {
                peer: getInputPeerFromPeer(this._peer.type, this._peer.id, this._peer.accessHash),
                max_id: maxId
            }).then(response => {
                this._peer.dialog.messages.deleteUnreadBy(maxId)
                // this.dialog.messages.clearUnread()
                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this._peer.dialog
                })
            })
        }
    }

    readAllHistory() {
        if (this._peer.dialog.messages.last) {
            this.readHistory(this._peer.dialog.messages.last.id)
        }
    }

    sendMessage(text, replyTo = null, silent = false, clearDraft = true) {
        MTProto.invokeMethod("messages.sendMessage", {
            pFlags: {
                clear_draft: clearDraft,
                silent: silent,
                reply_to_msg_id: replyTo
            },

            peer: this._peer.inputPeer,
            message: text,
            random_id: TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
        }).then(response => {
            response.dialog = this._peer.dialog
            response.message = text
            response.reply_to_msg_id = replyTo
            response.silent = silent
            MTProto.UpdatesManager.process(response)
        })
    }

    sendMedia(text, file, f) {
        FileAPI.saveFilePart(f.file.id, file).then(l => {
            MTProto.invokeMethod("messages.sendMedia", {
                peer: this._peer.inputPeer,
                message: text,
                media: f,
                random_id: TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
        })
    }

    sendSticker(sticker) {
        MTProto.invokeMethod("messages.sendMedia", {
                peer: this._peer.inputPeer,
                message: "",
                media: {
                    _: "inputMediaDocument",
                    flags: 0,
                    id: {
                        _: "inputDocument",
                        id: sticker.id,
                        access_hash: sticker.access_hash,
                        file_reference: sticker.file_reference,
                    }
                },
                random_id: TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
    }
}