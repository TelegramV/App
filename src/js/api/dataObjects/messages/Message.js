import {getMessagePreviewDialog} from "../../../ui/utils"
import PeersStore from "../../store/PeersStore"
import MessagesManager from "../../messages/MessagesManager"

export const MessageType = {
    UNSUPPORTED: undefined,
    TEXT: 0,
    PHOTO: 1,
    GEO: 2,
    GEO_LIVE: 3,
    VENUE: 4,
    GAME: 5,
    POLL: 6,
    INVOICE: 7,
    WEB_PAGE: 8,
    CONTACT: 9,
    DOCUMENT: 10,
    GIF: 11,
    STICKER: 12,
    VOICE: 13,
    AUDIO: 14,
    ROUND: 15,
    VIDEO: 16,
    PHONE_CALL: 17,
    SERVICE: 18,
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

        this.fillRaw(rawMessage)
    }

    /**
     * @return {number}
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

        this._fromPeer = MessagesManager.getFromPeerMessage(this.raw)

        if (!this._fromPeer) {
            console.warn("no from peer")
        }

        return this._fromPeer
    }

    /**
     * @return {Peer}
     */
    get to() {
        if (this._toPeer) {
            return this._toPeer
        }

        if (this.dialog) {
            return this._toPeer = this.dialog.peer
        }

        this._toPeer = MessagesManager.getToPeerMessage(this.raw)

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
    
    get replyMarkup() {
        return this.raw.reply_markup
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

        return getMessagePreviewDialog(this, sender, showSender)
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
        const message = this.raw
        const media = message.media

        if (media) {
            switch (media._) {
                case "messageMediaPhoto":
                    this.type = MessageType.PHOTO
                    break;
                case "messageMediaGeo":
                    this.type = MessageType.GEO
                    break;
                case "messageMediaGeoLive":
                    this.type = MessageType.GEO_LIVE
                    break;
                case "messageMediaVenue":
                    this.type = MessageType.VENUE;
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
                    for (const attr of attrs) {
                        if (attr._ === "documentAttributeSticker") {
                            this.type = MessageType.STICKER
                            break;
                        }
                        if (attr._ === "documentAttributeAnimated") {
                            this.type = MessageType.GIF
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
                        if (attr._ === "documentAttributeVideo") { //tl;dr do not add break here, of GIF's will be broken
                            if (attr.pFlags.round_message) {
                                this.type = MessageType.ROUND
                            } else {
                                this.type = MessageType.VIDEO
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

    fillRaw(rawMessage) {
        this._rawMessage = rawMessage
        this.parseMessageType()
    }
}