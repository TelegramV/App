import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadMarkBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment id={`dialog-${dialog.peer.id}-unreadMark`} show={dialog.unreadMark}> </DialogBadgeFragment>
    )
}