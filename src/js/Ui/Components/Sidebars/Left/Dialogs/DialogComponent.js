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
    }

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .filter(event => event.peer === this.props.dialog.peer)
            .on("hideDialogByPeer", this.onHideDialogByPeer)

        E.bus(AppEvents.Peers)
            .filter(event => event.message && event.message === this.props.dialog.peer.messages.last)
            .on("messages.edited", this.onDialogEditMessage)

        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.dialog.peer)
            .on("messages.deleted", this._patchMessageAndResort)
            .on("messages.readOut", this.onDialogReadHistory)
            .on("messages.readIn", this.onDialogReadHistory)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelected)
    }

    reactive(R) {
        // why so many listeners you might ask, idk i'll answer
        R.object(this.props.dialog)
            .on("updateDraftMessage", this.onDialogUpdateDraftMessage)
            .on("updateUnreadCount", this.onDialogReadHistory)
            .on("updateUnread", this.onDialogReadHistory)
            .on("updateUnreadMark", this.onDialogUnreadMark)
            .on("updateSingle", this.onDialogUpdateSingle)
            .on("updatePinned", this.onDialogUpdatePinned)
            .on("updateFolderId", this.onDialogUpdateFolderId)
            .on("updateActions", this.onDialogUpdateActions)
            .on("refreshed", this.onDialogRefreshed)
            .on("deleted", this.onDialogDeleted)

        R.object(this.props.dialog.peer)
            .on("messages.new", this.onDialogNewMessage)
            .on("updatePhoto", this.onPeerUpdatePhoto)
            .on("updatePhotoSmall", this.onPeerUpdatePhoto)
            .on("updateUserStatus", this.onPeerUpdateUserStatus)
    }

    render() {
        return (
            <DialogFragment dialog={this.props.dialog}
                            click={this._handleClick}
                            contextMenu={dialogContextMenu(this.props.dialog, this.props.folderId)}
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

        this.$el.__dialog = this.props.dialog
        this.$el.__message = this.props.dialog.peer.messages.last
        this.$el.__pinned = this.props.folderId == null ? this.props.dialog.pinned : FoldersManager.isPinned(this.props.dialog.peer, this.props.folderId)
        this.$el.__archived = this.props.dialog.isArchived
    }

    onChatSelected = event => {
        if (this.__.mounted) {
            if (AppSelectedChat.isSelected) {
                this.$el.classList.add("responsive-selected-chatlist")
            } else {
                this.$el.classList.remove("responsive-selected-chatlist")
            }

            if (AppSelectedChat.current === this.props.dialog.peer || AppSelectedChat.previous === this.props.dialog.peer) {
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
        this._patchMessage()
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
        this.props.dialog.peer.dialog = undefined
        this.__destroy()
    }

    _patchActive = () => {
        if (AppSelectedChat.check(this.props.dialog.peer)) {
            this.$el.classList.add("active")
        } else {
            this.$el.classList.remove("active")
        }
    }

    _patchStatus = () => {
        if (this.__.mounted) {
            if (this.props.dialog.peer.onlineStatus.online) {
                this.$el.classList.add("online")
            } else {
                this.$el.classList.remove("online")
            }
        }
    }

    _patchMessage = () => {
        if (!this.props.dialog.messages.last) {
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
        }

        if (this.__.mounted) {
            this.$el.__message = this.props.dialog.peer.messages.last
            this.$el.setAttribute("data-message-id", this.props.dialog.peer.messages.last.id)

            this._patchReadStatus()
            this.textFragmentRef.patch()
            this.timeFragmentRef.patch()
            this.unreadCountFragmentRef.patch()
            this.unreadMentionsCountFragmentRef.patch()
        }
    }

    _patchReadStatus = () => {
        if (!this.props.dialog.messages.last) {
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
        }


        if (this.props.dialog.peer.messages.last.isOut && !this.props.dialog.peer.isSelf) {
            this.$el.classList.add("sent")

            if (this.props.dialog.peer.messages.last.isRead) {
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
        const dialog = this.props.dialog;
        if (!dialog.messages.last) {
            $(this.$el).hide()
            return
        } else {
            $(this.$el).show()
        }

        const isPinned = this.props.folderId == null ? dialog.pinned : FoldersManager.isPinned(dialog.peer, this.props.folderId)

        if (isPinned !== this.$el.__pinned) {
            if (isPinned) {
                this.__destroy()

                this.Pinned.prependDialog(dialog)

                return
            } else {
                this.__destroy()

                AppEvents.Dialogs.fire("gotOne", {
                    dialog: dialog
                })

                return
            }

        } else if (dialog.isArchived !== this.$el.__archived) {
            if (dialog.isArchived) {
                this.__destroy()

                this.Archived.prependDialog(dialog)
                return
            } else {
                this.__destroy()

                AppEvents.Dialogs.fire("gotOne", {
                    dialog: dialog
                })
                return
            }

        } else if (!dialog.peer.messages.last) {
            // todo: handle no last message
        } else if (this.$el.__message.date !== dialog.peer.messages.last.date) {
            if (!isPinned) {
                if (this.$el.previousSibling) {
                    if (dialog.isArchived) {
                        this.__destroy()

                        this.Archived.prependDialog(dialog)
                        return
                    } else {
                        this.__destroy()

                        this.General.prependDialog(dialog)
                        return
                    }
                }
            }
        }

        this._patchMessage()
    }

    _handleClick = () => {
        if (AppSelectedChat.check(this.props.dialog.peer)) {
            UIEvents.General.fire("chat.scrollBottom")
        } else {
            AppSelectedChat.select(this.props.dialog.peer)
        }
    }

    __destroy = () => {
        __component_destroy(this)
    }
}
