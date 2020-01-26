import {tsNow} from "../../../mtproto/timeManager";
import {DialogMessages} from "./DialogMessages"
import AppEvents from "../../eventBus/AppEvents"
import {DraftMessage} from "./DraftMessage"
import {DialogApi} from "./DialogApi"
import {ReactiveObject} from "../../../ui/v/reactive/ReactiveObject"
import type {Message} from "../../messages/Message"

export class Dialog extends ReactiveObject {

    peer = undefined
    pts = -1

    #rawDialog = {}
    #pinned = false
    #unreadMark = false
    #draft = DraftMessage.createEmpty(this)
    #messages = undefined
    #folderId = undefined

    /**
     * @param {Object} rawDialog
     * @param {Peer} peer
     * @param {Message} topMessage
     */
    constructor(rawDialog, peer, topMessage: Message) {
        super()

        this.#rawDialog = rawDialog

        this.#pinned = false
        this.#unreadMark = false

        if (peer) {
            this.peer = peer
            this.peer.dialog = this
        } else {
            console.error("BUG: peer was not provided.")
        }

        if (topMessage) {
            topMessage.dialog = this
            this.#messages = new DialogMessages(this, [topMessage])
        } else {
            this.#messages = new DialogMessages(this)
        }

        this._api = new DialogApi(this)

        this.fillRaw(rawDialog)
    }

    /**
     * @return {DialogApi}
     */
    get api() {
        return this._api
    }

    get pts() {
        return this.pts
    }

    set pts(pts) {
        this.pts = pts
    }

    get raw() {
        return this.#rawDialog
    }

    /**
     * @return {DialogMessages}
     */
    get messages() {
        return this.#messages
    }

    get isPinned() {
        return this.#pinned
    }

    set pinned(pinned) {
        this.#pinned = pinned || false

        this.fire("updatePinned")
    }

    get messageAction() {
        return this.messageActions
    }

    /**
     * @return {DraftMessage}
     */
    get draft() {
        return this.#draft
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
        return this.#unreadMark
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
        this.#rawDialog = rawDialog
        this.#pinned = rawDialog.pFlags && rawDialog.pFlags.pinned || false
        this.#unreadMark = rawDialog.pFlags && rawDialog.pFlags.unread_mark || false
        this.#folderId = rawDialog.folder_id || false

        if (!this.peer) {
            console.error("BUG: there is no peer connected to this dialog.", this)
        }

        this.pts = rawDialog.pts || -1

        this.messages.unreadCount = rawDialog.unread_count || 0
        this.messages.readInboxMaxId = rawDialog.read_inbox_max_id || 0
        this.messages.readOutboxMaxId = rawDialog.read_outbox_max_id || 0
        this.messages.unreadMentionsCount = rawDialog.unread_mentions_count || 0

        this.#draft.fillRaw(this, rawDialog.draft)
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
