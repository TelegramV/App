import {getMessagePreviewDialog} from "../../ui/utils";
import MTProto from "../../mtproto"
import PeersStore from "../store/peersStore"
import {ChannelPeer} from "./peer/channelPeer";
import {UserPeer} from "./peer/userPeer";

export class Message {
    /**
     * @param {Dialog} dialog
     * @param message
     */
    constructor(dialog, message) {
        this.dialog = dialog
        this._message = message
        this.type = "text"
        this.parseMessage()
    }


    get isShort() {
        return this._message._ === "updateShortMessage"
    }

    get id() {
        return this._message.id
    }

    get text() {
        return this._message.message || ""
    }

    get entities() {
        return this._message.entities
    }

    get from() {
        // TODO there's type of message when channel message is resent to chat
        // should check it!

        if (this.isOut) {
            // todo: cache AuthorizedUse
            return PeersStore.get("user", MTProto.getAuthorizedUser().user.id)
        } else if (this.isShort) {
            return PeersStore.get("user", this._message.user_id)
        }

        return !this._message.from_id ? PeersStore.getFromDialogRawPeer(this._message.to_id) : PeersStore.get("user", this._message.from_id)
    }

    get to() {
        if (this._message.to_id && this._message.to_id._ === "peerChannel") {
            return PeersStore.get("channel", this._message.to_id.channel_id)
        }

        if (this._message.to_id && this._message.to_id._ === "peerUser") {
            return PeersStore.get("user", this._message.to_id.user_id)
        }

        return null
    }

    get isOut() {
        if (this._message.pFlags.out) {
            return true
        }

        return this._message.from_id === parseInt(MTProto.getAuthorizedUser().user.id)
    }

    get isPost() {
        return this._message.pFlags.post || false
    }

    get isRead() {
        return this.dialog.messages.readOutboxMaxId >= this.id
    }

    get prefix() {
        const from = this.from
        const hideSender = this.to instanceof ChannelPeer || (!this.isOut && this.to instanceof UserPeer)
        const sender = this.isOut ? "You" : from.name

        return getMessagePreviewDialog(this._message, sender, !hideSender)
    }

    get date() {
        return this._message.date
    }

    get raw() {
        return this._message
    }

    get media() {
        return this._message.media
    }

    getDate(locale, format) {
        return new Date(this.date * 1000).toLocaleString(locale, format)
    }

    parseMessage() {
        const message = this._message

        if (message.media) {

        }
    }
}