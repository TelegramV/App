import {Dialog} from "../Dialogs/Dialog"
import {Message, MessageType} from "./Message"
import {ReactiveObject} from "../../V/Reactive/ReactiveObject"
import {MessageParser} from "./MessageParser"
import {Peer} from "../Peers/Objects/Peer"
import MessagesManager from "./MessagesManager"
import PeersStore from "../Store/PeersStore"
import MTProto from "../../MTProto/External"
import API from "../Telegram/API"
import type {BusEvent} from "../EventBus/EventBus"
import AppEvents from "../EventBus/AppEvents"
import {parseMessageEntities} from "../../Utils/htmlHelpers"

export const DATE_FORMAT_TIME = {
    hour: '2-digit',
    minute: '2-digit',
    //hour12: false //support USA
}

export const DATE_FORMAT = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
}

export class AbstractMessage extends ReactiveObject implements Message {

    eventBus = AppEvents.Messages;

    type = MessageType.UNSUPPORTED;

    _dialog: Dialog;

    _to: Peer;
    _from: Peer;
    prefix: string;
    replyToMessage: Message;
    replyToMessageType: string;
    forwarded: any;
    forwardedType: string;
    forwardedMessageId: number;

    parsedText = "";

    _hideAvatar: boolean;
    _tailsGroup: string;

    constructor(dialogPeer: Peer) {
        super()

        if (dialogPeer) {
            this._to = dialogPeer
            this._dialog = dialogPeer.dialog
        }
    }

    init() {
    }

    get dialogPeer() {
        return this.to; // todo: fix this
    }

    get dialog() {
        if (!this._dialog) {
            this._dialog = MessagesManager.getToPeerMessage(this.raw).dialog
        }

        return this._dialog
    }

    set dialog(dialog) {
        this._dialog = dialog
    }

    get id(): number {
        return this.raw.id
    }

    get group() {
        return this._group
    }

    set group(value) {
        this._group = value
    }

    get groupInitializer() {
        return this._groupInitializer
    }

    set groupInitializer(value) {
        this._groupInitializer = value
    }

    get isOut(): boolean {
        if (this.raw.out) {
            return true
        }

        return this.raw.from_id === PeersStore.self().id || this.raw.user_id === PeersStore.self().id
    }

    get isDisplayedInMediaViewer(): boolean {
        return false
    }

    get isSending(): boolean {
        return !!this.raw.sending
    }

    get replyMarkup(): any {
        return this.raw.reply_markup
    }

    get isPost(): boolean {
        return this.raw.post || false
    }

    get isPinned(): boolean {
        return this.dialogPeer.pinnedMessageId === this.id
    }

    set isPinned(value) {
        this.dialogPeer.pinnedMessageId = value ? this.id : 0
    }

    get isRead(): boolean {
        if (!this.dialogPeer) {
            return false
        }

        return this.dialogPeer.messages.readOutboxMaxId >= this.id || (this.isOut && this.isPost)
    }

    get isInRead(): boolean {
        if (!this.dialogPeer) {
            return false
        }

        return this.isOut || this.dialogPeer.messages.readInboxMaxId >= this.id
    }

    get hideAvatar(): boolean {
        return this._hideAvatar;
    }

    set hideAvatar(value: boolean) {
        this._hideAvatar = value;
    }

    get tailsGroup(): string {
        return this._tailsGroup;
    }

    set tailsGroup(value: string) {
        this._tailsGroup = value;
    }

    get text(): string {
        return this.raw?.message ?? ""
    }

    get parsed() {
        return this.parsedText;
    }

    get to(): Peer {
        if (this._to) {
            return this._to
        }

        this._to = MessagesManager.getToPeerMessage(this.raw)

        return this._to
    }

    get from(): Peer {
        if (this._from) {
            return this._from
        }

        this._from = MessagesManager.getFromPeerMessage(this.raw)

        if (!this._from) {
            console.warn("no from peer", this)
        } else if (this._from.isMin && !this._from._min_messageId) {
            this._from.minData = {
                message: this,
                dialog: this.to
            }
            this._from._min_messageId = this.id
            this._from._min_inputPeer = this.to.inputPeer
        }

        return this._from
    }

    get date() {
        return this.raw.date
    }

    get editDate() {
        return this.raw.edit_date
    }

    get media(): Object {
        return this.raw.media
    }

