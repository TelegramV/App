import {getMessagePreviewDialog} from "../ui/utils";
import PeersManager from "../api/peers/peersManager";

export class Message {
    constructor(dialog, message) {
        this.dialog = dialog
        this._message = message
        this.type = "text"
        this.parseMessage()
    }

    get id() {
        return this._message.id
    }

    get text() {
        return this._message.message
    }

    get entities() {
        return this._message.entities
    }

    get from() {
        // TODO there's type of message when channel message is resent to chat
        // should check it!
        return !this._message.from_id ? PeersManager.findByPeer(this._message.to_id) : PeersManager.find("user", this._message.from_id)
    }

    get to() {
        return this._message.to_id // TODO get id from peerN object
    }

    get isOut() {
        return this._message.pFlags.out
    }

    get isRead() {
        return this.dialog.readOutbox >= this.id
    }

    get prefix() {
        const from = this.from
        if(from) {
            return from.peerName + getMessagePreviewDialog(this._message, true)
        } else {
            console.log(this._message)
            console.log(PeersManager.peers)
            return getMessagePreviewDialog(this._message, true)
        }
    }

    get date() {
        return this._message.date
    }

    getDate(locale, format) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }

    parseMessage() {
        const message = this._message

        if(message.media) {

        }
    }
}