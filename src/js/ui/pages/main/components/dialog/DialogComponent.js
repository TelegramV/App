import {UserPeer} from "../../../../../api/dataObjects/peer/UserPeer"
import {DialogTextComponent} from "./DialogTextComponent"
import {AppFramework} from "../../../../framework/framework"
import {DialogAvatarComponent} from "./DialogAvatarComponent"
import Component from "../../../../framework/vrdom/component"
import AppEvents from "../../../../../api/eventBus/AppEvents"
import {tsNow} from "../../../../../mtproto/timeManager"
import {ContextMenuManager} from "../../../../contextMenuManager";
import {ChannelPeer} from "../../../../../api/dataObjects/peer/ChannelPeer";
import {GroupPeer} from "../../../../../api/dataObjects/peer/GroupPeer";
import {SupergroupPeer} from "../../../../../api/dataObjects/peer/SupergroupPeer";
import {ModalManager} from "../../../../modalManager";
import {FlatButtonComponent} from "../input/flatButtonComponent";
import AppSelectedPeer from "../../../../reactive/selectedPeer"

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


const patchAndResortEventTypes = new Set([
    "newMessage",
    "updateSingle",
    "updatePinned"
])

// NEVER CREATE THIS COMPONENT WITH THE SAME DIALOG
export class DialogComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            selectedPeer: AppSelectedPeer.Reactive.FireOnly
        }

        this.appEvents = new Set([
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "newMessage").FireOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateSingle").FireOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updatePinned").FireOnly,

            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateDraftMessage").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateReadHistoryInbox").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateReadHistoryOutbox").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "readHistory").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateUnreadCount").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateReadChannelInbox").PatchOnly,
            AppEvents.Dialogs.reactiveOnlySingle(this.props.dialog, "updateReadChannelOutbox").PatchOnly,

            AppEvents.Peers.reactiveOnlySingle(this.props.dialog.peer, "updatePhoto").PatchOnly,
            AppEvents.Peers.reactiveOnlySingle(this.props.dialog.peer, "updatePhotoSmall").PatchOnly,
            AppEvents.Peers.reactiveOnlySingle(this.props.dialog.peer, "updateUserStatus").PatchOnly,
        ])

    }

    h() {
        const dialog = this.props.dialog
        const peer = dialog.peer
        const unread = dialog.messages.unreadMentionsCount > 0 ? "@" : (dialog.messages.unreadCount > 0 ? dialog.messages.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

        const personClasses = {
            "person": true,
            "rp": true,
            "online": peer instanceof UserPeer && peer.onlineStatus.online,
            "active": AppSelectedPeer.check(dialog.peer),
            "unread": unread !== "",
            "muted": dialog.isMuted,
        }

        if (dialog.messages.last.isOut && !dialog.peer.isSelf) {
            personClasses["sent"] = true

            if (dialog.messages.last.isRead) {
                personClasses["read"] = true
            }
        }

        return (
            <div data-peer-username={dialog.peer.username} data-peer={`${dialog.peer.type}.${dialog.peer.id}`}
                 data-message-id={dialog.messages.last.id}
                 data-date={dialog.messages.last.date}
                 data-pinned={dialog.isPinned === undefined ? false : dialog.isPinned}
                 className={personClasses}
                 onClick={this._handleClick}
                 onContextMenu={ContextMenuManager.listener([
                     {
                         icon: "archive",
                         title: "Archive chat"
                     },
                     {
                         icon: dialog.isPinned ? "unpin" : "pin",
                         title: dialog.isPinned ? "Unpin from top" : "Pin to top"
                     },
                     {
                         icon: "info",
                         title: dialog.peer instanceof ChannelPeer ? "View channel info" : (dialog.peer instanceof GroupPeer || dialog.peer instanceof SupergroupPeer ? "View group info" : "View profile")
                     },
                     {
                         icon: dialog.isMuted ? "unmute" : "mute",
                         title: dialog.isMuted ? "Enable notifications" : "Disable notifications"
                     },
                     {
                         icon: unread !== "" ? "message" : "unread",
                         title: unread !== "" ? "Mark as read" : "Mark as unread",
                         onClick: _ => {
                             dialog.api.markDialogUnread(unread === "")
                         }
                     },
                     {
                         icon: "delete",
                         title: "Delete chat",
                         red: true,
                         onClick: _ => {
                             ModalManager.open(<div className="delete-chat-title">
                                     <DialogAvatarComponent dialog={dialog}/>
                                     Delete Chat?
                                 </div>,
                                 <div className="delete-chat-body">
                                     <span
                                         className="text">Are you sure you want to delete chat with <b>{dialog.peer.name}</b>?</span>
                                     <FlatButtonComponent red label={`Delete for me and ${dialog.peer.name}`}/>
                                     <FlatButtonComponent red label="Delete just for me"/>
                                     <FlatButtonComponent label="Cancel"/>
                                 </div>)
                         }
                     },
                 ])}>

                <DialogAvatarComponent dialog={dialog}/>

                <div className="content">
                    <div className="top">
                        <div className="title">{peer.isSelf ? "Saved Messages" : peer.name}</div>
                        <div className="status tgico"/>
                        <div
                            className="time">{dialog.messages.last.getDate("en", tsNow(true) - dialog.messages.last.date > 86400 ? DATE_FORMAT : DATE_FORMAT_TIME)}</div>
                    </div>

                    <div className="bottom">
                        <DialogTextComponent dialog={dialog}/>

                        <div css-display={dialog.messages.unreadMentionsCount === 0 ? "none" : ""}
                             className="badge tgico">@
                        </div>
                        <div
                            css-display={dialog.messages.unreadCount === 0 || dialog.messages.unreadMentionsCount > 0 ? "none" : ""}
                            className="badge tgico">{dialog.messages.unreadCount}</div>
                        <div css-display={!dialog.unreadMark ? "none" : ""} className="badge tgico"/>
                    </div>
                </div>
            </div>
        )
    }

    _handleClick() {
        const p = this.props.dialog.peer.username ? `@${this.props.dialog.peer.username}` : `${this.props.dialog.peer.type}.${this.props.dialog.peer.id}`

        AppFramework.Router.push("/", {
            queryParams: {
                p
            }
        })
    }

    mounted() {

    }

    reactiveChanged(key, value) {
        if (key === "selectedPeer") {

            if (value) {
                this.$el.classList.add("responsive-selected-chatlist")
            } else {
                this.$el.classList.remove("responsive-selected-chatlist")
            }

            if (value === this.props.dialog.peer || AppSelectedPeer.Previous === this.props.dialog.peer) {
                this.__patch()
            }

        }
    }

    _patchAndResort() {
        if (String(this.props.dialog.isPinned) !== this.$el.dataset.pinned) {

            if (this.props.dialog.isPinned) {
                this.props.$pinned.prepend(this.$el)
            } else {
                const $foundRendered = this._findRenderedDialogToInsertBefore()

                if ($foundRendered) {
                    this.props.$general.insertBefore(this.$el, $foundRendered)
                } else {
                    this.__delete() // ...
                }
            }

        } else if (!this.props.dialog.messages.last) {
            // todo: handle no last message
        } else if (parseInt(this.$el.dataset.date) !== this.props.dialog.messages.last.date) {
            if (!this.props.dialog.isPinned) {
                if (this.$el.previousSibling) {
                    this.props.$general.prepend(this.$el)
                }
            }
        }

        this.__patch()
    }

    eventFired(bus, event) {
        if (bus === AppEvents.Dialogs && patchAndResortEventTypes.has(event.type)) {
            this._patchAndResort()
        }
    }

    /**
     * @return {ChildNode|Element|Node|undefined}
     * @private
     */
    _findRenderedDialogToInsertBefore() {
        const dialog = this.props.dialog
        const renderedDialogs = this.props.$general.childNodes

        if (renderedDialogs.size === 0) {
            return undefined
        }

        const lastMessageDate = parseInt(dialog.messages.last.date)

        for (const $rendered of renderedDialogs) {
            if ($rendered !== this.$el) {
                if (lastMessageDate >= parseInt($rendered.dataset.date)) {
                    return $rendered // todo: fix if dialog is last in the list
                }
            }
        }

        return undefined
    }
}
