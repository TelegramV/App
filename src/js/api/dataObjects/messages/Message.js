import {getMessagePreviewDialog} from "../../../ui/utils"
import PeersStore from "../../store/PeersStore"
import MessagesManager from "../../messages/MessagesManager"
import {ReactiveObject} from "../../../ui/v/reactive/ReactiveObject"

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
    ANIMATED_EMOJI: 19
}

export class Message extends ReactiveObject {

    type = MessageType.TEXT
    dialog = undefined

    #rawMessage
    #fromPeer
    #toPeer

    /**
     * @param {Dialog} dialog
     * @param rawMessage
     */
    constructor(dialog, rawMessage) {
        super()

        this.dialog = dialog

        this.#rawMessage = rawMessage

        this.#fromPeer = null
        this.#toPeer = null

        this.fillRaw(rawMessage)
    }

    /**
     * @return {number}
     */
    get id() {
        return this.#rawMessage.id
    }

    /**
     * @return {string}
     */
    get text() {
        return this.#rawMessage.message || ""
    }

    /**
     * @return {*}
     */
    get entities() {
        return this.#rawMessage.entities
    }

    /**
     * @return {Peer}
     */
    get from() {
        if (this.#fromPeer) {
            return this.#fromPeer
        }

        // TODO there's type of message when channel message is resent to chat
        // should check it!

        this.#fromPeer = MessagesManager.getFromPeerMessage(this.raw)

        if (!this.#fromPeer) {
            console.warn("no from peer")
        }

        return this.#fromPeer
    }

    /**
     * @return {Peer}
     */
    get to() {
        if (this.#toPeer) {
            return this.#toPeer
        }

        if (this.dialog) {
            return this.#toPeer = this.dialog.peer
        }

        this.#toPeer = MessagesManager.getToPeerMessage(this.raw)

        return this.#toPeer
    }

    /**
     * @return {boolean}
     */
    get isOut() {
        if (this.#rawMessage.pFlags.out) {
            return true
        }

        return this.#rawMessage.from_id === PeersStore.self().id || this.#rawMessage.user_id === PeersStore.self().id
    }

    /**
     * @return {boolean}
     */
    get isPost() {
        return this.#rawMessage.pFlags.post || false
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

        return getMessagePreviewDialog(this, sender, showSender)
    }

    /**
     * @return {number}
     */
    get replyToMsgId() {
        return this.#rawMessage.reply_to_msg_id
    }

    /**
     * @return {*}
     */
    get viaBotId() {
        return this.#rawMessage.via_bot_id
    }

    /**
     * @return {*}
     */
    get fwdFrom() {
        return this.#rawMessage.fwd_from
    }

    /**
     * @return {number}
     */
    get isScheduled() {
        return this.#rawMessage.pFlags && this.#rawMessage.pFlags.from_scheduled
    }

    /**
     * @return {number}
     */
    get isSilent() {
        return this.#rawMessage.pFlags && this.#rawMessage.pFlags.silent
    }

    /**
     * @return {boolean}
     */
    get isEditHide() {
        return this.#rawMessage.pFlags && this.#rawMessage.pFlags.edit_hide
    }

    /**
     * @return {number}
     */
    get date() {
        return this.#rawMessage.date
    }

    /**
     * @return {*}
     */
    get raw() {
        return this.#rawMessage
    }

    /**
     * @return {*}
     */
    get media() {
        return this.#rawMessage.media
    }

    /**
     * @return {*}
     */
    get action() {
        return this.#rawMessage.action
    }

    /**
     * @return {*}
     */
    get views() {
        return this.#rawMessage.views
    }

    /**
     * @return {*}
     */
    get replyMarkup() {
        return this.#rawMessage.reply_markup
    }

    /**
     * @return {number|undefined}
     */
    get editDate() {
        return this.#rawMessage.edit_date
    }

    /**
     * @return {string|undefined}
     */
    get postAuthor() {
        return this.#rawMessage.post_author
    }

    /**
     * @return {number|undefined}
     */
    get groupedId() {
        return this.#rawMessage.grouped_id
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
                            if (media.isAnimatedEmoji) {
                                this.type = MessageType.ANIMATED_EMOJI
                            } else {
                                this.type = MessageType.STICKER
                            }
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
        } else {
            const l = StickerManager.getAnimatedEmoji(this.text)
            if (l) {
                this.raw.media = {
                    _: "messageMediaDocument",
                    isAnimatedEmoji: true,
                    document: l
                }
                this.parseMessageType()
                return
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
        this.#rawMessage = rawMessage
        this.parseMessageType()
    }
}