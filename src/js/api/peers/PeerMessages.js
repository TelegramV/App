import AppSelectedPeer from "../../ui/reactive/SelectedPeer"
import type {Message} from "../messages/Message"
import {Peer} from "./objects/Peer"

/**
 * @property {Message} _lastMessage
 * @property {Map<number, Message>} _messages
 */
export class PeerMessages {

    _peer: Peer = undefined

    _messages: Map<number, Message> = new Map
    // id -> randomId
    _sendingMessages: Map<number, number> = new Map
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
     * @param {Peer} peer
     * @param {Message[]} messages
     * @param unreadCount
     * @param unreadMark
     * @param unreadMentionsCount
     * @param readOutboxMaxId
     * @param readInboxMaxId
     */
    constructor(peer, messages = [], {
        unreadCount = 0,
        unreadMentionsCount = 0,
        readOutboxMaxId = 0,
        readInboxMaxId = 0,
    } = {}) {
        this._peer = peer

        this.appendMany(messages)

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

    getByGroupedId(groupedId: string): Array<Message> {
        return (
            [...this._messages.values()]
                .filter(l => l.groupedId === groupedId)
        )
    }

    getPollsById(poll_id: number): Array<Message> {
        return (
            [...this._messages.values()]
                .filter(msg => msg.raw.media && msg.raw.media.poll && msg.raw.media.poll.id === poll_id)
        )
    }

    get last(): Message | undefined {
        return this._lastMessage || this._prevLastMessage || this.sortedArray[this.sortedArray.length - 1]
    }

    set last(message) {
        if (!this._lastMessage || (message.date >= this._lastMessage.date && message.id > this._lastMessage.id)) {
            this._prevLastMessage = this._lastMessage
            this._lastMessage = message
        }

        if (!message.isOut) {
            this.readOutboxMaxId = message.id
        } else {
            this.readInboxMaxId = message.id
            this.readOutboxMaxId = message.id
        }
    }

    get oldest(): Message | undefined {
        return this.sortedArray[0]
    }

    get newest(): Message | undefined {
        return this.sortedArray[this.sortedArray.length - 1]
    }

    get sortedArray(): Array<Message> {
        if (!this._alreadySorted) {
            this._sortedArray = this._sortMessagesArray(Array.from(this._messages.values()))

            this._alreadySorted = true
        }

        return this._sortedArray
    }

    get unreadCount(): number {
        if (this.last) {
            if (this.last.isOut) {
                return 0
            }

            if (this.last.id >= this.readInboxMaxId) {
                return this.last.id - this.readInboxMaxId
            }
        }

        return 0
    }

    get unreadMentionsCount(): number {
        return this._unreadMentionsCount
    }

    set unreadMentionsCount(unreadMentionsCount: number) {
        this._unreadMentionsCount = unreadMentionsCount || this._unreadMentionsCount

        if (!this.isTransaction) {
            if (this._peer.dialog) {
                if (this._peer.dialog) {
                    this._peer.dialog.fire("updateUnreadMentionsCount")
                }
            }
        }
    }

    get readOutboxMaxId(): number {
        return this._readOutboxMaxId
    }

    /**
     * @param {number} readOutboxMaxId
     */
    set readOutboxMaxId(readOutboxMaxId: number) {
        if (this.readOutboxMaxId < readOutboxMaxId) {
            this._readOutboxMaxId = readOutboxMaxId || this._readOutboxMaxId

            if (!this.isTransaction) {
                if (this._peer.dialog) {
                    this._peer.dialog.fire("updateReadOutboxMaxId")
                }
            }
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
        if (this.readInboxMaxId < readInboxMaxId) {
            this._readInboxMaxId = readInboxMaxId || this._readInboxMaxId

            if (!this.isTransaction) {
                if (this._peer.dialog) {
                    this._peer.dialog.fire("updateReadInboxMaxId")
                }
            }
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

        if (AppSelectedPeer.check(this._peer)) {
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
     * @return boolean
     */
    appendSingle(message: Message) {
        if (AppSelectedPeer.check(this._peer)) {
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
            this._peer.dialog.fire("deleteMessage", {
                messageId
            })
        }
    }

    /**
     * @param {number} messageId
     */
    deleteUnread(messageId) {
        if (AppSelectedPeer.check(this._peer) || this.unreadMessagesIds.has(messageId)) {
            this._unreadIds.delete(messageId)
        } else {
            if (this._unreadCount > 0) {
                this._unreadCount--
            }
        }

        if (!this.isTransaction) {
            if (this._peer.dialog) {
                this._peer.dialog.fire("updateUnread")
            }
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

            if (this._peer.dialog) {
                this._peer.dialog.fire("updateUnread")
            }
        }
    }

    clearUnread() {
        this.clearUnreadIds()
        this._unreadCount = 0

        if (!this.isTransaction) {

            if (this._peer.dialog) {
                this._peer.dialog.fire("updateUnread")
            }
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

        this._peer.dialog.fire(eventName, data)

    }
}