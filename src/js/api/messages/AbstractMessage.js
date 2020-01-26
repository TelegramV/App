// @flow

import type {MessageConstructor} from "../../mtproto/language/types"
import {Dialog} from "../dataObjects/dialog/Dialog"
import {Message, MessageType} from "./Message"
import {ReactiveObject} from "../../ui/v/reactive/ReactiveObject"
import {MessageParser} from "./MessageParser"
import {Peer} from "../dataObjects/peer/Peer"
import MessagesManager from "./MessagesManager"
import PeersStore from "../store/PeersStore"

export class AbstractMessage extends ReactiveObject implements Message {

    type = MessageType.UNSUPPORTED

    #to: Peer
    #from: Peer

    constructor(dialog: Dialog, raw: MessageConstructor) {
        super()

        this.dialog = dialog

        this.fillRaw(raw)
    }

    get id(): number {
        return this.raw.id
    }

    get isOut(): boolean {
        if (this.raw.pFlags.out) {
            return true
        }

        return this.raw.from_id === PeersStore.self().id || this.raw.user_id === PeersStore.self().id
    }

    get isPost(): boolean {
        return this.raw.pFlags.post || false
    }

    get isRead(): boolean {
        return this.dialog.messages.readOutboxMaxId >= this.id || this.dialog.messages.readInboxMaxId >= this.id
    }

    get text(): string {
        return this.raw.message || ""
    }

    get to(): Peer {
        if (this.dialog) {
            return this.dialog.peer
        }

        if (this.#to) {
            return this.#to
        }

        this.#to = MessagesManager.getToPeerMessage(this.raw)

        return this.#to
    }

    get from(): Peer {
        if (this.#from) {
            return this.#from
        }

        this.#from = MessagesManager.getFromPeerMessage(this.raw)

        if (!this.#from) {
            console.warn("no from peer")
        }

        return this.#from
    }

    get date() {
        return this.raw.date
    }

    getDate(locale: any, format: any) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }

    show() {
        console.warn("unimplemented show method")
    }

    // WARNING: always call super
    fillRaw(raw: MessageConstructor) {
        this.raw = raw
        this.prefix = MessageParser.getDialogPrefix(this)
    }

    fillRawAndFire(raw: MessageConstructor) {
        this.fillRaw(raw)
        
        this.fire("rawFilled")
    }
}