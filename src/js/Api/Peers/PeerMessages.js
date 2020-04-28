import type {Message} from "../Messages/Message"
import {Peer} from "./Objects/Peer"
import {arrayDeleteCallback} from "../../Utils/array"
import {MessageFactory} from "../Messages/MessageFactory"
import AppSelectedChat from "../../Ui/Reactive/SelectedChat"
import __diffObjects from "../../V/VRDOM/component/__diffObjects"
import API from "../Telegram/API"

/**
 * @property {Message} _lastMessage
 * @property {Map<number, Message>} _messages
 */
export class PeerMessages {

    peer: Peer = undefined

    _messages: Map<number, Message> = new Map
    // id -> randomId
    _sendingMessages: Map<number, number> = new Map
    _otherMessages: Map<number, Message> = new Map // replies etc.
    _sortedArray: Array<Message> = []
    _alreadySorted: boolean = false

    _prevLastMessage: Message = undefined
    _lastMessage: Message = undefined

    _unreadIds: Set<number> = new Set()
    _deletedIds: Set<number> = new Set()
    _unreadCount: number = 0

    _readOutboxMaxId: number = 0
    _readInboxMaxId: number = 0
    _unreadMentionsCount: number = 0

    _fireTransaction: boolean = false

    //

    _heap: Map<number, Message> = new Map(); // refreshed when chat changed; do not ever access this directly
    _recent: Message[] = []; // length <= 60; oldest first; each item should be always duplicated in the `_heap`

    state = {
        unreadCount: 0,
        unreadMentionsCount: 0,
        readOutboxMaxId: 0,
        readInboxMaxId: 0,
    }

    setState(nextState) {
        if (__diffObjects(this._state, nextState)) {
            this.peer.fire("peer.updateDialogState", Object.assign(this._state, nextState));
        }
    }

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
        this.peer = peer

        this.appendMany(messages)

        this._unreadCount = unreadCount || 0

        this._readOutboxMaxId = readOutboxMaxId || 0
        this._readInboxMaxId = readInboxMaxId || 0
        this._unreadMentionsCount = unreadMentionsCount || 0

