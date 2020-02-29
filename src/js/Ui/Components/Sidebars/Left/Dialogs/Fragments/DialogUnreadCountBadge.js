import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadCountBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment show={dialog.peer.messages.unreadCount > 0}>
            {dialog.peer.messages.unreadCount}
        </DialogBadgeFragment>
    )
}