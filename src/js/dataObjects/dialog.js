import MTProto from "../mtproto";
import {Message} from "./message";
import {tsNow} from "../mtproto/timeManager";
import {generateDialogIndex} from "../api/dialogs/messageIdManager";
import PeersManager from "../api/peers/peersManager";
import {getInputFromPeer, getInputPeerFromPeer} from "../api/dialogs/util"
import PeersStore from "../api/store/peersStore"
import {Peer} from "./peer/peer"
import {DialogMessages} from "./dialogMessages"
import AppEvents from "../api/eventBus/appEvents"
import {DraftMessage} from "./draftMessage"

/**
 * @property {Dialog} dialog
 */
class DialogAPI {

    /**
     * @param {Dialog} dialog
     */
    constructor(dialog) {
        this.dialog = dialog
    }

    /**
     * @param props
     * @return {Promise<Message[]>}
     */
    async getHistory(props = {offset_id: 0, limit: 20}) {
        const messagesSlice = await MTProto.invokeMethod("messages.getHistory", {
            peer: this.dialog.peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: 0,
            add_offset: 0,
            limit: props.limit || 20,
            max_id: 0,
            min_id: 0,
            hash: 0
        })

        messagesSlice.chats.forEach(chat => {
            PeersManager.setFromRawAndFire(chat)
        })

        messagesSlice.users.forEach(user => {
            PeersManager.setFromRawAndFire(user)
        })

        return messagesSlice.messages.map(rawMessage => {
            return new Message(this.dialog, rawMessage)
        })
    }


    fetchInitialMessages() {
        return this.getHistory({}).then(messages => {
            if (messages.length > 0) {
                this.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedInitialMessages", {
                    dialog: this.dialog,
                    messages: messages
                })
            }
        })
    }


    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => {
            this.pinned = l
        })
    }

    fetchNextPage() {
        let oldest = this.dialog.messages.oldest

        return this.getHistory({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
                this.dialog.messages.appendMany(messages)

                AppEvents.Dialogs.fire("fetchedMessagesNextPage", {
                    dialog: this.dialog,
                    messages: messages
                })
            }
        })
    }

    readAllHistory() {
        if (this.dialog.type === "channel") {
            return MTProto.invokeMethod("channels.readHistory", {
                channel: getInputFromPeer(this.dialog.type, this.dialog.peer.id, this.dialog.peer.peer.access_hash),
                max_id: this.dialog.messages.last.id
            }).then(response => {
                if (response._ === "boolTrue") {
                    this.dialog.messages.clearUnread()
                    AppEvents.Dialogs.fire("readHistory", {
                        dialog: this.dialog
                    })
                }
            })
        } else {
            return MTProto.invokeMethod("messages.readHistory", {
                peer: getInputPeerFromPeer(this.dialog.type, this.dialog.peer.id, this.dialog.peer.peer.access_hash),
                max_id: this.dialog.messages.last.id
            }).then(response => {
                this.dialog.messages.clearUnread()
                AppEvents.Dialogs.fire("readHistory", {
                    dialog: this.dialog
                })
            })
        }
    }
}

export class Dialog {

    /**
     * @param {Object} rawDialog
     * @param {Peer} peer
     * @param {Message} topMessage
     */
    constructor(rawDialog, {
        peer,
        topMessage
    }) {
        this._rawDialog = rawDialog

        this._pinned = false
        this._unreadMark = false

        if (peer) {
            if (peer instanceof Peer) {
                this._peer = peer
            } else {
                throw new Error("invalid peer")
            }
        } else {
            this._peer = undefined // lazy init
        }

        this._readInboxMaxId = -1
        this._readOutboxMaxId = -1
        this._unreadMentionsCount = 0
        this._pts = 0
        this._draft = DraftMessage.createEmpty(this)
        this._folderId = undefined

        if (topMessage) {
            if (topMessage instanceof Message) {
                topMessage.dialog = this
                this._messages = new DialogMessages(this, [topMessage])
            } else {
                throw new Error("invalid message")
            }
        } else {
            this._messages = new DialogMessages(this)
        }

        this._API = new DialogAPI(this)

        this.fillRaw(rawDialog)

        this._activeActions = new Map()

        this.messageActions = {}
    }

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

    get id() {
        return this.peer.id
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

    get draft() {
        return this._draft
    }

    get notifySettings() {
        return this.raw.notify_settings
    }

    get isMuted() {
        return this.notifySettings.mute_until >= tsNow(true)
    }

    get unreadMark() {
        return this._unreadMark
    }

    get unreadMentionsCount() {
        return this._unreadMentionsCount
    }

    get readOutbox() {
        return this._readOutboxMaxId
    }

    get index() {
        return generateDialogIndex(this.messages.last.date)
    }

    get type() {
        return this.peer.type
    }

    fillRaw(rawDialog) {
        this._pinned = rawDialog.pFlags.pinned || false
        this._unreadMark = rawDialog.pFlags.unread_mark || false
        if (!this._peer) {
            this._peer = PeersStore.getFromDialogRawPeer(rawDialog.peer) // handle not found
        }
        this._readInboxMaxId = rawDialog.read_inbox_max_id || -1
        this._readOutboxMaxId = rawDialog.read_outbox_max_id || -1
        this.messages.unreadCount = rawDialog.unread_count || 0
        this._unreadMentionsCount = rawDialog.unread_mentions_count || 0
        this._pts = rawDialog.pts || 0
        this._draft = new DraftMessage(this, rawDialog.draft)
    }


    fillRawAndFire(rawDialog) {
        this.fillRaw(rawDialog)

        AppEvents.Dialogs.fire("updateSingle", {
            dialog: this
        })
    }


    addMessageAction(user, action) {
        this.messageActions[user.id] = {
            action: action,
            expires: tsNow(true) + 6
        }
        setTimeout(l => {
            if (this.messageActions[user.id] && tsNow(true) >= this.messageActions[user.id].expires) {
                this.removeMessageAction(user)
            }
        }, 2000)
    }

    removeMessageAction(user) {
        if (this.messageActions[user.id]) {
            delete this.messageActions[user.id]

            AppEvents.Dialogs.fire("updateSingle", {
                dialog: this
            })
        }
    }
}
