import AppSelectedPeer from "../../../ui/reactive/SelectedPeer"
import {Dialog} from "./Dialog"
import type {Message} from "../../messages/Message"

/**
 * @property {Message} _lastMessage
 * @property {Map<number, Message>} _messages
 */
export class DialogMessages {

    _dialog: Dialog = undefined

    _messages: Map<number, Message> = new Map
    _otherMessages: Map<number, Message> = new Map // replies etc.
    _sortedArray: Array<Message> = []
    _alreadySorted: boolean = false

    _prevLastMessage: Message = undefined
    _lastMessage: Message = undefined

    _unreadIds: Set<number> = new Set()
    _unreadCount: number = 0

    _readOutboxMaxId: number = 0
    _readInboxMaxId: number = 0
    _unreadMentionsCount: number = 0

    _fireTransaction: boolean = false

    /**
     * @param {Dialog} dialog
     * @param {Message[]} messages
     * @param unreadCount
     * @param unreadMark
     * @param unreadMentionsCount
     * @param readOutboxMaxId
     * @param readInboxMaxId
     */
    constructor(dialog, messages = [], {
        unreadCount = 0,
        unreadMentionsCount = 0,
        readOutboxMaxId = 0,
        readInboxMaxId = 0,
    } = {}) {
        this._dialog = dialog

        this.appendMany(messages)

        this._unreadIds = new Set()
        this._unreadCount = unreadCount || 0
        this._readOutboxMaxId = readOutboxMaxId || 0
        this._readInboxMaxId = readInboxMaxId || 0
        this._unreadMentionsCount = unreadMentionsCount || 0

        this._fireTransaction = false
    }

    get messages(): Map<number, Message> {
        return this._messages
    }

    get otherMessages(): Map<number, Message> {
        return this._otherMessages
    }

    get(id: number): Message | undefined {
        return this._messages.get(id) || this._otherMessages.get(id)
    }

    get last(): Message | undefined {
        return this._lastMessage || this._prevLastMessage || this.sortedArray[this.sortedArray.length - 1]
    }

    set last(message) {
        if (!this._lastMessage || message.date >= this._lastMessage.date) {
            this._prevLastMessage = this._lastMessage
            this._lastMessage = message
        }
    }

    get oldest(): Message | undefined {
        return this.sortedArray[0]
    }

    get sortedArray(): Array<Message> {
        if (!this._alreadySorted) {
            this._sortedArray = this._sortMessagesArray(Array.from(this._messages.values()))

            this._alreadySorted = true
        }

        return this._sortedArray
    }

    get unreadCount(): number {
        return this._unreadCount + this._unreadIds.size
    }

    set unreadCount(unreadCount: number) {
        this._unreadCount = unreadCount

        if (!this.isTransaction) {
            this._dialog.fire("updateUnreadCount")
        }
    }

    get unreadMentionsCount(): number {
        return this._unreadMentionsCount
    }

    set unreadMentionsCount(unreadMentionsCount: number) {
        this._unreadMentionsCount = unreadMentionsCount || this._unreadMentionsCount

        if (!this.isTransaction) {
            this._dialog.fire("updateUnreadMentionsCount")
        }
    }

    get readOutboxMaxId(): number {
        return this._readOutboxMaxId
    }

    /**
     * @param {number} readOutboxMaxId
     */
    set readOutboxMaxId(readOutboxMaxId: number) {
        this._readOutboxMaxId = readOutboxMaxId || this._readOutboxMaxId

        if (!this.isTransaction) {
            this._dialog.fire("updateReadOutboxMaxId")
        }
    }

    /**
     * @return {number}
     */
    get readInboxMaxId() {
        return this._readInboxMaxId
    }

    /**
     * @param {number} readInboxMaxId
     */
    set readInboxMaxId(readInboxMaxId) {
        this._readInboxMaxId = readInboxMaxId || this._readInboxMaxId

        if (!this.isTransaction) {
            this._dialog.fire("updateReadInboxMaxId")
        }
    }

