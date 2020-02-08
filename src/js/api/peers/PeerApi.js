import MTProto from "../../mtproto/external"
import PeersManager from "./objects/PeersManager"
import AppEvents from "../eventBus/AppEvents"
import {getInputFromPeer, getInputPeerFromPeer} from "../dialogs/util"
import TimeManager, {tsNow} from "../../mtproto/timeManager"
import {FileAPI} from "../fileAPI"
import {MessageFactory} from "../messages/MessageFactory"
import AppConfiguration from "../../configuration"
import {TextMessage} from "../messages/objects/TextMessage";

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

        const messages = Messages.messages.map(rawMessage => {
            return MessageFactory.fromRaw(this._peer.dialog, rawMessage)
        })

        this._peer.messages.appendMany(messages)

        messages.forEach(message => {
            message.init()
        })

        return messages
    }

    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                AppEvents.Dialogs.fire("fetchedInitialMessages", {
                    dialog: this._peer.dialog,
                    messages: messages
                })
            }
        })
    }

    fetchNextPage() {
        let oldest = this._peer.messages.oldest

        if (!oldest) {
            return Promise.resolve()
        }

        return this.getHistory({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
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
                    this._peer.dialog.peer.messages.deleteUnreadBy(maxId)
                    // this.dialog.peer.messages.clearUnread()
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
                this._peer.dialog.peer.messages.deleteUnreadBy(maxId)
                // this.dialog.peer.messages.clearUnread()
                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this._peer.dialog
                })
            })
        }
    }

    readAllHistory() {
        if (this._peer.messages.last) {
            this.readHistory(this._peer.messages.last.id)
        }
    }

    sendMessage({
                    text,
                    media = null,
                    messageEntities = [],
                    replyTo = null,
                    silent = false,
                    clearDraft = true,
                    noWebpage = false,
                    background = false,
                    scheduleDate = null
                }) {
        if(Array.isArray(media) && media.length === 1) {
            media = media[0]
        }
        const multi = Array.isArray(media)
        let p = Promise.resolve()
        if(multi) {
            p = Promise.all(media.map(l => {
                return FileAPI.uploadMediaToPeer(this._peer, l).then(q => {
                    return q
                })
            }))
        }

        // TODO fix albums
        let randomId = TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
        let message = new TextMessage(this._peer.dialog)
        message.fillRaw({
            pFlags: {
                out: true,
                sending: true
            },
            date: Math.floor(+new Date() / 1000),
            message: text,
            entities: messageEntities,
            random_id: randomId,
            reply_to_msg_id: replyTo
        })
        AppEvents.Dialogs.fire("sendMessage", {
            dialog: this._peer.dialog,
            message: message
        })

        p.then(q => {
            MTProto.invokeMethod(media ? (multi ? "messages.sendMultiMedia" : "messages.sendMedia") : "messages.sendMessage", {
                pFlags: {
                    clear_draft: clearDraft,
                    silent: silent,
                    reply_to_msg_id: replyTo,
                    entities: messageEntities,
                    no_webpage: noWebpage,
                    background: background,
                    schedule_date: scheduleDate
                },

                peer: this._peer.inputPeer,
                message: text,
                media: media,
                multi_media: q && q.map((l, i) => {
                    return {
                        _: "inputSingleMedia",
                        media: {
                            _: "inputMediaPhoto",
                            id: {
                                _: "inputPhoto",
                                id: l.photo.id,
                                access_hash: l.photo.access_hash,
                                file_reference: l.photo.file_reference
                            }
                        },
                        message: i === 0 ? text : null,
                        pFlags: {
                            entities: i === 0 ? messageEntities : null
                        },
                        random_id: TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
                    }
                }),
                random_id: randomId
            }).then(response => {
                if(response.updates) {
                    response.updates.forEach(l => {
                        if(l._ === "updateMessageID") l.dialog = this._peer.dialog
                    })
                } else {
                    this._peer.dialog.peer.messages._sendingMessages.set(response.id, randomId)
                    response.random_id = randomId
                }
                response.dialog = this._peer.dialog
                response.message = text
                response.reply_to_msg_id = replyTo
                response.silent = silent
                MTProto.UpdatesManager.process(response)
            })
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

    sendExistingMedia(document) {
        MTProto.invokeMethod("messages.sendMedia", {
            peer: this._peer.inputPeer,
            message: "",
            media: {
                _: "inputMediaDocument",
                flags: 0,
                id: {
                    _: "inputDocument",
                    id: document.id,
                    access_hash: document.access_hash,
                    file_reference: document.file_reference,
                }
            },
            random_id: TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
        }).then(response => {
            MTProto.UpdatesManager.process(response)
        })
    }
}