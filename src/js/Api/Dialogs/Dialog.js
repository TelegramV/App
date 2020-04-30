import {DraftMessage} from "./DraftMessage"
import {DialogApi} from "./DialogApi"
import {ReactiveObject} from "../../V/Reactive/ReactiveObject"
import {Peer} from "../Peers/Objects/Peer"
import PeersStore from "../Store/PeersStore"
import AppEvents from "../EventBus/AppEvents"
import {actionTypesMapping} from "../../Ui/Components/Sidebars/Left/Dialogs/Fragments/DialogTextFragment"
import DialogsManager from "./DialogsManager"
import MTProto from "../../MTProto/External"

export class Dialog extends ReactiveObject {

    eventBus = AppEvents.Dialogs
    eventObjectName = "dialog"

    _peer: Peer = undefined

    _rawDialog: Object = {}
    _draft: DraftMessage = DraftMessage.createEmpty(this)

    _actions: Map<Peer, Object> = new Map()

    constructor(rawDialog: Object) {
        super()

        this._rawDialog = rawDialog

        this._api = new DialogApi(this)

        this.fillRaw(rawDialog)
    }

    get messages() {
        return this.peer.messages
    }

    get actions() {
        return this._actions
    }

    addAction(rawUpdate) {
        if (rawUpdate.action._ === "sendMessageCancelAction") {
            this.clearActions()
        } else {
            const peer = PeersStore.get("user", rawUpdate.user_id)

            if (peer) {
                this._actions.set(peer, {
                    showUsername: peer !== this.peer,
                    text: actionTypesMapping[rawUpdate.action._],
                    time: MTProto.TimeManager.now(true)
                })
            }

            this.fire("updateActions")
        }
    }

    get actionText() {
        let typing = []
        let other = []

        const mapped = Array.from(this.actions.entries()).map(([peer, action]) => {
            const actionString = action.text

            if (peer && actionString) {
                if (action.showUsername) {
                    if (actionString === actionTypesMapping.sendMessageTypingAction) {
                        typing.push(peer.firstName)
                    } else {
                        other.push(peer.firstName)
                    }
                }

                return {
                    user: action.showUsername ? peer.firstName : "",
                    action: actionString
                }
            }

            return false
        })

        if (typing.length === 2 && other.length === 0) {
            return {
                user: `${typing[0]} and ${typing[1]} are typing`,
                action: ""
            }
        }

        if ((typing.length + other.length) >= 2) {
            return {
                user: `${typing.length + other.length} members are typing`,
                action: ""
            }
        }

        return mapped[0] || false
    }

    removeAction(peer) {
        this._actions.delete(peer)
        this.fire("updateActions")
    }

    clearActions() {
        this._actions.clear()
        this.fire("updateActions")
    }

    handleUpdateMessageID(id, randomId): void {
        return
        const msg = this.messages.get(id)
        if (msg) {
            msg.raw.random_id = randomId
        } else {
            this.peer.messages._sendingMessages.set(id, randomId)
        }
    }

    matchesFilter(f) {
        const dialog = this
        const include = f.include_peers
        const exclude = f.exclude_peers
        const peer = dialog.peer
        const isUser = peer.type === "user" && !peer.isBot
        const isContact = isUser && peer.isContact
        const isGroup = peer.type === "chat" || (peer.type === "channel" && peer.isSupergroup)
        const isChannel = peer.type === "channel" && !isGroup
        const isBot = peer.type === "user" && peer.isBot
        const isMuted = dialog.isMuted
        // TODO needs checking
        const isRead = dialog.peer.messages.unreadCount === 0 || !dialog.unreadMark
        const isArchived = dialog.isArchived

        if(include && include.some(l => {
            if(l._ === "inputPeerUser" && peer.type === "user" && peer.id === l.user_id) return true
            if(l._ === "inputPeerChannel" && peer.type === "channel" && peer.id === l.channel_id) return true
            if(l._ === "inputPeerChat" && peer.type === "chat" && peer.id === l.chat_id) return true
            if(l._ === "inputPeerSelf" && peer.type === "user" && peer.isSelf) return true
            return false
        })) {
            return true
        }

        if(exclude && include.some(l => {
            if(l._ === "inputPeerUser" && peer.type === "user" && peer.id === l.user_id) return true
            if(l._ === "inputPeerChannel" && peer.type === "channel" && peer.id === l.channel_id) return true
            if(l._ === "inputPeerChat" && peer.type === "chat" && peer.id === l.chat_id) return true
            if(l._ === "inputPeerSelf" && peer.type === "user" && peer.isSelf) return true
            return false
        })) {
            return false
        }

        if(!f.contacts && isContact) {
            return false
        }

        if(!f.non_contacts && !isContact && isUser) {
            return false
        }

        if(!f.groups && isGroup) {
            return false
        }

        if(!f.broadcasts && isChannel) {
            return false
        }

        if(!f.bots && isBot) {

            return false
        }

        if(f.exclude_muted && isMuted) {
            return false
        }

        if(f.exclude_read && isRead) {
            return false
        }

        if(f.exclude_archived && isArchived) {
            return false
        }

        return true
    }

    get peer(): Peer {
        if (!this._peer) {
            this._peer = PeersStore.getByPeerType(this.raw.peer)

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
        return this.raw.pinned || false
    }

    // alias for pinned
    get isPinned(): boolean {
        return this.pinned
    }

    set pinned(pinned: boolean) {
        this.raw.pinned = pinned || false

        this.fire("updatePinned")
    }

    get draft(): DraftMessage {
        return this._draft
    }

    get notifySettings(): Object {
        return this.raw.notify_settings
    }

    get isMuted(): boolean {
        return this.notifySettings.mute_until >= MTProto.TimeManager.now(true)
    }

    get unreadMark(): boolean {
        return this.raw.unread_mark || false
    }

    set unreadMark(unreadMark: boolean) {
        this.raw.unread_mark = unreadMark || false

        this.fire("updateUnreadMark")
    }

    get folderId() {
        return this.raw.folder_id || false
    }

    set folderId(folderId: boolean) {
        this.raw.folder_id = folderId || false

        this.fire("updateFolderId")
    }

    get isArchived() {
        return this.folderId === 1
    }

    get input() {
        return {
            _: "inputDialogPeer",
            peer: this.peer.inputPeer
        }
    }

    refresh() {
        return DialogsManager.getPeerDialogs(this.peer).then(dialogs => {
            if (dialogs.length === 0) {
                this.fire("deleted")
            } else {
                this.fire("refreshed")
            }
        })
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

        return this
    }
}