        this._fireTransaction = false
    }

    // fuck I will rewrite it later, I just can't anymore now

    get heap(): Map<number, Message> {
        return this._heap;
    }

    get next_newest(): Message | null {
        return this.recent[this.recent.length - 1];
    }

    get next_oldest(): Message | null {
        return this.recent[0];
    }

    getById(id: number): Message {
        let message = this.heap.get(id);

        if (!message) {
            message = this._recent.find(message => message.id === message);
        }

        return message;
    }

    getRecent(): Promise<Message[]> {
        if (this._recent.length > 0) {
            return Promise.resolve(this._recent);
        }

        return API.messages.getHistory(peer, {limit: 100}).then(Messages => {
            return this._recent = Messages.messages.map(rawMessage => this.putRawMessage(rawMessage));
        });
    }

    putRawMessage(rawMessage): Message {
        const message = this.heap.get(rawMessage.id);

        if (message) {
            return message.fillRaw(rawMessage);
        }

        this.heap.set(rawMessage.id, MessageFactory.fromRaw(this.peer, rawMessage));

        return this.heap.get(rawMessage.id);
    }

    putNewRawMessage(rawMessage): Message {
        const message = this.putRawMessage(rawMessage);

        if (this._recent.length > 0) {
            const newest = this._recent[this._recent.length - 1];

            if (newest.id < message.id) {
                this._recent.push(message);

                if (this._recent.length > 100) {

                }
            } else {
                console.error("BUG: putNewRawMessage got not newest message");
            }
        } else {
            this._recent = [message];
        }

        return message;
    }

    // below deprecated stuff

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

            if (message.isOut) {
                this.clearUnread()
            }
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
        return this._unreadCount + this.unreadMessagesIds.size
    }

    set unreadCount(unreadCount) {
        if (unreadCount < 0) {
            this._unreadCount = 0
            return
        }

        this._unreadCount = unreadCount
        this.clearUnreadIds()

        if (!this.isTransaction) {
            if (this.peer.dialog) {
                this.peer.dialog.fire("updateUnread")
            }
        }
    }

    get unreadMentionsCount(): number {
        return this._unreadMentionsCount
    }

    set unreadMentionsCount(unreadMentionsCount: number) {
        this._unreadMentionsCount = unreadMentionsCount || this._unreadMentionsCount

        if (!this.isTransaction) {
            if (this.peer.dialog) {
                if (this.peer.dialog) {
                    this.peer.dialog.fire("updateUnreadMentionsCount")
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
                if (this.peer.dialog) {
                    this.peer.dialog.fire("updateReadOutboxMaxId")
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
            this.deleteUnreadBy(readInboxMaxId)

            this._readInboxMaxId = readInboxMaxId || this._readInboxMaxId

            if (!this.isTransaction) {
                if (this.peer.dialog) {
                    this.peer.dialog.fire("updateReadInboxMaxId")
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
    appendMany(messages, addUnread) {
        if (messages.length === 0) {
            return
        }

        if (AppSelectedChat.check(this.peer)) {
            for (const message of messages) {
                this.appendSingle(message, addUnread)
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
     * @param addUnread
     * @return boolean
     */
    appendSingle(message: Message, addUnread = false) {
        if (AppSelectedChat.check(this.peer)) {
            this._messages.set(message.id, message)

            this._alreadySorted = false

            this.last = message
        } else {
            this._alreadySorted = false
            this.last = message
        }

        if (addUnread && !message.isOut) {
            this.addUnread(message.id)
        }
    }

    /**
     * @param {Object} rawMessage
     * @param addUnread
     * @return boolean
     */
    appendSingleFromRaw(rawMessage: Object, addUnread) {
        if (this.messages.has(rawMessage.id)) {
            return this.messages.get(rawMessage.id).fillRaw(rawMessage)
        } else {
            const message = MessageFactory.fromRaw(this.peer, rawMessage)
            this.appendSingle(message, addUnread)
            return message
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

        if (this._messages.has(messageId)) {
            if (arrayDeleteCallback(this._sortedArray, message => message.id === messageId)) {
                this._alreadySorted = false
            }
            this._messages.delete(messageId)
        }

        this._otherMessages.delete(messageId)
        this.deleteUnread(messageId)

        if (this.last && messageId === this.last.id) {
            this._lastMessage = this._prevLastMessage
            this._prevLastMessage = undefined
        }

        if (this._prevLastMessage && messageId === this._prevLastMessage.id) {
            this._lastMessage = undefined
            this._prevLastMessage = undefined
        }

        if (!this.isTransaction) {
            this.peer.dialog.fire("deleteMessage", {
                messageId
            })
        }
    }

    /**
     * @param {number} messageId
     */
    deleteUnread(messageId) {
        if (this._unreadIds.has(messageId)) {
            this._unreadIds.delete(messageId)
        } else {
            --(this._unreadCount)
        }

        if (!this.isTransaction) {
            if (this.peer.dialog) {
                this.peer.dialog.fire("updateUnread")
            }
        }
    }

    /**
     * @param {number} maxMessageId
     */
    deleteUnreadBy(maxMessageId) {
        this.startTransaction()

        if (this.last && maxMessageId === this.last.id) {
            this.clearUnread()
        } else {
            this.unreadMessagesIds.forEach(messageId => {
                if (messageId <= maxMessageId) {
                    this.deleteUnread(messageId)
                }
            })

            if (this.last && this.unreadCount > this.last.id - maxMessageId) {
                this.unreadCount = this.unreadCount - Math.abs(this.unreadCount - this.last.id - maxMessageId)
            }
        }

        this.stopTransaction()

        if (this.peer.dialog) {
            this.peer.dialog.fire("updateUnread")
        }
    }

    clearUnread() {
        this.clearUnreadIds()
        this._unreadCount = 0

        if (!this.isTransaction) {

            if (this.peer.dialog) {
                this.peer.dialog.fire("updateUnread")
            }
        }
    }

    clearUnreadIds() {
        this._unreadIds.clear()
    }

    clear() {
        this._messages.clear()
        this._otherMessages.clear()
        this._sortedArray = []
        this._alreadySorted = false
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

        this.peer.dialog.fire(eventName, data)

    }

    addUnread(id) {
        if (id > this.readInboxMaxId) {
            this.unreadMessagesIds.add(id)
        } else {
            this.unreadMessagesIds.delete(id)
        }
    }
}