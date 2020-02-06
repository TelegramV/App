import {UserPeer} from "../../../../../../api/peers/objects/UserPeer"
import {DialogTextComponent} from "./DialogTextComponent"
import V from "../../../../../v/VFramework"
import {DialogAvatarFragment} from "./DialogAvatarFragment"
import Component from "../../../../../v/vrdom/Component"
import {tsNow} from "../../../../../../mtproto/timeManager"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {dialogContextMenu} from "./dialogContextMenu"
import {Dialog} from "../../../../../../api/dialogs/Dialog"

const DATE_FORMAT_TIME = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}

const DATE_FORMAT = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
}

const patchAndResortDialogEventTypes = new Set([
    "newMessage",
    "updateSingle",
    "updatePinned"
])

const BadgeFragment = ({id, show = false, slot}) => {
    if (!show) {
        return (
            <div id={id} css-display="none" className="badge tgico"/>
        )
    }

    return (
        <div id={id} css-display="" className="badge tgico">
            {slot}
        </div>
    )
}

const UnreadCountBadge = ({dialog}) => {
    return (
        <BadgeFragment id={`dialog-${dialog.peer.id}-unreadCount`}
                       show={dialog.peer.messages.unreadCount > 0}>

            {dialog.peer.messages.unreadCount}
        </BadgeFragment>
    )
}

const UnreadMentionsCountBadge = ({dialog}) => {
    return (
        <BadgeFragment id={`dialog-${dialog.peer.id}-mentionCount`}
                       show={dialog.peer.messages.unreadMentionsCount > 0}>
            @
        </BadgeFragment>
    )
}

const UnreadMarkBadge = ({dialog}) => {
    return (
        <BadgeFragment id={`dialog-${dialog.peer.id}-unreadMark`} show={dialog.unreadMark}/>
    )
}

const TimeFragment = ({id, dialog}) => {
    return (
        <div id={id} className="time">
            {dialog.peer.messages.last.getDate("en", tsNow(true) - dialog.peer.messages.last.date > 86400 ? DATE_FORMAT : DATE_FORMAT_TIME)}
        </div>
    )
}

// NEVER CREATE THIS COMPONENT WITH THE SAME DIALOG
export class DialogComponent extends Component {

    dialog: Dialog

    $avatar: HTMLElement
    $text: HTMLElement
    $time: HTMLElement
    $unreadCount: HTMLElement

    init() {
        this.dialog = this.props.dialog

        this.reactive = {
            selectedPeer: AppSelectedPeer.Reactive.FireOnly,
            dialog: this.dialog,
            peer: this.dialog.peer
        }

        this._contextMenuListener = dialogContextMenu(this.dialog)
    }

    h() {
        const dialog = this.dialog
        const peer = dialog.peer

        const personClasses = {
            "person": true,
            "rp": true,
            "online": peer instanceof UserPeer && peer.onlineStatus.online,
            "active": AppSelectedPeer.check(dialog.peer),
            "unread": dialog.peer.messages.unreadMentionsCount > 0 || dialog.peer.messages.unreadCount > 0 || dialog.unreadMark,
            "muted": dialog.isMuted,
        }

        if (dialog.peer.messages.last.isOut && !dialog.peer.isSelf) {
            personClasses["sent"] = true

            if (dialog.peer.messages.last.isRead) {
                personClasses["read"] = true
            }
        }

        return (
            <div data-message-id={dialog.peer.messages.last.id}
                 data-date={dialog.peer.messages.last.date}
                 data-pinned={dialog.isPinned === undefined ? false : dialog.isPinned}

                 className={personClasses}

                 onClick={this._handleClick}
                 onContextMenu={this._contextMenuListener}>

                <DialogAvatarFragment id={`dialog-${dialog.peer.id}-avatar`}
                                      peer={dialog.peer}/>

                <div className="content">

                    <div className="top">
                        <div className="title">
                            {peer.isSelf ? "Saved Messages" : peer.name}
                        </div>

                        <div className="status tgico"/>

                        <TimeFragment id={`dialog-${dialog.peer.id}-time`} dialog={dialog}/>
                    </div>

                    <div className="bottom">
                        <DialogTextComponent id={`dialog-${dialog.peer.id}-text`} dialog={dialog}/>

                        <UnreadMentionsCountBadge dialog={dialog}/>
                        <UnreadCountBadge dialog={dialog}/>

                        <UnreadMarkBadge dialog={dialog}/>
                    </div>
                </div>
            </div>
        )
    }

    mounted() {
        this.$avatar = this.$el.querySelector(`#dialog-${this.dialog.peer.id}-avatar`)
        this.$text = this.$el.querySelector(`#dialog-${this.dialog.peer.id}-text`)
        this.$time = this.$el.querySelector(`#dialog-${this.dialog.peer.id}-time`)
        this.$unreadCount = this.$el.querySelector(`#dialog-${this.dialog.peer.id}-unreadCount`)
    }

