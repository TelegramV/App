import MTProto from "../../mtproto/external"
import PeersManager from "./objects/PeersManager"
import AppEvents from "../eventBus/AppEvents"
import {getInputFromPeer, getInputPeerFromPeer} from "../dialogs/util"
import {FileAPI} from "../fileAPI"
import {MessageFactory} from "../messages/MessageFactory"
import AppConfiguration from "../../configuration"
import {TextMessage} from "../messages/objects/TextMessage";
import UIEvents from "../../ui/eventBus/UIEvents";

const genMsgId = () => (new Date).getTime()

export class PeerApi {

    /**
     * @type {Peer}
     */
    peer

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
        const Messages = await MTProto.invokeMethod("messages.getHistory", {
            peer: this.peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: props.offset_date || 0,
            add_offset: props.add_offset || 0,
            limit: props.limit || 50,
            max_id: props.max_id || 0,
            min_id: props.min_id || 0,
            hash: props.hash || 0
        })


        if (Messages._ === "messages.channelMessages") {
            if (this.peer.dialog) {
                this.peer.dialog.pts = Messages.pts
            }
        }

        PeersManager.fillPeersFromUpdate(Messages)

        const messages = Messages.messages.filter(m => m._ !== "messageEmpty").map(rawMessage => {
            return MessageFactory.fromRaw(this.peer, rawMessage)
        })

        this.peer.messages.appendMany(messages)

        messages.forEach(message => {
            message.init()
        })

