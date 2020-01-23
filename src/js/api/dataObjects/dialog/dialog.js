import {Message} from "../messages/message";
import {tsNow} from "../../../mtproto/timeManager";
import {DialogMessages} from "./dialogMessages"
import AppEvents from "../../eventBus/appEvents"
import {DraftMessage} from "./draftMessage"
import {DialogAPI} from "./dialogApi"

export class Dialog {

    /**
     * @param {Object} rawDialog
     * @param {Peer} peer
     * @param {Message} topMessage
     */
    constructor(rawDialog, peer, topMessage) {
        this._rawDialog = rawDialog

        this._pinned = false
        this._unreadMark = false

        if (peer) {
            this._peer = peer
            this._peer.dialog = this
        } else {
            console.error("BUG: peer was not provided.")
        }

        this._pts = -1 // `-1` means that dialog was created manually.
        this._draft = DraftMessage.createEmpty(this)
        this._folderId = undefined

        this._messages = undefined

        if (topMessage) {
            if (topMessage instanceof Message) {
                topMessage.dialog = this
                this._messages = new DialogMessages(this, [topMessage])
            } else {
                console.error("BUG: invalid message was provided.")
            }
        } else {
            this._messages = new DialogMessages(this)
        }

        this._API = new DialogAPI(this)

        this.fillRaw(rawDialog)
    }

    /**
     * @return {DialogAPI}
     */
    get API() {
        return this._API
    }

    get pts() {
        return this._pts
    }

    set pts(pts) {
        this._pts = pts
    }

    get raw() {
        return this._rawDialog
    }

    /**
     * @return {DialogMessages}
     */
    get messages() {
        return this._messages
    }

    /**
     * @return {Peer}
     */
    get peer() {
        return this._peer
    }

    get isPinned() {
        return this._pinned
    }

    set pinned(pinned) {
        this._pinned = pinned || false

        AppEvents.Dialogs.fire("updatePinned", {
            dialog: this
        })
    }

    get messageAction() {
        return this.messageActions
    }

    /**
     * @return {DraftMessage}
     */
    get draft() {
        return this._draft
    }

    /**
     * @return {*}
     */
    get notifySettings() {
        return this.raw.notify_settings
    }

    /**
     * @return {boolean}
     */
    get isMuted() {
        return this.notifySettings.mute_until >= tsNow(true)
    }

    /**
     * @return {boolean}
     */
    get unreadMark() {
        return this._unreadMark
    }

    /**
     * @param {Peer} peer
     * @param {Message|undefined} lastMessage
     * @return {Dialog}
     */
    static createEmpty(peer, lastMessage = undefined) {
        return new Dialog({
            pFlags: {
                pinned: false,
                unread_mark: false,
            },
            pts: -1,
            unread_count: 0,
            read_inbox_max_id: 0,
            read_outbox_max_id: 0,
            unread_mentions_count: 0,
            notify_settings: {
                _: "peerNotifySettings",
                pFlags: {},
                flags: 0,
                show_previews: true,
                silent: false,
                mute_until: 0,
                sound: "default"
            },
        }, peer, lastMessage)
    }

    /**
     * @param rawDialog
     */
    fillRaw(rawDialog) {
        this._rawDialog = rawDialog
        this._pinned = rawDialog.pFlags && rawDialog.pFlags.pinned || false
        this._unreadMark = rawDialog.pFlags && rawDialog.pFlags.unread_mark || false
        this._folderId = rawDialog.folder_id || false

        if (!this._peer) {
            console.error("BUG: there is no peer connected to this dialog.", this)
        }

        this._pts = rawDialog.pts || -1

        this.messages.unreadCount = rawDialog.unread_count || 0
        this.messages.readInboxMaxId = rawDialog.read_inbox_max_id || 0
        this.messages.readOutboxMaxId = rawDialog.read_outbox_max_id || 0
        this.messages.unreadMentionsCount = rawDialog.unread_mentions_count || 0

        this._draft.fillRaw(this, rawDialog.draft)
    }

    /**
     * @param rawDialog
     */
    fillRawAndFire(rawDialog) {
        this.fillRaw(rawDialog)

        AppEvents.Dialogs.fire("updateSingle", {
            dialog: this
        })
    }
}
