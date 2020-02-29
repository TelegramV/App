import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadCountBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment id={`dialog-${dialog.peer.id}-unreadCount`}
                             show={dialog.peer.messages.unreadCount > 0}>

            {dialog.peer.messages.unreadCount}
        </DialogBadgeFragment>
    )
}