import type {Message} from "../Messages/Message"
import {MessageType} from "../Messages/Message"
import {Peer} from "./Objects/Peer"
import {arrayDeleteCallback} from "../../Utils/array"
import {MessageFactory} from "../Messages/MessageFactory"
import API from "../Telegram/API"
import GroupMessage from "../Messages/GroupMessage"

// бля це треба переписати а мені так впадло(((((((((9(
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
    _groupsHeap: Map<number, GroupMessage> = new Map();
    _recent: Message[] = []; // newest first; each item may be duplicated in the `_heap`

    isDownloadingRecent = false;

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
            message = Array.from(this._groupsHeap.values())
                .flatMap(group => Array.from(group.messages))
                .find(message => message.id === id);
        }

        if (!message) {
            message = this._recent.find(message => message.id === id);
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
            offset_id: this._recent[this._recent.length - 1].id,
            limit: 100 - this._recent.length,
            add_offset: 0,
        }).then(Messages => {
            this.isDownloadingRecent = false;
            const messages = this.putRawMessages(Messages.messages);

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
        let message = this.getById(rawMessage.id);

        if (message) {
            message = message.fillRaw(rawMessage);

            if (message.groupedId) {
                return this._groupsHeap.get(message.groupedId);
            }

            return message;
        }

        message = MessageFactory.fromRaw(this.peer, rawMessage);

        if (message.groupedId) {
            let group = this._groupsHeap.get(message.groupedId);

            if (group) {
                group.add(message);
            } else {
                group = new GroupMessage(message);
                this._groupsHeap.set(message.groupedId, group);
            }

            return group;
        }

        this._heap.set(rawMessage.id, message);

        return this._heap.get(rawMessage.id);
    }

    /**
     * Store messages.
     *
     * @return {Message}
     * @param rawMessages
     */
    putRawMessages = (rawMessages): Message[] => {
        return [...new Set(rawMessages.map(this.putRawMessage))] // todo: find out better way
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
            let newest = this._recent[0];

            if (newest.id < message.id) {
                if (message.type !== MessageType.GROUP || message.messages.size <= 1) {
                    this._recent.unshift(message);

                    if (this._recent.length > 100) {
                        this._recent.pop();
                    }
                }

                if (message.isOut) {
                    this.clearUnread();
                } else {
                    this.addUnread(message.id)
                }
            } else {
                // console.warn("BUG: putNewRawMessage got not newest message", message.dialogPeer.name, newest.id, message.id);
                // return false;
            }
        } else {
            this._recent = [message];
        }

        return message;
    }

    getByGroupedId(groupedId: string): Set<Message> {
        const group = this._groupsHeap.get(groupedId);

        if (group) {
            return group.messages;
        }

        return null;
    }

    getPollsById(poll_id: number): Array<Message> {
        return (
            [...this._heap.values()]
                .filter(msg => msg.raw?.media?.poll?.id === poll_id)
        )
    }

    getGamesById(game_id: number): Array<Message> {
        return (
            [...this._heap.values()]
                .filter(msg => msg?.game?.id === game_id)
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

        if (this.peer.dialog) {
            this.peer.dialog.fire("updateUnread")
        }
    }

    get unreadMentionsCount(): number {
        return this._unreadMentionsCount
    }

    set unreadMentionsCount(unreadMentionsCount: number) {
        this._unreadMentionsCount = unreadMentionsCount || this._unreadMentionsCount

        if (this.peer.dialog) {
            if (this.peer.dialog) {
                this.peer.dialog.fire("updateUnreadMentionsCount")
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

    deleteSingle(messageId: number, markAsDeleted = true) {
        arrayDeleteCallback(this._recent, message => {
            if (message.id === messageId) {
                if (markAsDeleted) {
                    message.isDeleted = true;
                }

                return true;
            }

            return false;
        });

        this._heap.delete(messageId);
        this.deleteUnread(messageId);
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

        if (this.peer.dialog) {
            this.peer.dialog.fire("updateUnread")
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

        if (this.peer.dialog) {
            this.peer.dialog.fire("updateUnread")
        }
    }

    clearUnreadIds() {
        this._unreadIds.clear()
    }

    clear() {
        this._heap.clear();
    }

    /**
     * @deprecated we really should avoid this
     */
    startTransaction() {
        this._fireTransaction = true
    }

    /**
     * @deprecated we really should avoid this #2
     */
    stopTransaction() {
        this._fireTransaction = false
    }

    addUnread(id) {
        if (id > this.readInboxMaxId) {
            this.unreadMessagesIds.add(id)
        } else {
            this.unreadMessagesIds.delete(id)
        }
    }
}