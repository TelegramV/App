import {DialogBadgeFragment} from "./DialogBadgeFragment"

export const DialogUnreadMentionsCountBadge = ({dialog}) => {
    return (
        <DialogBadgeFragment id={`dialog-${dialog.peer.id}-mentionCount`}
                             show={dialog.peer.messages.unreadMentionsCount > 0}>
            @
        </DialogBadgeFragment>
    )
}
