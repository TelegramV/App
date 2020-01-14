/**
 * @property {Map<number, Message>} _messages
 */
export class DialogMessages {

    /**
     * @param {Dialog} dialog
     * @param {Message[]} messages
     * @param unreadCount
     */
    constructor(dialog, messages = [], {
        unreadCount = 0
    } = {}) {
        this._dialog = dialog
        this._messages = new Map()

        this.appendMany(messages)

        this._sortedArray = []
        this._alreadySorted = false

        this._unreadIds = new Set()
        this._unreadCount = unreadCount || 0
    }

    /**
     * @return {Message}
     */
    get last() {
        return this.sortedArray[this.sortedArray.length - 1]
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
            this._sortedArray = Array.from(this._messages.values()).sort((a, b) => {
                if (a.date > b.date) {
                    return 1
                } else if (a.date < b.date) {
                    return -1
                } else {
                    return 0
                }
            })

            this._alreadySorted = true
        }

        return this._sortedArray
    }

    get unreadCount() {
        return this._unreadCount + this._unreadIds.size
    }

    set unreadCount(unreadCount) {
        this._unreadCount = unreadCount || this._unreadCount
    }

    get unreadMessagesIds() {
        return this._unreadIds
    }

    /**
     * @param {Message[]} messages
     */
    appendMany(messages) {
        for (const message of messages) {
            this.appendSingle(message)
        }
    }

    /**
     * @param {Message} message
     */
    appendSingle(message) {
        this._messages.set(message.id, message)
        this._alreadySorted = false
    }

    addUnread(messageId) {
        this._unreadIds.add(messageId)
    }

    deleteUnread(messageId) {
        this._unreadIds.delete(messageId)
    }

    clearUnread() {
        this.clearUnreadIds()
        this._unreadCount = 0
    }

    clearUnreadIds() {
        this._unreadIds.clear()
    }
}