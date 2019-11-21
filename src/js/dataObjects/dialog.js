import {FileAPI} from "../api/fileAPI";
import {createLogger} from "../common/logger";
import MTProto from "../mtproto";
import {Message} from "./message";
import {tsNow} from "../mtproto/timeManager";
import {generateDialogIndex} from "../api/dialogs/messageIdManager";

const Logger = createLogger(Dialog)

export class Dialog {
    constructor(dialog, peer, lastMessage) {
        this._dialog = dialog
        this._peer = peer
        this._lastMessage = new Message(this, lastMessage) // todo factory?
        this._avatar = undefined
    }

    get dialog() {
        return this._dialog
    }
    get peer() {
        return this._peer
    }
    get id() {
        return this.peer.id
    }
    get username() {
        return this._peer.username || null
    }

    get pinned() {
        return this.dialog.pFlags.pinned
    }
    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => { this.dialog.pFlags.pinned = l })
    }

    get verified() {
        return this.dialog.pFlags.verified === true
    }

    get notifySettings() {
        return this.dialog.notify_settings
    }
    get muted() {
        return this.notifySettings.mute_until >= tsNow(true)
    }
    get unreadCount() {
        return this._dialog.unread_count
    }
    get unreadMark() {
        return this._dialog.pFlags.unreadMark
    }
    get unreadMentionsCount() {
        return this._dialog.unread_mentions_count
    }

    get readOutbox() {
        return this._dialog.read_outbox_max_id
    }

    set lastMessage(lastMessage) {
        // TODO cause update?
        this._lastMessage = lastMessage
    }

    get lastMessage() {
        return this._lastMessage
    }

    get index() {
        return generateDialogIndex(this.lastMessage.date)
    }

    get peerName() {
        return this.peer.title
    }

    get hasAvatar() {
        return this.peer.photo._ !== "chatPhotoEmpty"
    }

    get avatarLetter() {
        return {
            num: Math.abs(this.id) % 8,
            text: this.peerName[0]
        }
    }

    getAvatar(big = false) {
        if(this._avatar) return Promise.resolve(this._avatar)
        if(!this.hasAvatar) return Promise.resolve(null)

        // TODO cache
        return FileAPI.getPeerPhoto(big ? this.peer.photo.photo_big : this.peer.photo.photo_small, this.peer.photo.dc_id, this.peer, big).then(url => {
            return this._avatar = url
        }).catch(e => {
            Logger.error("Exception while loading avatar:", e)
        })
    }

    get type() {
        return this.constructor.name.toLowerCase().slice(0, -6)
    }

}