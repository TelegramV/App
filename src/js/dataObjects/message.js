import {getMessagePreviewDialog} from "../ui/utils";

export class Message {
    constructor(dialog, message) {
        this.dialog = dialog
        this._message = message
    }

    get id() {
        return this._message.id
    }

    get text() {
        return this._message.message
    }

    get from() {
        return this._message.from_id
    }

    get to() {
        return this._message.to_id // TODO get id from peerN object
    }

    get isOut() {
        return this._message.pFlags.out
    }

    get isRead() {
        console.log(this.dialog, this.dialog.readOutbox, this.id, "isRead")
        return this.dialog.readOutbox >= this.id
    }

    get prefix() {
        return getMessagePreviewDialog(this._message, true)
    }

    get date() {
        return this._message.date
    }

    getDate(locale, format) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }
}