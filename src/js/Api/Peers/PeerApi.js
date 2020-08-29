import MTProto from "../../MTProto/External"
import PeersManager from "./PeersManager"
import { getInputFromPeer, getInputPeerFromPeer } from "../Dialogs/util"
import { FileAPI } from "../Files/FileAPI"
import { TextMessage } from "../Messages/Objects/TextMessage";
import UIEvents from "../../Ui/EventBus/UIEvents";
import {largestTriangleThreeBuckets} from "../../Utils/audio"
import {convertBits} from "../../Ui/Utils/utils"

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

    fetchParticipants(offset, limit = 33) {
        if (this.peer.type === "channel") {
            return MTProto.invokeMethod("channels.getParticipants", {
                channel: this.peer.inputPeer,
                filter: {
                    _: "channelParticipantsRecent"
                },
                offset: offset,
                limit: limit
            }).then(l => {
                PeersManager.fillPeersFromUpdate(l)
                return l.participants
            })
        } else if (this.peer && this.peer.type === "chat") {
            if (this.peer.full && this.peer.full.participants) {
                return Promise.resolve(this.peer.full.participants.participants)
            }

            return this.peer.fetchFull().then(l => {
                return this.peer.full.participants.participants
            })
        } else {
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
                    const prevMaxId = this.peer.messages.readInboxMaxId;

                    this.peer.messages.readInboxMaxId = maxId;

                    this.peer.fire("messages.readIn", {
                        maxId: this.peer.messages.readInboxMaxId,
                        prevMaxId,
                    });
                }
            })
        } else {
            return MTProto.invokeMethod("messages.readHistory", {
                peer: getInputPeerFromPeer(this.peer.type, this.peer.id, this.peer.accessHash),
                max_id: maxId
            }).then(response => {
                const prevMaxId = this.peer.messages.readInboxMaxId;

                this.peer.messages.readInboxMaxId = maxId;

                this.peer.fire("messages.readIn", {
                    maxId: this.peer.messages.readInboxMaxId,
                    prevMaxId,
                });
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
            peer: { _: "inputNotifyPeer", peer: this.peer.inputPeer },
            settings: {
                _: "inputPeerNotifySettings",
                silent: silent,
                show_previews: show_previews,
                mute_until: mute_until,
                sound: sound
            }
        }).then(l => {
            if (l._ === "boolTrue") {
                if (!this.peer.full) {
                    this.peer.fetchFull()
                } else {
                    if (mute_until !== undefined) this.peer.full.notify_settings.mute_until = mute_until
                    if (silent !== undefined) this.peer.full.notify_settings.silent = silent
                    if (sound !== undefined) this.peer.full.notify_settings.sound = sound
                    if (show_previews !== undefined) this.peer.full.notify_settings.show_previews = show_previews
                }
            }
        })
    }

    async forwardMessages({
        messages = [],
        to = null,
    }) {
        let randomId = genMsgId()
        const randomIds = messages.map(l => randomId++)
        const response = await MTProto.invokeMethod("messages.forwardMessages", {
            silent: false,
            background: true,
            with_my_score: true,
            grouped: false,
            from_peer: this.peer.inputPeer,
            to_peer: to.inputPeer,
            id: messages.map(l => l.id),
            random_id: randomIds
        })
        MTProto.UpdatesManager.process(response)
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
            p = new Promise(async (resolve) => {
                const a = []
                for (let l of media) {
                    console.log(l)
                    a.push(await FileAPI.uploadMediaToPeer(this.peer, l))
                }
                //console.log(a)
                resolve(a)
                return a
            })
            // p = Promise.all(media.map(l => {
            //     console.log(l)
            //     return FileAPI.uploadMediaToPeer(this.peer, l).then(q => {
            //         console.log(q)
            //         return q
            //     })
            // }))
        }

        // TODO fix albums
        let randomId = genMsgId()
        let message = new TextMessage(this.peer)
        message.fillRaw({
            out: true,
            sending: true,
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
        UIEvents.General.fire("chat.scrollBottom")

        p.then(q => {
            //console.log(q)

            let msgId = 0
            MTProto.invokeMethod(media ? (multi ? "messages.sendMultiMedia" : "messages.sendMedia") : "messages.sendMessage", {
                clear_draft: clearDraft,
                silent: silent,
                reply_to_msg_id: replyTo,
                entities: messageEntities,
                no_webpage: noWebpage,
                background: background,
                schedule_date: scheduleDate,
                peer: this.peer.inputPeer,
                message: text,
                media: multi ? null : media,
                multi_media: q && q.map((l, i) => {
                    return {
                        _: "inputSingleMedia",
                        media: this.toInputMedia(l),
                        message: i === 0 ? text : null,
                        entities: i === 0 ? messageEntities : null,
                        random_id: genMsgId() + msgId++
                    }
                }),
                random_id: randomId
            }).then(response => {
                //console.log(response)
                if (response.updates) {
                    response.updates.forEach(l => {
                        if (l._ === "updateMessageID") l.peer = this.peer
                    })
                } else {

                    // this.peer.messages._sendingMessages.set(response.id, randomId)
                    // response.random_id = randomId
                }
                response.peer = this.peer
                response.message = text
                response.reply_to_msg_id = replyTo
                response.silent = silent
                MTProto.UpdatesManager.process(response)
            })
        })
    }

    toInputMedia(media) {
        if (media._ === "messageMediaPhoto") {
            return {
                _: "inputMediaPhoto",
                id: {
                    _: "inputPhoto",
                    id: media.photo.id,
                    access_hash: media.photo.access_hash,
                    file_reference: media.photo.file_reference
                }
            }
        }
        if (media._ === "messageMediaDocument") {
            return {
                _: "inputMediaDocument",
                id: {
                    _: "inputDocument",
                    id: media.document.id,
                    access_hash: media.document.access_hash,
                    file_reference: media.document.file_reference
                }
            }
        }
        return {}
    }

    sendMedia(text, file, f) {
        FileAPI.saveFilePart(f.file.id, file).then(l => {
            MTProto.invokeMethod("messages.sendMedia", {
                peer: this.peer.inputPeer,
                message: text,
                media: f,
                random_id: genMsgId()
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
                id: {
                    _: "inputDocument",
                    id: document.id,
                    access_hash: document.access_hash,
                    file_reference: document.file_reference,
                }
            },
            random_id: genMsgId()
        }).then(response => {
            MTProto.UpdatesManager.process(response)
        })
    }

    sendRawMedia(media) {
        MTProto.invokeMethod("messages.sendMedia", {
            peer: this.peer.inputPeer,
            message: "",
            media,
            random_id: genMsgId()
        }).then(response => {
            MTProto.UpdatesManager.process(response)
        })
    }

    sendDice(emoji) {
        MTProto.invokeMethod("messages.sendMedia", {
            peer: this.peer.inputPeer,
            message: "",
            media: {
                _: "inputMediaDice",
                emoticon: emoji
            },
            random_id: genMsgId()
        }).then(response => {
            MTProto.UpdatesManager.process(response)
        })
    }

    sendVoice(blob, duration = 1, waveform = []) {
        blob.arrayBuffer().then(buffer => {
            return FileAPI.uploadFile(buffer, "voice.ogg")
        }).then(inputFile => {
            MTProto.invokeMethod("messages.sendMedia", {
                peer: this.peer.inputPeer,
                message: "",
                media: {
                    _: "inputMediaUploadedDocument",
                    file: inputFile,
                    mime_type: "audio/ogg",
                    attributes: [{
                            _: "documentAttributeAudio",
                            duration: duration,
                            voice: true,
                            waveform: largestTriangleThreeBuckets(waveform, 100) //convertBits(this.waveform, 8, 5)
                        },
                        {
                            _: "documentAttributeFilename",
                            file_name: ""
                        }
                    ]
                },
                random_id: genMsgId()
            }).then(response => {
                MTProto.UpdatesManager.process(response)
            })
        })
    }

    sendMessageAction(action) {
        MTProto.invokeMethod("messages.setTyping", {
            peer: this.peer.inputPeer,
            action
        })
    }
}