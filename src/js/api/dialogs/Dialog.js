import {tsNow} from "../../mtproto/timeManager";
import {DraftMessage} from "./DraftMessage"
import {DialogApi} from "./DialogApi"
import {ReactiveObject} from "../../ui/v/reactive/ReactiveObject"
import {Peer} from "../peers/objects/Peer"
import PeersStore from "../store/PeersStore"
import DialogEvents from "./DialogEvents"

export class Dialog extends ReactiveObject {

    _peer: Peer = undefined

    _rawDialog: Object = {}
    _draft: DraftMessage = DraftMessage.createEmpty(this)

    constructor(rawDialog: Object) {
        super()

        this._rawDialog = rawDialog

        this._api = new DialogApi(this)

        this.fillRaw(rawDialog)
    }

    get messages() {
        return this.peer.messages
    }

    get peer(): Peer {
        if (!this._peer) {
            this._peer = PeersStore.getFromDialogRawPeer(this.raw.peer)

            if (this._peer) {
                this._peer.dialog = this
            }
        }

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

    get pts() {
        return this.raw.pts || -1
    }

    set pts(pts: number) {
        this.raw.pts = pts
    }

    get pinned(): boolean {
        return this.raw.pFlags.pinned || false
    }

    // alias for pinned
    get isPinned(): boolean {
        return this.pinned
    }

    set pinned(pinned: boolean) {
        this.raw.pFlags.pinned = pinned || false

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
        return this.raw.pFlags.unread_mark || false
    }

    set unreadMark(unreadMark: boolean) {
        this.raw.pFlags.unread_mark = unreadMark || false

        this.fire("updateUnreadMark")
    }

    get folderId() {
        return this.raw.folder_id || false
    }

    set folderId(folderId: boolean) {
        this.raw.folder_id = folderId || false

        this.fire("updateFolderId")
    }

    get input() {
        return {
            _: "inputDialogPeer",
            peer: this.peer.inputPeer
        }
    }

    fillRaw(rawDialog: Object): Dialog {
        this._rawDialog = rawDialog

        if (!this.peer) {
            console.error("BUG: there is no peer connected to this dialog.", this)
        }

        this.pts = rawDialog.pts || -1

        this.peer.messages.startTransaction()

        this.peer.messages.unreadCount = rawDialog.unread_count || 0
        this.peer.messages.readInboxMaxId = rawDialog.read_inbox_max_id || 0
        this.peer.messages.readOutboxMaxId = rawDialog.read_outbox_max_id || 0
        this.peer.messages.unreadMentionsCount = rawDialog.unread_mentions_count || 0

        this.peer.messages.stopTransaction()

        this._draft.fillRaw(this, rawDialog.draft)

        return this
    }

    fillRawAndFire(rawDialog: Object): Dialog {
        this.fillRaw(rawDialog)

        this.fire("filled")

        DialogEvents.fire("updateSingle", {
            dialog: this
        })

        return this
    }
}
