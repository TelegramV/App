import {UserPeer} from "../../../../../../api/peers/objects/UserPeer"
import {DialogTextFragment} from "./Fragments/DialogTextFragment"
import VF from "../../../../../v/VFramework"
import {DialogAvatarFragment} from "./Fragments/DialogAvatarFragment"
import {tsNow} from "../../../../../../mtproto/timeManager"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {dialogContextMenu} from "./ContextMenu/dialogContextMenu"
import {Dialog} from "../../../../../../api/dialogs/Dialog"
import VComponent from "../../../../../v/vrdom/component/VComponent"
import ArchivedDialogListComponent from "./Archived/ArchivedDialogListComponent"
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent"
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent"

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
        <BadgeFragment id={`dialog-${dialog.peer.id}-unreadMark`} show={dialog.unreadMark}> </BadgeFragment>
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
export class DialogComponent extends VComponent {

    dialog: Dialog

    Archived: ArchivedDialogListComponent
    Pinned: PinnedDialogListComponent
    General: GeneralDialogListComponent

    timeFragmentRef = VComponent.createFragmentRef()
    textFragmentRef = VComponent.createFragmentRef()
    avatarFragmentRef = VComponent.createFragmentRef()
    unreadCountFragmentRef = VComponent.createFragmentRef()
    unreadMentionsCountFragmentRef = VComponent.createFragmentRef()
    unreadMarkFragmentRef = VComponent.createFragmentRef()

    constructor(props) {
        super(props)

        this.identifier = `dialog-${this.props.dialog.peer.type}-${this.props.dialog.peer.id}`
    }

    init() {
        this.dialog = this.props.dialog

        this.callbacks = {
            selectedPeer: AppSelectedPeer.Reactive.FireOnly,
        }

        this._contextMenuListener = dialogContextMenu(this.dialog)
    }

    reactive(R) {
        R.object(this.dialog)
            .on("updateDraftMessage", this.onDialogUpdateDraftMessage)
            .on("readHistory", this.onDialogReadHistory)
            .on("updateUnreadCount", this.onDialogReadHistory)
            .on("updateUnread", this.onDialogReadHistory)
            .on("updateUnreadMark", this.onDialogUnreadMark)
            .on("updateReadInboxMaxId", this.onDialogReadHistory)
            .on("updateReadOutboxMaxId", this.onDialogReadHistory)
            .on("newMessage", this.onDialogNewMessage)
            .on("updateSingle", this.onDialogUpdateSingle)
            .on("updatePinned", this.onDialogUpdatePinned)
            .on("updateFolderId", this.onDialogUpdateFolderId)

        R.object(this.dialog.peer)
            .on("updatePhoto", this.onPeerUpdatePhoto)
            .on("updatePhotoSmall", this.onPeerUpdatePhoto)
            .on("updateUserStatus", this.onPeerUpdateUserStatus)
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

        if (dialog.peer.messages.last && dialog.peer.messages.last.isOut && !dialog.peer.isSelf) {
            personClasses["sent"] = true

            if (dialog.peer.messages.last.isRead) {
                personClasses["read"] = true
            }
        }

        return (
            <div data-message-id={dialog.peer.messages.last.id}
                 className={personClasses}

                 onClick={this._handleClick}
                 onContextMenu={this._contextMenuListener}>

                <DialogAvatarFragment ref={this.avatarFragmentRef}
                                      id={`dialog-${dialog.peer.id}-avatar`}
                                      peer={dialog.peer}/>

                <div className="content">

                    <div className="top">
                        <div className="title">
                            {peer.isSelf ? "Saved Messages" : peer.name}
                        </div>

                        <div className="status tgico"/>

                        <TimeFragment ref={this.timeFragmentRef} id={`dialog-${dialog.peer.id}-time`} dialog={dialog}/>
                    </div>

                    <div className="bottom">
                        <DialogTextFragment ref={this.textFragmentRef} id={`dialog-${dialog.peer.id}-text`}
                                            dialog={dialog}/>

                        <UnreadMentionsCountBadge ref={this.unreadMentionsCountFragmentRef} dialog={dialog}/>
                        <UnreadCountBadge ref={this.unreadCountFragmentRef} dialog={dialog}/>

                        <UnreadMarkBadge ref={this.unreadMarkFragmentRef} dialog={dialog}/>
                    </div>
                </div>
            </div>
        )
    }

    mounted() {
        this.Archived = VF.mountedComponents.get(`dialogs-archived-list`)
        this.Pinned = VF.mountedComponents.get(`dialogs-pinned-list`)
        this.General = VF.mountedComponents.get(`dialogs-general-list`)

        this.$el.__message = this.dialog.peer.messages.last
        this.$el.__pinned = this.dialog.pinned
        this.$el.__archived = this.dialog.isArchived
    }