    /**
     * @return {Set<number>}
     */
    get unreadMessagesIds() {
        return this._unreadIds
    }

    get isTransaction() {
        return this._fireTransaction
    }

    /**
     * @param {Message[]} messages
     */
    appendMany(messages) {
        if (messages.length === 0) {
            return
        }

        if (AppSelectedPeer.check(this._dialog.peer)) {
            for (const message of messages) {
                this.appendSingle(message)
            }
        } else {
            const sorted = this._sortMessagesArray(messages)
            this.last = sorted[sorted.length - 1]
        }
    }

    /**
     * @param {Message[]} messages
     */
    appendOtherMany(messages) {
        if (messages.length === 0) {
            return
        }

        for (const message of messages) {
            this.appendOtherSingle(message)
        }
    }

    /**
     * @param {Message} message
     */
    appendSingle(message: Message) {
        if (AppSelectedPeer.check(this._dialog.peer)) {
            this._messages.set(message.id, message)
            this._alreadySorted = false

            this.last = message
        } else {
            this._alreadySorted = false
            this.last = message
        }
    }

    /**
     * @param {Message} message
     */
    appendOtherSingle(message: Message) {
        this._otherMessages.set(message.id, message)
    }

    /**
     * @param {number} messageId
     */
    deleteSingle(messageId) {
        this._messages.delete(messageId)
        this._otherMessages.delete(messageId)
        this.deleteUnread(messageId)

        if (this.last && messageId === this.last.id) {
            this._lastMessage = this._prevLastMessage
            this._prevLastMessage = undefined
        }

        if (this._prevLastMessage && messageId === this._prevLastMessage.id) {
            this._lastMessage = undefined
        }

        if (!this.isTransaction) {
            this._dialog.fire("deleteMessage", {
                messageId
            })
        }
    }

    /**
     * @param {number} messageId
     */
    addUnread(messageId) {
        if (AppSelectedPeer.check(this._dialog.peer)) {
            this._unreadIds.add(messageId)
        } else {
            this._unreadCount++
        }

        if (!this.isTransaction) {
            this._dialog.fire("updateUnread")
        }
    }

    /**
     * @param {number} messageId
     */
    deleteUnread(messageId) {
        if (AppSelectedPeer.check(this._dialog.peer) || this.unreadMessagesIds.has(messageId)) {
            this._unreadIds.delete(messageId)
        } else {
            if (this._unreadCount > 0) {
                this._unreadCount--
            }
        }

        if (!this.isTransaction) {
            this._dialog.fire("updateUnread")
        }
    }

    /**
     * @param {number} maxMessageId
     */
    deleteUnreadBy(maxMessageId) {
        if (this.unreadMessagesIds.size === 0) {
            this.clearUnread()
        } else {
            this.startTransaction()
            this.unreadMessagesIds.forEach(messageId => {
                if (messageId <= maxMessageId) {
                    this.deleteUnread(messageId)
                }
            })
            this.stopTransaction()

            this._dialog.fire("updateUnread")
        }
    }

    clearUnread() {
        this.clearUnreadIds()
        this._unreadCount = 0

        if (!this.isTransaction) {
            this._dialog.fire("updateUnread")
        }
    }

    clearUnreadIds() {
        this._unreadIds.clear()
    }

    clear() {
        this._messages.clear()
        this._otherMessages.clear()
    }

    /**
     * @param {Message[]} messages
     * @private
     * @return {Message[]}
     */
    _sortMessagesArray(messages) {
        return messages.sort((a, b) => {
            if (a.date > b.date) {
                return 1
            } else if (a.date < b.date) {
                return -1
            } else {
                return 0
            }
        })
    }

    startTransaction() {
        this._fireTransaction = true
    }

    stopTransaction() {
        this._fireTransaction = false
    }

    fireTransaction(eventName = "updateSingle", data = {}) {
        this.stopTransaction()

        this._dialog.fire(eventName, data)

    }
}