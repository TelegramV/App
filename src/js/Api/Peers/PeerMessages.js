import type {Message} from "../Messages/Message"
import {Peer} from "./Objects/Peer"
import {arrayDeleteCallback} from "../../Utils/array"
import {MessageFactory} from "../Messages/MessageFactory"
import API from "../Telegram/API"

export class PeerMessages {

    peer: Peer = undefined

    // id -> randomId
    _sendingMessages: Map<number, number> = new Map

    _unreadIds: Set<number> = new Set()
    _deletedIds: Set<number> = new Set()
    _unreadCount: number = 0

    _readOutboxMaxId: number = 0
    _readInboxMaxId: number = 0
    _unreadMentionsCount: number = 0

    _fireTransaction: boolean = false

    _heap: Map<number, Message> = new Map(); // refreshed when chat changed; do not ever access this directly
    _recent: Message[] = []; // newest first; each item may be duplicated in the `_heap`

    isDownloadingRecent = false;

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

        this.putRawMessages(messages)

        this._unreadCount = unreadCount || 0

        this._readOutboxMaxId = readOutboxMaxId || 0
        this._readInboxMaxId = readInboxMaxId || 0
        this._unreadMentionsCount = unreadMentionsCount || 0

        this._fireTransaction = false
    }

    getById = (id: number): Message => {
        let message = this._heap.get(id);

        if (!message) {
            message = this._recent.find(message => message.id === message);
        }

        return message;
    }

    fireRecent = (context = {}): void => {
        if (this.isDownloadingRecent) {
            return;
        }

        if (this._recent.length > 0) {
            this.peer.fire("messages.recent", {messages: this._recent});
            return;
        }

        API.messages.getHistory(this.peer, {limit: 100}).then(Messages => {
            this.isDownloadingRecent = false;

            this._recent = this.putRawMessages(Messages.messages);

            this.peer.fire("messages.recent", {
                messages: this._recent.slice(),
                context
            });
        });
    }

    downloadNextTopPage = (offsetId: number, context = {}) => {
        return API.messages.getHistory(this.peer, {
            offset_id: offsetId,
            limit: 100
        }).then(Messages => {
            const messages = this.putRawMessages(Messages.messages);

            this.peer.fire("messages.nextTopPageDownloaded", {
                messages: messages,
                context,
            });

            return messages;
        });
    }

    fireAllRecent = (context = {}) => {
        if (this.isDownloadingRecent) {
            return;
        }

        API.messages.getHistory(this.peer, {
            offset_id: this._recent[0].id,
            limit: 100 - this._recent.length,
            add_offset: 0,
        }).then(Messages => {
            this.isDownloadingRecent = false;
            const messages = this.putRawMessages(Messages.messages);

            console.log("AA", messages[0].id < messages[messages.length - 1].id)

            this._recent = [...this._recent, ...messages];

            this.peer.fire("messages.allRecent", {
                messages: messages.slice(),
                context,
            });
        });
    }

    downloadNextBottomPage = (offsetId: number, context = {}) => {
        return API.messages.getHistory(this.peer, {
            offset_id: offsetId,
            limit: 99,
            add_offset: -100
        }).then(Messages => {
            const messages = this.putRawMessages(Messages.messages);

            this.peer.fire("messages.nextBottomPageDownloaded", {
                messages: messages,
                context,
            });

            return messages;
        });
    }

    /**
     * Store a message.
     *
     * @param rawMessage
     * @return {Message}
     */
    putRawMessage = (rawMessage): Message => {
        const message = this._heap.get(rawMessage.id);

        if (message) {
            return message.fillRaw(rawMessage);
        }

        this._heap.set(rawMessage.id, MessageFactory.fromRaw(this.peer, rawMessage));

        return this._heap.get(rawMessage.id);
    }

    /**
     * Store messages.
     *
     * @return {Message}
     * @param rawMessages
     */
    putRawMessages = (rawMessages): Message[] => {
        return rawMessages.map(this.putRawMessage)
    }

    /**
     * Store new message.
     *
     * @param rawMessage
     * @return {Message}
     */
    putNewRawMessage = (rawMessage): Message => {
        const message = this.putRawMessage(rawMessage);

        if (this._recent.length > 0) {
            const newest = this._recent[this._recent.length - 1];

            if (newest.id < message.id) {
                this._recent.unshift(message);

                if (this._recent.length > 100) {
                    this._recent.pop();
                }

                if (message.isOut) {
                    this.clearUnread();
                }
            } else {
                // console.warn("BUG: putNewRawMessage got not newest message", newest.id, message.id);
            }
        } else {
            this._recent = [message];
        }

        return message;
    }

    getByGroupedId(groupedId: string): Array<Message> {
        return (
            [...this._heap.values()]
                .filter(l => l.groupedId === groupedId)
        )
    }

    getPollsById(poll_id: number): Array<Message> {
        return (
            [...this._heap.values()]
                .filter(msg => msg.raw.media && msg.raw.media.poll && msg.raw.media.poll.id === poll_id)
        )
    }

    get last(): Message | undefined {
        return this._recent[0];
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
     * @param {number} messageId
     */
    deleteSingle(messageId) {
        arrayDeleteCallback(this._recent, message => message.id === messageId);

        this._heap.delete(messageId)

        this.deleteUnread(messageId);

        if (!this.isTransaction) {
            this.peer.dialog.fire("deleteMessage", {
                messageId
            });
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
        this._heap.clear();
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