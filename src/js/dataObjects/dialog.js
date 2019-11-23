import {FileAPI} from "../api/fileAPI";
import {createLogger} from "../common/logger";
import MTProto from "../mtproto";
import {Message} from "./message";
import {tsNow} from "../mtproto/timeManager";
import {generateDialogIndex} from "../api/dialogs/messageIdManager";
import {PeerAPI} from "../api/peerAPI";
import PeersManager from "../api/peers/peersManager";
import DialogsManager from "../api/dialogs/dialogsManager";
import {getPeerObject} from "./peerFactory";

const Logger = createLogger(Dialog)

export class Dialog {
    constructor(dialog, peer, lastMessage) {
        this._dialog = dialog
        this._peer = peer
        this._lastMessage = new Message(this, lastMessage) // todo factory?
        // TODO move lastMessage to messages
        this._messages = {}
        this.messageActions = {}
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

    get pinned() {
        return this.dialog.pFlags.pinned
    }

    get messageAction() {
        return this.messageActions
    }

    addMessageAction(user, action) {
        this.messageActions[user] = action
    }

    removeMessageAction(user) {
        delete this.messageActions[user]
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

    get type() {
        return this.peer.type
    }

    handleUpdate(update) {

    }

    fetchNextPage() {
        let oldest = this._messages[Object.keys(this._messages)[0]]

        return this.fetchMessages({offset_id: oldest.id})
    }

    fetchMessages(props = {offset_id: 0}) {
        return MTProto.invokeMethod("messages.getHistory", {
            peer: PeerAPI.getInput(this.peer.peer),
            offset_id: props.offset_id,
            offset_date: 0,
            add_offset: 0,
            limit: 20,
            max_id: 0,
            min_id: 0,
            hash: 0
        }).then(messagesSlice => {
            // __is_fetching = true
            // __fetching_for = {
            //     _: 0,
            //     id: 0
            // }
            messagesSlice.chats.forEach(chat => {
                PeersManager.set(getPeerObject(chat))
            })

            messagesSlice.users.forEach(user => {
                PeersManager.set(getPeerObject(user))
            })

            const messagesToPush = []

            messagesSlice.messages.forEach(message => {
                const messageToPush = new Message(this, message)

                messagesToPush.push(messageToPush)

                this._messages[messageToPush.id] = messageToPush

                /*if (message.media) {
                    fetchMessageMedia(message, peer)
                }*/
            })

            //$messages[peer._][peer.id].push(...messagesToPush)

            if (messagesSlice.messages.length > 0 || props.offset_id === 0) {
                DialogsManager.resolveListeners({
                    type: "updateManyMessages",
                    dialog: this,
                    messages: messagesToPush
                })
            }
        })
    }
}