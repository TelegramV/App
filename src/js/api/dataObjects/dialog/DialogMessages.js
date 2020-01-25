import AppSelectedPeer from "../../../ui/reactive/SelectedPeer"

/**
 * @property {Message} _lastMessage
 * @property {Map<number, Message>} #messages
 */
export class DialogMessages {

    /**
     * @type Dialog
     */
    #dialog = undefined

    /**
     * @type {Map<number, Message>}
     */
    #messages = new Map

    /**
     * @type {Message|undefined}
     * @private
     */
    #prevLastMessage = undefined

    /**
     * @type {Message|undefined}
     * @private
     */
    #lastMessage = undefined

    #sortedArray = []

    #alreadySorted = false

    #unreadIds

    #unreadCount
    #readOutboxMaxId
    #readInboxMaxId
    #unreadMentionsCount

    #fireTransaction = false

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
        this.#dialog = dialog

        this.appendMany(messages)

        this.#sortedArray = []
        this.#alreadySorted = false

        this.#unreadIds = new Set()
        this.#unreadCount = unreadCount || 0
        this.#readOutboxMaxId = readOutboxMaxId || 0
        this.#readInboxMaxId = readInboxMaxId || 0
        this.#unreadMentionsCount = unreadMentionsCount

        this.#fireTransaction = false
    }

    /**
     * @return {Map<number, Message>}
     */
    get data() {
        return this.#messages
    }

    /**
     * @return {Message}
     */
    get last() {
        return this.#lastMessage || this.#prevLastMessage || this.sortedArray[this.sortedArray.length - 1]
    }

    /**
     * @param {Message} message
     */
    set last(message) {
        if (!this.#lastMessage || message.date >= this.#lastMessage.date) {
            this.#prevLastMessage = this.#lastMessage
            this.#lastMessage = message
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
        if (!this.#alreadySorted) {
            this.#sortedArray = this._sortMessagesArray(Array.from(this.#messages.values()))

            this.#alreadySorted = true
        }

        return this.#sortedArray
    }

    /**
     * @return {number}
     */
    get unreadCount() {
        return this.#unreadCount + this.#unreadIds.size
    }

    /**
     * @param {number} unreadCount
     */
    set unreadCount(unreadCount) {
        this.#unreadCount = unreadCount

        if (!this.isTransaction) {
            this.#dialog.fire("updateUnreadCount")
        }
    }

    /**
     * @return {number}
     */
    get unreadMentionsCount() {
        return this.#unreadMentionsCount
    }

    /**
     * @param {number} unreadMentionsCount
     */
    set unreadMentionsCount(unreadMentionsCount) {
        this.#unreadMentionsCount = unreadMentionsCount || this.#unreadMentionsCount

        if (!this.isTransaction) {
            this.#dialog.fire("updateUnreadMentionsCount")
        }
    }

    /**
     * @return {number}
     */
    get readOutboxMaxId() {
        return this.#readOutboxMaxId
    }

    /**
     * @param {number} readOutboxMaxId
     */
    set readOutboxMaxId(readOutboxMaxId) {
        this.#readOutboxMaxId = readOutboxMaxId || this.#readOutboxMaxId

        if (!this.isTransaction) {
            this.#dialog.fire("updateReadOutboxMaxId")
        }
    }

    /**
     * @return {number}
     */
    get readInboxMaxId() {
        return this.#readInboxMaxId
    }

    /**
     * @param {number} readInboxMaxId
     */
    set readInboxMaxId(readInboxMaxId) {
        this.#readInboxMaxId = readInboxMaxId || this.#readInboxMaxId

        if (!this.isTransaction) {
            this.#dialog.fire("updateReadInboxMaxId")
        }
    }

    /**
     * @return {Set<number>}
     */
    get unreadMessagesIds() {
        return this.#unreadIds
    }

    get isTransaction() {
        return this.#fireTransaction
    }

    /**
     * @param {Message[]} messages
     */
    appendMany(messages) {
        if (messages.length === 0) {
            return
        }

        if (AppSelectedPeer.check(this.#dialog.peer)) {
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
        if (AppSelectedPeer.check(this.#dialog.peer)) {
            this.#messages.set(message.id, message)
            this.#alreadySorted = false

            this.last = message
        } else {
            this.last = message
        }
    }

    /**
     * @param {number} messageId
     */
    deleteSingle(messageId) {
        this.#messages.delete(messageId)
        this.deleteUnread(messageId)

        if (this.last && messageId === this.last.id) {
            this.#lastMessage = this.#prevLastMessage
            this.#prevLastMessage = undefined
        }

        if (this.#prevLastMessage && messageId === this.#prevLastMessage.id) {
            this.#lastMessage = undefined
        }

        if (!this.isTransaction) {
            this.#dialog.fire("deleteMessage", {
                messageId
            })
        }
    }

    /**
     * @param {number} messageId
     */
    addUnread(messageId) {
        if (AppSelectedPeer.check(this.#dialog.peer)) {
            this.#unreadIds.add(messageId)
        } else {
            this.#unreadCount++
        }

        if (!this.isTransaction) {
            this.#dialog.fire("updateUnread")
        }
    }

    /**
     * @param {number} messageId
     */
    deleteUnread(messageId) {
        if (AppSelectedPeer.check(this.#dialog.peer) || this.unreadMessagesIds.has(messageId)) {
            this.#unreadIds.delete(messageId)
        } else {
            if (this.#unreadCount > 0) {
                this.#unreadCount--
            }
        }

        if (!this.isTransaction) {
            this.#dialog.fire("updateUnread")
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

            this.#dialog.fire("updateUnread")
        }
    }

    clearUnread() {
        this.clearUnreadIds()
        this.#unreadCount = 0

        if (!this.isTransaction) {
            this.#dialog.fire("updateUnread")
        }
    }

    clearUnreadIds() {
        this.#unreadIds.clear()
    }

    clear() {
        this.#messages.clear()
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
        this.#fireTransaction = true
    }

    stopTransaction() {
        this.#fireTransaction = false
    }

    fireTransaction(eventName = "updateSingle", data = {}) {
        this.stopTransaction()

        this.#dialog.fire(eventName, data)

    }
}