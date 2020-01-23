import {getMessagePreviewDialog} from "../../../ui/utils"
import PeersStore from "../../store/peersStore"

export const MessageType = {
    UNSUPPORTED: undefined,
    TEXT: 0,
    PHOTO: 1,
    LOCATION: 2,
    BEACON: 3,
    GAME: 4,
    POLL: 5,
    INVOICE: 6,
    WEB_PAGE: 7,
    CONTACT: 8,
    DOCUMENT: 9,
    STICKER: 10,
    VOICE: 11,
    AUDIO: 12,
    ROUND: 13,
    VIDEO: 14,
    PHONE_CALL: 15,
    SERVICE: 15,
}

export class Message {

    /**
     * @param {Dialog} dialog
     * @param rawMessage
     */
    constructor(dialog, rawMessage) {
        this.dialog = dialog

        this._rawMessage = rawMessage

        /**
         * @type {number}
         */
        this.type = MessageType.TEXT

        this._fromPeer = null
        this._toPeer = null

        this.parseMessageType()
    }

    /**
     * @return {*}
     */
    get id() {
        return this._rawMessage.id
    }

    /**
     * @return {string}
     */
    get text() {
        return this._rawMessage.message || ""
    }

    /**
     * @return {*}
     */
    get entities() {
        return this._rawMessage.entities
    }

    /**
     * @return {Peer}
     */
    get from() {
        if (this._fromPeer) {
            return this._fromPeer
        }

        // TODO there's type of message when channel message is resent to chat
        // should check it!

        if (this.isOut) {
            this._fromPeer = PeersStore.self()
        } else if (this._rawMessage.from_id) {
            this._fromPeer = PeersStore.get("user", this._rawMessage.from_id)
        } else if (this._rawMessage.user_id) {
            this._fromPeer = PeersStore.get("user", this._rawMessage.user_id)
        } else if (this._rawMessage.channel_id) {
            this._fromPeer = PeersStore.get("channel", this._rawMessage.channel_id)
        } else if (this._rawMessage.chat_id) {
            this._fromPeer = PeersStore.get("chat", this._rawMessage.chat_id)
        } else {
            this._fromPeer = this.to
        }

        if (!this._fromPeer) {
            debugger
        }

        return this._fromPeer
    }

    /**
     * @return {Peer}
     */
    get to() {
        if (this.dialog) {
            return this.dialog.peer
        }

        if (this._toPeer) {
            return this._toPeer
        }

        if (this._rawMessage.to_id && this._rawMessage.to_id._ === "peerChannel") {
            this._toPeer = PeersStore.get("channel", this._rawMessage.to_id.channel_id)
        }

        if (this._rawMessage.to_id && this._rawMessage.to_id._ === "peerChat") {
            this._toPeer = PeersStore.get("chat", this._rawMessage.to_id.chat_id)
        }

        if (this._rawMessage.to_id && this._rawMessage.to_id._ === "peerUser") {
            this._toPeer = PeersStore.get("user", this._rawMessage.to_id.user_id)
        }

        return this._toPeer
    }

    /**
     * @return {boolean}
     */
    get isOut() {
        if (this._rawMessage.pFlags.out) {
            return true
        }

        return this._rawMessage.from_id === PeersStore.self().id || this._rawMessage.user_id === PeersStore.self().id
    }

    /**
     * @return {boolean}
     */
    get isPost() {
        return this._rawMessage.pFlags.post || false
    }

    /**
     * @return {boolean}
     */
    get isRead() {
        return this.dialog.messages.readOutboxMaxId >= this.id || this.dialog.messages.readInboxMaxId >= this.id
    }

    /**
     * TODO: cache this thing
     *
     * @return {string}
     */
    get prefix() {
        const from = this.from
        const showSender = (this.isOut || this.from !== this.dialog.peer) && !this.isPost
        const sender = this.isOut ? "You" : from.name

        return getMessagePreviewDialog(this._rawMessage, sender, showSender)
    }

