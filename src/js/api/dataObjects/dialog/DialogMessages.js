import AppSelectedPeer from "../../../ui/reactive/SelectedPeer"

/**
 * @property {Message} _lastMessage
 * @property {Map<number, Message>} _messages
 */
export class DialogMessages {

    /**
     * @type Dialog
     */
    _dialog = undefined

    /**
     * @type {Map<number, Message>}
     */
    _messages = new Map

    /**
     * @type {Message|undefined}
     * @private
     */
    _prevLastMessage = undefined

    /**
     * @type {Message|undefined}
     * @private
     */
    _lastMessage = undefined

    _sortedArray = []

    _alreadySorted = false

    _unreadIds

    _unreadCount
    _readOutboxMaxId
    _readInboxMaxId
    _unreadMentionsCount

    _fireTransaction = false

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

        this._sortedArray = []
        this._alreadySorted = false

        this._unreadIds = new Set()
        this._unreadCount = unreadCount || 0
        this._readOutboxMaxId = readOutboxMaxId || 0
        this._readInboxMaxId = readInboxMaxId || 0
        this._unreadMentionsCount = unreadMentionsCount

        this._fireTransaction = false
    }

    /**
     * @return {Map<number, Message>}
     */
    get data() {
        return this._messages
    }

    /**
     * @return {Message}
     */
    get last() {
        return this._lastMessage || this._prevLastMessage || this.sortedArray[this.sortedArray.length - 1]
    }

    /**
     * @param {Message} message
     */
    set last(message) {
        if (!this._lastMessage || message.date >= this._lastMessage.date) {
            this._prevLastMessage = this._lastMessage
            this._lastMessage = message
        }
    }

    /**
     * @return {Message}
     */
    get oldest() {
        return this.sortedArray[0]
    }

    /**
     * @return {Message[]}
     */
    get sortedArray() {
        if (!this._alreadySorted) {
            this._sortedArray = this._sortMessagesArray(Array.from(this._messages.values()))

            this._alreadySorted = true
        }

        return this._sortedArray
    }

    /**
     * @return {number}
     */
    get unreadCount() {
        return this._unreadCount + this._unreadIds.size
    }

    /**
     * @param {number} unreadCount
     */
    set unreadCount(unreadCount) {
        this._unreadCount = unreadCount

        if (!this.isTransaction) {
            this._dialog.fire("updateUnreadCount")
        }
    }

    /**
     * @return {number}
     */
    get unreadMentionsCount() {
        return this._unreadMentionsCount
    }

    /**
     * @param {number} unreadMentionsCount
     */
    set unreadMentionsCount(unreadMentionsCount) {
        this._unreadMentionsCount = unreadMentionsCount || this._unreadMentionsCount

        if (!this.isTransaction) {
            this._dialog.fire("updateUnreadMentionsCount")
        }
    }

    /**
     * @return {number}
     */
    get readOutboxMaxId() {
        return this._readOutboxMaxId
    }

    /**
     * @param {number} readOutboxMaxId
     */
    set readOutboxMaxId(readOutboxMaxId) {
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
     * @param {Message} message
     */
    appendSingle(message) {
        if (AppSelectedPeer.check(this._dialog.peer)) {
            this._messages.set(message.id, message)
            this._alreadySorted = false

            this.last = message
        } else {
            this.last = message
        }
    }

    /**
     * @param {number} messageId
     */
    deleteSingle(messageId) {
        this._messages.delete(messageId)
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