import {UserPeer} from "../../../../../../../Api/Peers/Objects/UserPeer"
import AppSelectedPeer from "../../../../../../reactive/SelectedPeer"
import {DialogAvatarFragment} from "./DialogAvatarFragment"
import {DialogTimeFragment} from "./DialogTimeFragment"
import {DialogTextFragment} from "./DialogTextFragment"
import {DialogUnreadMentionsCountBadge} from "./DialogUnreadMentionsCountBadge"
import {DialogUnreadCountBadge} from "./DialogUnreadCountBadge"
import {DialogUnreadMarkBadge} from "./DialogUnreadMarkBadge"

export const DialogFragment = ({
                                   dialog,
                                   contextMenu,
                                   click,
                                   avatarFragmentRef,
                                   timeFragmentRef,
                                   textFragmentRef,
                                   unreadMentionsCountFragmentRef,
                                   unreadCountFragmentRef,
                                   unreadMarkFragmentRef,
                               }) => {
    const peer = dialog.peer

    const personClasses = {
        "person": true,
        "rp": true,
        "online": peer instanceof UserPeer && peer.onlineStatus.online,
        "active": AppSelectedPeer.check(dialog.peer),
        "unread": dialog.peer.messages.unreadMentionsCount > 0 || dialog.peer.messages.unreadCount > 0 || dialog.unreadMark,
        "muted": dialog.isMuted,
    }

    if (dialog.peer.messages.last && dialog.peer.messages.last.isOut && !dialog.peer.isSelf) {
        personClasses["sent"] = true

        if (dialog.peer.messages.last.isRead) {
            personClasses["read"] = true
        }
    }

    return (
        <div data-message-id={dialog.peer.messages.last.id}
             className={personClasses}

             onClick={click}
             onContextMenu={contextMenu}>

            <DialogAvatarFragment ref={avatarFragmentRef}
                                  peer={dialog.peer}/>

            <div className="content">

                <div className="top">
                    <div className="title">
                        {peer.isSelf ? "Saved Messages" : peer.name}
                    </div>

                    <div className="status tgico"/>

                    <DialogTimeFragment ref={timeFragmentRef}
                                        dialog={dialog}/>
                </div>

                <div className="bottom">
                    <DialogTextFragment ref={textFragmentRef}
                                        dialog={dialog}/>

                    <DialogUnreadMentionsCountBadge ref={unreadMentionsCountFragmentRef} dialog={dialog}/>
                    <DialogUnreadCountBadge ref={unreadCountFragmentRef} dialog={dialog}/>

                    <DialogUnreadMarkBadge ref={unreadMarkFragmentRef} dialog={dialog}/>
                </div>
            </div>
        </div>
    )
}