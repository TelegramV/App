import AppSelectedChat from "../../../../Reactive/SelectedChat"
import {dialogContextMenu} from "./dialogContextMenu"
import {Dialog} from "../../../../../Api/Dialogs/Dialog"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent"
import GeneralDialogListComponent from "./Lists/GeneralDialogListComponent"
import {DialogFragment} from "./Fragments/DialogFragment"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import UIEvents from "../../../../EventBus/UIEvents"
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import __component_destroy from "../../../../../V/VRDOM/component/__component_destroy"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

export class DialogComponent extends StatelessComponent {

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

    identifier = `dialog-${this.props.dialog.peer.type}-${this.props.dialog.peer.id}-${this.props.folderId}${this.props.isPin ? "-pin" : ""}`

    init() {
        this.dialog = this.props.dialog
        this._contextMenuListener = dialogContextMenu(this.dialog, this.props.folderId)
    }

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("hideDialogByPeer", this.onHideDialogByPeer)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelected)
    }

    reactive(R) {
        // why so many listeners you might ask, idk i'll answer
        R.object(this.dialog)
            .on("updateDraftMessage", this.onDialogUpdateDraftMessage)
            .on("readHistory", this.onDialogReadHistory)
            .on("updateUnreadCount", this.onDialogReadHistory)
            .on("updateUnread", this.onDialogReadHistory)
            .on("updateUnreadMark", this.onDialogUnreadMark)
            .on("updateReadInboxMaxId", this.onDialogReadHistory)
            .on("updateReadOutboxMaxId", this.onDialogReadHistory)
            // .on("newMessage", this.onDialogNewMessage)
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
            .on("messages.new", this.onDialogNewMessage)
            .on("updatePhoto", this.onPeerUpdatePhoto)
            .on("updatePhotoSmall", this.onPeerUpdatePhoto)
            .on("updateUserStatus", this.onPeerUpdateUserStatus)
    }

    render() {
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

    componentDidMount() {
        this.Archived = VComponent.getComponentById(`dialogs-archived-list`)
        this.Pinned = VComponent.getComponentById(`dialogs-pinned-list-${this.props.folderId}`)
        this.General = this.props.list //VComponent.getComponentById(`dialogs-general-list`)

        this.$el.__dialog = this.dialog
        this.$el.__message = this.dialog.peer.messages.last
        this.$el.__pinned = this.props.folderId == null ? this.dialog.pinned : FoldersManager.isPinned(this.dialog.peer, this.props.folderId)
        this.$el.__archived = this.dialog.isArchived
    }

    onChatSelected = event => {
        if (this.__.mounted) {
            if (AppSelectedChat.isSelected) {
                this.$el.classList.add("responsive-selected-chatlist")
            } else {
                this.$el.classList.remove("responsive-selected-chatlist")
            }

            if (AppSelectedChat.current === this.dialog.peer || AppSelectedChat.previous === this.dialog.peer) {
                this._patchActive()
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
        if (event.message === this.dialog.messages.last) {
            this._patchMessage()
        }
    }

    onDialogRefreshed = _ => {
        this._patchMessageAndResort()
    }

    onDialogDeleted = _ => {
        VRDOM.delete(this.$el)
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
            this.__destroy()
        }
    }

    _patchActive = () => {
        if (AppSelectedChat.check(this.dialog.peer)) {
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
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
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
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
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
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
        }

        const isPinned = this.props.folderId == null ? this.dialog.pinned : FoldersManager.isPinned(this.dialog.peer, this.props.folderId)

        if (isPinned !== this.$el.__pinned) {
            if (isPinned) {
                this.__destroy()

                this.Pinned.prependDialog(this.dialog)

                return
            } else {
                this.__destroy()

                AppEvents.Dialogs.fire("gotOne", {
                    dialog: this.dialog
                })
                return
            }

        } else if (this.dialog.isArchived !== this.$el.__archived) {
            if (this.dialog.isArchived) {
                this.__destroy()

                this.Archived.prependDialog(this.dialog)
                return
            } else {
                this.__destroy()

                AppEvents.Dialogs.fire("gotOne", {
                    dialog: this.dialog
                })
                return
            }

        } else if (!this.dialog.peer.messages.last) {
            // todo: handle no last message
        } else if (this.$el.__message.date !== this.dialog.peer.messages.last.date) {
            if (!isPinned) {
                if (this.$el.previousSibling) {
                    if (this.dialog.isArchived) {
                        this.__destroy()

                        this.Archived.prependDialog(this.dialog)
                        return
                    } else {
                        this.__destroy()

                        this.General.prependDialog(this.dialog)
                        return
                    }
                }
            }
        }

        this._patchMessage()
    }

    _handleClick = () => {
        if (AppSelectedChat.check(this.dialog.peer)) {
            UIEvents.General.fire("chat.scrollBottom")
        } else {
            AppSelectedChat.select(this.dialog.peer)
        }
    }

    __destroy = () => {
        __component_destroy(this)
    }
}