    /**
     * @return {number}
     */
    get replyToMsgId() {
        return this._rawMessage.reply_to_msg_id
    }

    /**
     * @return {*}
     */
    get viaBotId() {
        return this._rawMessage.via_bot_id
    }

    /**
     * @return {*}
     */
    get fwdFrom() {
        return this._rawMessage.fwd_from
    }

    /**
     * @return {number}
     */
    get isScheduled() {
        return this._rawMessage.pFlags && this._rawMessage.pFlags.from_scheduled
    }

    /**
     * @return {number}
     */
    get isSilent() {
        return this._rawMessage.pFlags && this._rawMessage.pFlags.silent
    }

    /**
     * @return {boolean}
     */
    get isEditHide() {
        return this._rawMessage.pFlags && this._rawMessage.pFlags.edit_hide
    }

    /**
     * @return {number}
     */
    get date() {
        return this._rawMessage.date
    }

    /**
     * @return {*}
     */
    get raw() {
        return this._rawMessage
    }

    /**
     * @return {*}
     */
    get media() {
        return this._rawMessage.media
    }

    /**
     * @return {*}
     */
    get action() {
        return this._rawMessage.action
    }

    /**
     * @return {*}
     */
    get views() {
        return this._rawMessage.views
    }

    /**
     * @return {*}
     */
    get replyMarkup() {
        return this._rawMessage.reply_markup
    }

    /**
     * @return {number|undefined}
     */
    get editDate() {
        return this._rawMessage.edit_date
    }

    /**
     * @return {string|undefined}
     */
    get postAuthor() {
        return this._rawMessage.post_author
    }

    /**
     * @return {number|undefined}
     */
    get groupedId() {
        return this._rawMessage.grouped_id
    }

    /**
     * @param locale
     * @param format
     * @return {string}
     */
    getDate(locale, format) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }

    /**
     * ...
     */
    parseMessageType() {
        const message = this._rawMessage

        const media = message.media

        if (media) {
            switch (media._) {
                case "messageMediaPhoto":
                    this.type = MessageType.PHOTO
                    break;
                case "messageMediaGeo":
                    this.type = MessageType.LOCATION
                    break;
                case "messageMediaGeoLive":
                    this.type = MessageType.BEACON
                    break;
                case "messageMediaGame":
                    this.type = MessageType.GAME
                    break;
                case "messageMediaPoll":
                    this.type = MessageType.POLL
                    break;
                case "messageMediaInvoice":
                    this.type = MessageType.INVOICE
                    break;
                case "messageMediaWebPage":
                    this.type = MessageType.WEB_PAGE
                    break;
                case "messageMediaContact":
                    this.type = MessageType.CONTACT
                    break;
                case "messageMediaDocument": {
                    this.type = MessageType.DOCUMENT

                    const attrs = media.document.attributes;
                    for (let i = 0; i < attrs.length; i++) {
                        const attr = attrs[i];
                        if (attr._ === "documentAttributeSticker") {
                            this.type = MessageType.STICKER
                            break;
                        }
                        if (attr._ === "documentAttributeAudio") {
                            if (attr.pFlags.voice) {
                                this.type = MessageType.VOICE
                                break;
                            } else {
                                this.type = MessageType.AUDIO
                                break;
                            }
                        }
                        if (attr._ === "documentAttributeVideo") {
                            if (attr.pFlags.round_message) {
                                this.type = MessageType.ROUND
                                break;
                            } else {
                                this.type = MessageType.VIDEO
                                break;
                            }
                        }
                    }
                }
                    break;
                case "messageMediaEmpty":
                    this.type = MessageType.TEXT
                    break
                case "messageMediaUnsupported":
                default:
                    console.log("unsupported", message.media);
                    this.type = MessageType.UNSUPPORTED;
                    break
            }
        }

        if (message._ === "messageService") {
            switch (message.action._) {
                case "messageActionPhoneCall":
                    this.type = MessageType.PHONE_CALL
                    break
                default:
                    this.type = MessageType.SERVICE
                    break
            }
        }
    }
}