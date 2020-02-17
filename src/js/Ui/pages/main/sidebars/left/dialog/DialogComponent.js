import VF from "../../../../../../V/VFramework"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {dialogContextMenu} from "./ContextMenu/dialogContextMenu"
import {Dialog} from "../../../../../../Api/Dialogs/Dialog"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent"
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent"
import {DialogFragment} from "./Fragments/DialogFragment"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {VUI} from "../../../../../VUI"

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

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("hideDialogByPeer", this.onHideDialogByPeer)
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
            .on("editMessage", this.onDialogEditMessage)
            .on("updateSingle", this.onDialogUpdateSingle)
            .on("updatePinned", this.onDialogUpdatePinned)
            .on("updateFolderId", this.onDialogUpdateFolderId)
            .on("updateActions", this.onDialogUpdateActions)
            .on("refreshed", this.onDialogRefreshed)
            .on("deleted", this.onDialogDeleted)
            .on("deleteMessage", this.onDialogDeleteMessage)
            .on("deleteMessages", this.onDialogDeleteMessage)

        R.object(this.dialog.peer)
            .on("updatePhoto", this.onPeerUpdatePhoto)
            .on("updatePhotoSmall", this.onPeerUpdatePhoto)
            .on("updateUserStatus", this.onPeerUpdateUserStatus)
    }

    h() {
        return (
            <DialogFragment dialog={this.dialog}
                            click={this._handleClick}
                            contextMenu={this._contextMenuListener}
                            timeFragmentRef={this.timeFragmentRef}
                            textFragmentRef={this.textFragmentRef}
                            avatarFragmentRef={this.avatarFragmentRef}
                            unreadCountFragmentRef={this.unreadCountFragmentRef}
                            unreadMentionsCountFragmentRef={this.unreadMentionsCountFragmentRef}
                            unreadMarkFragmentRef={this.unreadMarkFragmentRef}
            />
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

    onDialogDeleteMessage = _ => {
        this._patchMessageAndResort()
    }

    onDialogUpdateActions = _ => {
        this.textFragmentRef.patch()
    }

    onDialogNewMessage = _ => {
        this._patchMessageAndResort()
    }

    onDialogEditMessage = event => {
        console.log("edited", event)
        if (event.message === this.dialog.messages.last) {
            this._patchMessage()
        }
    }

    onDialogRefreshed = _ => {
        this._patchMessageAndResort()
    }

    onDialogDeleted = _ => {
        this.__delete()
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

    onHideDialogByPeer = event => {
        if (event.peer === this.dialog.peer) {
            this.dialog.peer.dialog = undefined
            this.__delete()
        }
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
        if (!this.dialog.messages.last) {
            VUI.hideElement(this.$el)
            return
        } else {
            VUI.showElement(this.$el)
        }

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
        if (!this.dialog.messages.last) {
            VUI.hideElement(this.$el)
            return
        } else {
            VUI.showElement(this.$el)
        }


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
        if (!this.dialog.messages.last) {
            VUI.hideElement(this.$el)
            return
        } else {
            VUI.showElement(this.$el)
        }

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
        if (!this.dialog.messages.last) {
            return undefined
        }


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
        AppSelectedPeer.select(this.dialog.peer)

        // TODO this should be fixed!
        // const act = this.$el.classList.contains("responsive-selected-chatlist") ? VF.router.replace : VF.router.push

    }
}