    getDate(locale: any, format: any) {
        return this.jsDate.toLocaleString(locale, format)
    }

    formattedTime = null
    getFormattedTime() {
        return this.formattedTime
    }

    formattedDate = null
    getFormattedDate() {
        if(this.formattedDate === null) {
            this.formattedDate = this.getDate(navigator.language, DATE_FORMAT)
        }
        return this.formattedDate
    }

    getFormattedDateOrTime() {
        if(MTProto.TimeManager.now(true) - this.date > 86400) {
            return this.getFormattedDate()
        } else {
            return this.getFormattedTime()
        }
    }

    // always call super
    show() {
        this.findReplyTo()
        // this.findForwarded()
    }

    get groupedId() {
        return this.raw.grouped_id
    }

    findReplyTo(fire = true) {
        if (!this.dialogPeer) {
            return false
        }

        if (this.replyToMessage && this.replyToMessageType && fire) {
            this.fire(this.replyToMessageType)
        }

        if (this.raw.reply_to_msg_id) {
            const replyToMessage = this.dialogPeer.messages.getById(this.raw.reply_to_msg_id)

            if (replyToMessage) {
                this.replyToMessage = replyToMessage
                this.replyToMessageType = "replyFound"

                if (fire) {
                    this.fire("replyFound")
                }
            } else {
                API.messages.getHistory(this.dialogPeer, {
                    offset_id: this.raw.reply_to_msg_id, // ???
                    add_offset: -1,
                    limit: 1
                }).then(Messages => {
                    const messages = Messages.messages

                    if (messages.length && messages[0].id === this.raw.reply_to_msg_id) {
                        this.replyToMessage = this.dialogPeer.messages.putRawMessage(messages[0])
                        this.replyToMessageType = "replyFound"

                        if (fire) {
                            this.fire("replyFound")
                        }
                    } else {
                        this.replyToMessageType = "replyNotFound"

                        if (fire) {
                            this.fire("replyFound")
                        }
                    }
                })
            }
        }
    }

    findForwarded(fire = true) {
        if (this.forwarded && this.forwardedType && fire) {
            this.fire(this.forwardedType)

            return
        }

        if (this.raw.fwd_from) {
            if (!this.raw.fwd_from.from_id) {
                if (this.raw.fwd_from.from_name) {
                    this.forwarded = this.raw.fwd_from.from_name
                    this.forwardedType = "forwardedFound"

                    if (fire) {
                        this.fire("forwardedFound")
                    }
                }
            } else {
                const forwarded = PeersStore.get("user", this.raw.fwd_from.from_id)

                if (forwarded) {
                    this.forwarded = forwarded
                    this.forwardedType = "forwardedFound"

                    if (fire) {
                        this.fire("forwardedFound")
                    }
                }
            }

            if (this.raw.fwd_from.channel_id) {
                const forwarded = PeersStore.get("channel", this.raw.fwd_from.channel_id)

                if (forwarded) {
                    this.forwarded = forwarded
                    this.forwardedMessageId = this.raw.fwd_from.channel_post
                    this.forwardedType = "forwardedFound"

                    if (fire) {
                        this.fire("forwardedFound")
                    }
                }
            }
        }
    }

    read() {
        return this.dialogPeer.api.readHistory(this.id)
    }

    // WARNING: always call super
    fillRaw(raw: Object): Message {
        this.parsedText = parseMessageEntities(raw.message || "", raw.entities)

        this.raw = raw
        this.jsDate = new Date(this.raw.date * 1000)
        this.formattedTime = this.getDate(navigator.language, DATE_FORMAT_TIME)
        this.prefix = MessageParser.getDialogPrefix(this)

        if (this.dialogPeer) {
            const replyToMessage = this.dialogPeer.messages.getById(this.raw.reply_to_msg_id)

            if (replyToMessage) {
                this.replyToMessage = replyToMessage
            }

            this.findForwarded()
        }

        return this
    }

    fillEdited(raw: Object): Message {
        const message = this.fillRaw(raw)

        this.fire("edited")

        return message
    }

    fire(type: string, event: BusEvent = {}) {
        AppEvents.Peers.fire(`messages.${type}`, {
            peer: this.dialogPeer,
            message: this,
            ...event
        })

        super.fire(type, event)
    }
}

export default AbstractMessage