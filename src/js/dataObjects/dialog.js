import {createLogger} from "../common/logger";
import MTProto from "../mtproto";
import {Message} from "./message";
import {tsNow} from "../mtproto/timeManager";
import {generateDialogIndex} from "../api/dialogs/messageIdManager";
import PeersManager from "../api/peers/peersManager";
import DialogsManager from "../api/dialogs/dialogsManager";
import {getPeerObject} from "./peerFactory";
import {UserPeer} from "./userPeer";

const Logger = createLogger(Dialog)

export class Dialog {
    constructor(dialog, peer, lastMessage) {
        this._dialog = dialog
        this._peer = peer
        this._lastMessage = new Message(this, lastMessage) // todo factory?
        // TODO move lastMessage to messages
        this._messages = {}
        this.messageActions = {}
        this._unreadMessageIds = new Set()
    }

    get dialog() {
        return this._dialog
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

    get pinned() {
        return this.dialog.pFlags.pinned || false
    }

    set pinned(pinned) {
        this.dialog.pFlags.pinned = pinned || false

        DialogsManager.resolveListeners({
            type: "updateSingle",
            dialog: this
        })
    }

    get messageAction() {
        return this.messageActions
    }

    get draft() {
        return this._dialog.draft && this._dialog.draft._ !== "draftMessageEmpty" ? this._dialog.draft.message : null
    }

    get notifySettings() {
        return this.dialog.notify_settings
    }

    get muted() {
        return this.notifySettings.mute_until >= tsNow(true)
    }

    get unreadCount() {
        return this._dialog.unread_count + this._unreadMessageIds.size
    }

    get unreadMark() {
        return this._dialog.pFlags.unread_mark
    }

    get unreadMentionsCount() {
        return this._dialog.unread_mentions_count
    }

    get readOutbox() {
        return this._dialog.read_outbox_max_id
    }

    get lastMessage() {
        return this._lastMessage
    }

    set lastMessage(lastMessage) {
        // TODO cause update?
        this._lastMessage = lastMessage

        if (lastMessage.from instanceof UserPeer) {
            this.removeMessageAction(lastMessage.from)
        }

        if (!lastMessage.isOut) {
            this._unreadMessageIds.add(lastMessage.id)
        }

        DialogsManager.resolveListeners({
            type: "updateSingle",
            dialog: this
        })
    }

    get index() {
        return generateDialogIndex(this.lastMessage.date)
    }

    get type() {
        return this.peer.type
    }

    clearUnreadCount() {
        this._unreadMessageIds.clear()
        this._dialog.unread_count = 0
        this._dialog.unread_mentions_count = 0
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

            DialogsManager.resolveListeners({
                type: "updateSingle",
                dialog: this
            })
        }
    }

    removeUnreadMessages(messages) {
        messages.forEach(mId => {
            if (this._unreadMessageIds.has(mId)) {
                this._unreadMessageIds.delete(mId)
            } else {
                this.decrementUnreadCountWithoutUpdate()
            }
        })

        DialogsManager.resolveListeners({
            type: "updateSingle",
            dialog: this
        })
    }

    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => {
            this.dialog.pFlags.pinned = l
        })
    }

    incrementUnreadCount() {
        ++this._dialog.unread_count

        DialogsManager.resolveListeners({
            type: "updateSingle",
            dialog: this
        })
    }

    incrementUnreadCountWithoutUpdate() {
        return ++this._dialog.unread_count
    }

    decrementUnreadCountWithoutUpdate() {
        return this._dialog.unread_count > 0 ? --this._dialog.unread_count : 0
    }

    handleUpdate(update) {

    }

    fetchInitialMessages() {
        return this.fetchMessages({}).then(messages => {
            if (messages.length > 0) {
                DialogsManager.resolveListeners({
                    type: "fetchedInitialMessages",
                    dialog: this,
                    messages: messages
                })
            }
        })
    }

    fetchNextPage() {
        let oldest = this._messages[Object.keys(this._messages)[0]]

        return this.fetchMessages({offset_id: oldest.id}).then(messages => {
            if (messages.length > 0) {
                DialogsManager.resolveListeners({
                    type: "fetchedMessagesNextPage",
                    dialog: this,
                    messages: messages
                })
            }
        })
    }

    /**
     * @param props
     * @return {Promise<Array<Message>>}
     */
    fetchMessages(props = {offset_id: 0, limit: 20}) {
        return MTProto.invokeMethod("messages.getHistory", {
            peer: this.peer.inputPeer,
            offset_id: props.offset_id,
            offset_date: 0,
            add_offset: 0,
            limit: props.limit || 20,
            max_id: 0,
            min_id: 0,
            hash: 0
        }).then(messagesSlice => {
            messagesSlice.chats.forEach(chat => {
                PeersManager.set(getPeerObject(chat))
            })

            messagesSlice.users.forEach(user => {
                PeersManager.set(getPeerObject(user))
            })

            return messagesSlice.messages.map(message => {
                const messageToPush = new Message(this, message)

                this._messages[messageToPush.id] = messageToPush

                return messageToPush
            })
        })
    }
}
