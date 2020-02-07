import AppEvents from "../eventBus/AppEvents"

const Bus = AppEvents.Dialogs

// we should use this thing everywhere, but it takes a time to rewrite whole application logic, so...
const DialogEvents = {
    bus: Bus,
    fire: Bus.fire,
    subscribe: Bus.subscribe,
    unsubscribe: Bus.unsubscribe,

    UNREAD_COUNT: 0,
    UNREAD_MARK: 1,
    UNREAD_MENTIONS_COUNT: 2,
    PINNED: 3,
    READ_INBOX_MAX_ID: 4,
    READ_OUTBOX_MAX_ID: 5,
    DELETED: 6,
    LEAVE: 7,
    NEW: 8,
    UPDATE_WHOLE: 8,

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