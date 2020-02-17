import AppEvents from "../EventBus/AppEvents"

const Bus = AppEvents.Dialogs

// we should use this thing everywhere, but it takes a time to rewrite whole application logic, so...
const DialogEvents = {
    bus: Bus,
    fire: Bus.fire,
    subscribe: Bus.subscribe,
    unsubscribe: Bus.unsubscribe,

    UNREAD_COUNT: "unreadCount",
    UNREAD_MARK: "unreadMark",
    UNREAD_MENTIONS_COUNT: "unreadMentionsCount",
    PINNED: "pinned",
    READ_INBOX_MAX_ID: "readInboxMaxId",
    READ_OUTBOX_MAX_ID: "readOutboxMaxId",
    DELETED: "deleted",
    LEAVE: "leave",
    UPDATE_WHOLE: 8,

    GOT_NEW: "gotNew",
    GOT_NEW_MANY: "gotNewMany",
    GOT_MANY: "gotMany",

    onUnreadCount: subscription => this.subscribe(this.UNREAD_COUNT, subscription),
    onUnreadMark: subscription => this.subscribe(this.UNREAD_MARK, subscription),
    onUnreadMentionsCount: subscription => this.subscribe(this.UNREAD_MENTIONS_COUNT, subscription),
    onPinned: subscription => this.subscribe(this.PINNED, subscription),
    onReadInboxMaxId: subscription => this.subscribe(this.READ_INBOX_MAX_ID, subscription),
    onReadOutboxMaxId: subscription => this.subscribe(this.READ_OUTBOX_MAX_ID, subscription),
    onDeleted: subscription => this.subscribe(this.DELETED, subscription),
    onLeave: subscription => this.subscribe(this.LEAVE, subscription),
    onNew: subscription => this.subscribe(this.NEW, subscription),
    onUpdateWhole: subscription => this.subscribe(this.UPDATE_WHOLE, subscription),
}

export default DialogEvents