// @flow

import {Dialog} from "../dialogs/Dialog"
import {Message, MessageType} from "./Message"
import {ReactiveObject} from "../../ui/v/reactive/ReactiveObject"
import {MessageParser} from "./MessageParser"
import {Peer} from "../peers/objects/Peer"
import MessagesManager from "./MessagesManager"
import PeersStore from "../store/PeersStore"

export class AbstractMessage extends ReactiveObject implements Message {

    type = MessageType.UNSUPPORTED

    _dialog

    _to: Peer
    _from: Peer
    prefix: string
    replyToMessage: Message
    replyToMessageType: string
    forwarded: any
    forwardedType: string
    forwardedMessageId: number
    _group: Array<Message> | undefined
    _groupInitializer: boolean

    constructor(dialog: Dialog) {
        super()

        this._dialog = dialog
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
        if (this.raw.pFlags.out) {
            return true
        }

        return this.raw.from_id === PeersStore.self().id || this.raw.user_id === PeersStore.self().id
    }

    get replyMarkup(): any {
        return this.raw.reply_markup
    }

    get isPost(): boolean {
        return this.raw.pFlags.post || false
    }

    get isRead(): boolean {
        return this.dialog.peer.messages.readOutboxMaxId >= this.id || this.dialog.peer.messages.readInboxMaxId >= this.id
    }

    get text(): string {
        return this.raw.message || ""
    }

    get to(): Peer {
        if (this.dialog) {
            return this.dialog.peer
        }

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
            console.warn("no from peer")
        } else if (this._from.isMin && !this._from._min_messageId) {
            this._from.minData = {
                message: this,
                dialog: this.dialog
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

    getDate(locale: any, format: any) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }

    // always call super
    show() {
        this.findReplyTo()
        this.findForwarded()
    }

    get smallPreviewImage() {
        return null
    }

    get groupedId() {
        return this.raw.grouped_id
    }

    init() {
        this.findGrouped()
    }

    findGrouped(fire = true) {
        if (!this.groupedId) return
        if (this.groupedId && !this.group) {
            let hasInit = false
            this.group = this.dialog.peer.messages.getByGroupedId(this.groupedId)
            this.group.forEach(l => {
                l.group = this.group
                hasInit |= l.groupInitializer
            })
            this.groupInitializer = !hasInit
        } else if (this.groupedId) {
            this.group.find(l => l.groupInitializer).fire("updateGrouped")
        }
    }

    findReplyTo(fire = true) {
        if (this.replyToMessage && this.replyToMessageType && fire) {
            this.fire(this.replyToMessageType)
        }

        if (this.raw.reply_to_msg_id) {
            const replyToMessage = this.dialog.peer.messages.get(this.raw.reply_to_msg_id)

            if (replyToMessage) {
                this.replyToMessage = replyToMessage
                this.replyToMessageType = "replyToMessageFound"

                if (fire) {
                    this.fire("replyToMessageFound")
                }
            } else {
                this.dialog.peer.api.getHistory({
                    offset_id: this.raw.reply_to_msg_id, // ???
                    add_offset: -1,
                    limit: 1
                }).then(messages => {
                    if (messages.length && messages[0].id === this.raw.reply_to_msg_id) {
                        this.dialog.peer.messages.appendOtherSingle(messages[0])
                        this.replyToMessage = messages[0]
                        this.replyToMessageType = "replyToMessageFound"

                        if (fire) {
                            this.fire("replyToMessageFound")
                        }
                    } else {
                        this.replyToMessageType = "replyToMessageNotFound"

                        if (fire) {
                            this.fire("replyToMessageNotFound")
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
                    this.forwardedType = "forwardedNameOnlyFound"

                    if (fire) {
                        this.fire("forwardedNameOnlyFound")
                    }
                }
            } else {
                const forwarded = PeersStore.get("user", this.raw.fwd_from.from_id)

                if (forwarded) {
                    this.forwarded = forwarded
                    this.forwardedType = "forwardedUserFound"

                    if (fire) {
                        this.fire("forwardedUserFound")
                    }
                }
            }

            if (this.raw.fwd_from.channel_id) {
                const forwarded = PeersStore.get("channel", this.raw.fwd_from.channel_id)

                if (forwarded) {
                    this.forwarded = forwarded
                    this.forwardedMessageId = this.raw.fwd_from.channel_post
                    this.forwardedType = "forwardedChannelFound"

                    if (fire) {
                        this.fire("forwardedChannelFound")
                    }
                }
            }
        }
    }

    // WARNING: always call super
    fillRaw(raw: Object): Message {
        this.raw = raw
        this.prefix = MessageParser.getDialogPrefix(this)

        // reply
        const replyToMessage = this.dialog.peer.messages.get(this.raw.reply_to_msg_id)
        if (replyToMessage) {
            this.replyToMessage = replyToMessage
        }

        // forwarded
        this.findForwarded(false)

        // ...


        return this
    }

    fillRawAndFire(raw: Object): Message {
        this.fillRaw(raw)

        this.fire("rawFilled")

        return this
    }
}