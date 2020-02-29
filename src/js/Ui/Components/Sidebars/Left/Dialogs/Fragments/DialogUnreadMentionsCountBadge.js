import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadMentionsCountBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment show={dialog.peer.messages.unreadMentionsCount > 0}>
            @
        </DialogBadgeFragment>
    )
}