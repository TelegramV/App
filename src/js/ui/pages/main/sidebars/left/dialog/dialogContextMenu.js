import {ContextMenuManager} from "../../../../../contextMenuManager"
import {ChannelPeer} from "../../../../../../api/dataObjects/peer/ChannelPeer"
import {GroupPeer} from "../../../../../../api/dataObjects/peer/GroupPeer"
import {SupergroupPeer} from "../../../../../../api/dataObjects/peer/SupergroupPeer"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import {ModalManager} from "../../../../../modalManager"
import {DialogAvatarFragment} from "./DialogAvatarFragment"
import {FlatButtonComponent} from "../../../components/input/flatButtonComponent"
import {Dialog} from "../../../../../../api/dialogs/Dialog"

export const dialogContextMenu = (dialog: Dialog) => {
    return ContextMenuManager.listener([
        {
            icon: "archive",
            title: "Archive chat"
        },
        () => {
            return {
                icon: dialog.isPinned ? "unpin" : "pin",
                title: dialog.isPinned ? "Unpin from top" : "Pin to top",
                onClick: _ => {
                    if (dialog.isPinned) {
                        dialog.api.setPinned(false)
                    } else {
                        dialog.api.setPinned(true)
                    }
                }
            }
        },
        {
            icon: "info",
            title: dialog.peer instanceof ChannelPeer ? "View channel info" : (dialog.peer instanceof GroupPeer || dialog.peer instanceof SupergroupPeer ? "View group info" : "View profile"),
            onClick: _ => {
                AppSelectedInfoPeer.select(dialog.peer)
            }
        },
        {
            icon: dialog.isMuted ? "unmute" : "mute",
            title: dialog.isMuted ? "Enable notifications" : "Disable notifications"
        },
        // {
        //     icon: unread !== "" ? "message" : "unread",
        //     title: unread !== "" ? "Mark as read" : "Mark as unread",
        //     onClick: _ => {
        //         dialog.api.markDialogUnread(unread === "")
        //     }
        // },
        {
            icon: "delete",
            title: "Delete chat",
            red: true,
            onClick: _ => {
                ModalManager.open(<div className="delete-chat-title">
                        <DialogAvatarFragment peer={dialog.peer}/>
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
    ])
}