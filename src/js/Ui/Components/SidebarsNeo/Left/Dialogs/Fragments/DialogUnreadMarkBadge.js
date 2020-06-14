import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadMarkBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment show={dialog.unreadMark}> </DialogBadgeFragment>
    )
}