    callbackChanged(key: string, value: *) {
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
            }
        }
    }

    onDialogNewMessage = _ => {
        this._patchMessageAndResort()
    }

    onDialogUpdateSingle = _ => {
        this._patchMessageAndResort()
    }

    onDialogUpdatePinned = _ => {
        this._patchMessageAndResort()
    }

    onDialogUpdateFolderId = _ => {
        this._patchMessageAndResort()
    }

    onDialogUpdateDraftMessage = _ => {
        this.textFragmentRef.patch()
    }

    onDialogReadHistory = _ => {
        this.unreadCountFragmentRef.patch()
        this.unreadMentionsCountFragmentRef.patch()
        this._patchReadStatus()
    }

    onDialogUnreadMark = _ => {
        this.unreadMarkFragmentRef.patch()
    }

    onPeerUpdatePhoto = _ => {
        this.avatarFragmentRef.patch()
    }

    onPeerUpdateUserStatus = _ => {
        this._patchStatus()
    }

    _patchActive = () => {
        if (AppSelectedPeer.check(this.dialog.peer)) {
            this.$el.classList.add("active")
        } else {
            this.$el.classList.remove("active")
        }
    }

    _patchStatus = () => {
        if (this.__.mounted) {
            if (this.dialog.peer.onlineStatus.online) {
                this.$el.classList.add("online")
            } else {
                this.$el.classList.remove("online")
            }
        }
    }

    _patchMessage = () => {
        if (this.__.mounted) {
            this.$el.__message = this.dialog.peer.messages.last
            this.$el.setAttribute("data-message-id", this.dialog.peer.messages.last.id)

            this._patchReadStatus()
            this.textFragmentRef.patch()
            this.timeFragmentRef.patch()
            this.unreadCountFragmentRef.patch()
            this.unreadMentionsCountFragmentRef.patch()
        }
    }

    _patchReadStatus = () => {
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

    _patchMessageAndResort = () => {
        if (this.dialog.pinned !== this.$el.__pinned) {

            if (this.dialog.isPinned) {
                this.Pinned.$el.prepend(this.$el)
            } else {
                const AppendList = this.dialog.isArchived ? this.Archived : this.General

                const $foundRendered = this._findRenderedDialogToInsertBefore(AppendList.$el)

                if ($foundRendered) {
                    AppendList.$el.insertBefore(this.$el, $foundRendered)
                } else {
                    this.__delete() // ...
                }
            }

            this.$el.__pinned = this.dialog.isPinned

        } else if (this.dialog.isArchived !== this.$el.__archived) {

            if (this.dialog.isArchived) {
                this.Archived.$el.prepend(this.$el)
            } else {
                const AppendList = this.dialog.isPinned ? this.Pinned : this.General

                const $foundRendered = this._findRenderedDialogToInsertBefore(AppendList.$el)

                if ($foundRendered) {
                    AppendList.$el.insertBefore(this.$el, $foundRendered)
                } else {
                    this.__delete() // ...
                }
            }

            this.$el.__archived = this.dialog.isArchived

        } else if (!this.dialog.peer.messages.last) {
            // todo: handle no last message
        } else if (this.$el.__message.date !== this.dialog.peer.messages.last.date) {
            if (!this.dialog.isPinned) {
                if (this.$el.previousSibling) {
                    if (this.dialog.isArchived) {
                        this.Archived.$el.prepend(this.$el)
                    } else {
                        this.General.$el.prepend(this.$el)
                    }
                }
            }
        }

        this._patchMessage()
    }

    /**
     * @return {ChildNode|Element|Node|undefined}
     * @private
     */
    _findRenderedDialogToInsertBefore = $dialogs => {
        const dialog = this.dialog
        const renderedDialogs = $dialogs.childNodes

        if (renderedDialogs.size === 0) {
            return undefined
        }

        const lastMessageDate = dialog.peer.messages.last.date

        for (const $rendered of renderedDialogs) {
            if ($rendered !== this.$el) {
                if (lastMessageDate >= $rendered.__message.date) {
                    return $rendered // todo: fix if dialog is last in the list
                }
            }
        }

        return undefined
    }

    _handleClick = () => {
        const p = this.dialog.peer.username ? `@${this.dialog.peer.username}` : `${this.dialog.peer.type}.${this.dialog.peer.id}`

        const act = this.$el.classList.contains("responsive-selected-chatlist") ? VF.router.replace : VF.router.push

        act("/", {
            queryParams: {
                p
            }
        })
    }
}