        return messages
    }

    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                // AppEvents.Dialogs.fire("fetchedInitialMessages", {
                //     dialog: this.peer.dialog,
                //     messages: messages
                // })
                AppEvents.Peers.fire("fetchedInitialMessages", {
                    peer: this.peer,
                    messages: messages
                })
            }
        })
    }

    fetchByOffsetId({offset_id, limit, add_offset}) {
        return this.getHistory({offset_id, limit, add_offset: -1 + add_offset}).then(messages => {
            // console.log("fetchByOffsetId returned", messages.length)
            if (messages.length > 0) {
                // AppEvents.Dialogs.fire("fetchedMessagesAnyPage", {
                //     dialog: this.peer.dialog,
                //     messages: messages
                // })
                AppEvents.Peers.fire("fetchedMessagesAnyPage", {
                    peer: this.peer,
                    messages: messages
                })
            }
        })
    }

    fetchNextPage(id = null) {
        if (!id) {
            let oldest = this.peer.messages.oldest
            // console.log("fetchNextPage", oldest)

            if (!oldest) {
                return Promise.resolve()
            }
            id = oldest.id
        }

        return this.getHistory({offset_id: id}).then(messages => {
            // console.log("fetchNextPage returned", messages.length)
            if (messages.length > 0) {
                // AppEvents.Dialogs.fire("fetchedMessagesNextPage", {
                //     dialog: this.peer.dialog,
                //     messages: messages
                // })
                AppEvents.Peers.fire("fetchedMessagesNextPage", {
                    peer: this.peer,
                    messages: messages
                })
            }
        })
    }


    fetchPrevPage(id = null) {
        if (!id) {
            let newest = this.peer.messages.newest
            // console.log("fetchNextPage", newest)

            if (!newest) {
                return Promise.resolve()
            }
            id = newest.id
        }

        return this.getHistory({offset_id: id, add_offset: -50}).then(messages => {
            // console.log("fetchPrevPage returned", messages.length)
            // if (messages.length > 0) {
            // AppEvents.Dialogs.fire("fetchedMessagesPrevPage", {
            //     dialog: this.peer.dialog,
            //     messages: messages.reverse()
            // })
            AppEvents.Peers.fire("fetchedMessagesPrevPage", {
                peer: this.peer,
                messages: messages.reverse()
            })
            // }
        })
    }

    fetchParticipants(offset, limit = 33) {
        if (this._peer.type === "channel") {
            return MTProto.invokeMethod("channels.getParticipants", {
                channel: this._peer.inputPeer,
                filter: {
                    _: "channelParticipantsRecent"
                },
                offset: offset,
                limit: limit
            }).then(l => {
                console.log(l)
                PeersManager.fillPeersFromUpdate(l)
                return l.participants
            })
        } else if(this._peer.type === "chat") {
            if(this._peer.full && this._peer.full.participants) {
                return Promise.resolve(this._peer.full.participants.participants)
            }

            return this._peer.fetchFull().then(l =>{
                return this._peer.full.participants.participants
            })
        } else
        {
            return Promise.resolve()
        }
    }

    readHistory(maxId) {
        if (this.peer.type === "channel") {
            return MTProto.invokeMethod("channels.readHistory", {
                channel: getInputFromPeer(this.peer.type, this.peer.id, this.peer.accessHash),
                max_id: maxId
            }).then(response => {
                if (response._ === "boolTrue") {
                    this.peer.messages.readInboxMaxId = maxId

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
                this.peer.messages.readInboxMaxId = maxId

                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this.peer.dialog
                })
            })
        }
    }

    readAllHistory() {
        if (this.peer.messages.last) {
            this.readHistory(this.peer.messages.last.id)
        }
    }

    updateNotifySettings({
                             show_previews,
                             silent,
                             mute_until,
                             sound
                         }) {
        return MTProto.invokeMethod("account.updateNotifySettings", {
            peer: {_: "inputNotifyPeer", peer: this._peer.inputPeer},
            settings: {
                _: "inputPeerNotifySettings",
                pFlags: {
                    silent: silent,
                    show_previews: show_previews,
                    mute_until: mute_until,
                    sound: sound
                }
            }
        }).then(l => {
            if (l._ === "boolTrue" && this._peer.full) {
                if (mute_until !== undefined) this._peer.full.notify_settings.mute_until = mute_until
                if (silent !== undefined) this._peer.full.notify_settings.silent = silent
                if (sound !== undefined) this._peer.full.notify_settings.sound = sound
                if (show_previews !== undefined) this._peer.full.notify_settings.show_previews = show_previews
            }
        })
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
        if (Array.isArray(media) && media.length === 1) {
            media = media[0]
        }
        const multi = Array.isArray(media)
        let p = Promise.resolve()
        if (multi) {
            p = Promise.all(media.map(l => {
                return FileAPI.uploadMediaToPeer(this.peer, l).then(q => {
                    return q
                })
            }))
        }

        // TODO fix albums
        let randomId = genMsgId(AppConfiguration.mtproto.dataCenter.default)
        let message = new TextMessage(this.peer.dialog)
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
        // AppEvents.Dialogs.fire("sendMessage", {
        //     dialog: this.peer.dialog,
        //     message: message
        // })
        UIEvents.Bubbles.fire("scrollToBottom")

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

                peer: this.peer.inputPeer,
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
                        random_id: genMsgId(AppConfiguration.mtproto.dataCenter.default)
                    }
                }),
                random_id: randomId
            }).then(response => {
                if (response.updates) {
                    response.updates.forEach(l => {
                        if (l._ === "updateMessageID") l.dialog = this.peer.dialog
                    })
                } else {

                    // this.peer.messages._sendingMessages.set(response.id, randomId)
                    // response.random_id = randomId
                }
                response.dialog = this.peer.dialog
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
                peer: this.peer.inputPeer,
                message: text,
                media: f,
                random_id: genMsgId(AppConfiguration.mtproto.dataCenter.default)
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
        })
    }

    sendExistingMedia(document) {
        MTProto.invokeMethod("messages.sendMedia", {
            peer: this.peer.inputPeer,
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
            random_id: genMsgId(AppConfiguration.mtproto.dataCenter.default)
        }).then(response => {
            MTProto.UpdatesManager.process(response)
        })
    }
}