    reactiveChanged(key, value, event) {

        if (this.__.mounted) {
            if (key === "selectedPeer") {

                if (value) {
                    this.$el.classList.add("responsive-selected-chatlist")
                } else {
                    this.$el.classList.remove("responsive-selected-chatlist")
                }

                if (value === this.dialog.peer || AppSelectedPeer.Previous === this.dialog.peer) {
                    this._patchActive()
                }

            } else if (key === "dialog") {

                if (patchAndResortDialogEventTypes.has(event.type)) {

                    this._patchMessageAndResort()

                } else {
                    switch (event.type) {
                        case "updateDraftMessage":
                            this._patchText()
                            break

                        case "readHistory":
                            this._patchUnreadCount()
                            break

                        case "updateUnreadCount":
                            this._patchUnreadCount()
                            break

                        case "updateUnread":
                            this._patchUnreadCount()
                            break

                        case "updateReadInboxMaxId":
                            this._patchUnreadCount()
                            this._patchReadStatus()
                            break

                        case "updateReadOutboxMaxId":
                            this._patchUnreadCount()
                            this._patchReadStatus()
                            break

                        default:
                            this.__patch()
                            break
                    }
                }

            } else if (key === "peer") {

                if (event.type === "updateUserStatus") {
                    this._patchStatus()
                } else if (event.type === "updatePhoto" || event.type === "updatePhotoSmall") {
                    this._patchAvatar()
                }

            }
        }
    }

    _patchActive() {
        if (AppSelectedPeer.check(this.dialog.peer)) {
            this.$el.classList.add("active")
        } else {
            this.$el.classList.remove("active")
        }
    }

    _patchStatus() {
        if (this.__.mounted) {
            if (this.reactive.peer.onlineStatus.online) {
                this.$el.classList.add("online")
            } else {
                this.$el.classList.remove("online")
            }
        }
    }

    _patchAvatar() {
        if (this.__.mounted) {
            VRDOM.patch(this.$avatar, <DialogAvatarFragment id={`dialog-${this.dialog.peer.id}-avatar`}
                                                            peer={this.dialog.peer}/>)
        }
    }

    _patchMessage() {
        if (this.__.mounted) {
            this.$el.setAttribute("data-date", this.dialog.peer.messages.last.date)
            this.$el.setAttribute("data-message-id", this.dialog.peer.messages.last.id)

            this._patchReadStatus()
            this._patchText()
            this._patchTime()
            this._patchUnreadCount()
        }
    }

    _patchText() {
        if (this.__.mounted) {
            VRDOM.patch(this.$text, <DialogTextComponent id={`dialog-${this.dialog.peer.id}-text`}
                                                         dialog={this.dialog}/>)
        }
    }

    _patchTime() {
        if (this.__.mounted) {
            VRDOM.patch(this.$time, <TimeFragment id={`dialog-${this.dialog.peer.id}-time`}
                                                  dialog={this.dialog}/>)
        }
    }

    _patchUnreadCount() {
        if (this.__.mounted) {
            VRDOM.patch(this.$unreadCount, <UnreadCountBadge dialog={this.dialog}/>)
        }
    }

    _patchReadStatus() {
        if (this.dialog.peer.messages.last.isOut && !this.dialog.peer.isSelf) {
            this.$el.classList.add("sent")

            if (this.dialog.peer.messages.last.isRead) {
                this.$el.classList.add("read")
            } else {
                this.$el.classList.remove("read")
            }
        } else {
            this.$el.classList.remove("sent")
            this.$el.classList.remove("read")
        }
    }

    _patchMessageAndResort() {
        if (String(this.dialog.isPinned) !== this.$el.dataset.pinned) {

            if (this.dialog.isPinned) {
                this.props.$pinned.prepend(this.$el)
            } else {
                const $foundRendered = this._findRenderedDialogToInsertBefore()

                if ($foundRendered) {
                    this.props.$general.insertBefore(this.$el, $foundRendered)
                } else {
                    this.__delete() // ...
                }
            }

            this.$el.setAttribute("data-pinned", this.dialog.isPinned === undefined ? false : this.dialog.isPinned)

        } else if (!this.dialog.peer.messages.last) {
            // todo: handle no last message
        } else if (parseInt(this.$el.getAttribute("data-date")) !== this.dialog.peer.messages.last.date) {
            if (!this.dialog.isPinned) {
                if (this.$el.previousSibling) {
                    this.props.$general.prepend(this.$el)
                }
            }
        }

        this._patchMessage()
    }

    /**
     * @return {ChildNode|Element|Node|undefined}
     * @private
     */
    _findRenderedDialogToInsertBefore() {
        const dialog = this.dialog
        const renderedDialogs = this.props.$general.childNodes

        if (renderedDialogs.size === 0) {
            return undefined
        }

        const lastMessageDate = dialog.peer.messages.last.date

        for (const $rendered of renderedDialogs) {
            if ($rendered !== this.$el) {
                if (lastMessageDate >= parseInt($rendered.getAttribute("data-date"))) {
                    return $rendered // todo: fix if dialog is last in the list
                }
            }
        }

        return undefined
    }

    _handleClick() {
        const p = this.dialog.peer.username ? `@${this.dialog.peer.username}` : `${this.dialog.peer.type}.${this.dialog.peer.id}`

        V.router.replace("/", {
            queryParams: {
                p
            }
        })
    }
}
