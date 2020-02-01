import {tsNow} from "../../mtproto/timeManager";
import {DialogMessages} from "./DialogMessages"
import AppEvents from "../eventBus/AppEvents"
import {DraftMessage} from "./DraftMessage"
import {DialogApi} from "./DialogApi"
import {ReactiveObject} from "../../ui/v/reactive/ReactiveObject"
import type {Message} from "../messages/Message"
import {Peer} from "../dataObjects/peer/Peer"

export class Dialog extends ReactiveObject {

    pts: number = -1

    _peer: Peer = undefined

    _rawDialog: Object = {}
    _pinned: boolean = false
    _unreadMark: boolean = false
    _draft: DraftMessage = DraftMessage.createEmpty(this)
    _messages: DialogMessages = undefined
    _folderId: number = undefined

    constructor(rawDialog: Object, peer: Peer, topMessage: Message) {
        super()

        this._rawDialog = rawDialog

        this._pinned = false
        this._unreadMark = false

        if (peer) {
            this._peer = peer
            this._peer.dialog = this
        } else {
            console.error("BUG: peer was not provided.")
        }

        if (topMessage) {
            topMessage.dialog = this
            this._messages = new DialogMessages(this, [topMessage])
        } else {
            this._messages = new DialogMessages(this)
        }

        this._api = new DialogApi(this)

        this.fillRaw(rawDialog)
    }

    get peer(): Peer {
        return this._peer
    }

    set peer(peer: Peer) {
        this._peer = peer
    }

    get api(): DialogApi {
        return this._api
    }

    get raw(): Object {
        return this._rawDialog
    }

    get messages(): DialogMessages {
        return this._messages
    }

    get isPinned() {
        return this._pinned
    }

    set pinned(pinned) {
        this._pinned = pinned || false

        this.fire("updatePinned")
    }

    get draft(): DraftMessage {
        return this._draft
    }

    get notifySettings(): Object {
        return this.raw.notify_settings
    }

    get isMuted(): boolean {
        return this.notifySettings.mute_until >= tsNow(true)
    }

    get unreadMark(): boolean {
        return this._unreadMark
    }

    get input() {
        return {
            _: "inputDialogPeer",
            peer: this.peer.inputPeer
        }
    }

    get folderId() {
        return this._folderId
    }

    static createEmpty(peer: Peer, lastMessage: Message = undefined) {
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

    fillRaw(rawDialog: Object): Dialog {
        this._rawDialog = rawDialog
        this._pinned = rawDialog.pFlags && rawDialog.pFlags.pinned || false
        this._unreadMark = rawDialog.pFlags && rawDialog.pFlags.unread_mark || false
        this._folderId = rawDialog.folder_id || false

        if (!this._peer) {
            console.error("BUG: there is no peer connected to this dialog.", this)
        }

        this.pts = rawDialog.pts || -1

        this.messages.startTransaction()

        this.messages.unreadCount = rawDialog.unread_count || 0
        this.messages.readInboxMaxId = rawDialog.read_inbox_max_id || 0
        this.messages.readOutboxMaxId = rawDialog.read_outbox_max_id || 0
        this.messages.unreadMentionsCount = rawDialog.unread_mentions_count || 0

        this.messages.stopTransaction()

        this._draft.fillRaw(this, rawDialog.draft)

        return this
    }

    fillRawAndFire(rawDialog: Object): Dialog {
        this.fillRaw(rawDialog)

        this.fire("filled")

        AppEvents.Dialogs.fire("updateSingle", {
            dialog: this
        })

        return this
    }
}
