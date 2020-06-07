import {Dialog} from "../../../../../../Api/Dialogs/Dialog";
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import {DialogAvatarFragment} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogAvatarFragment";
import {DialogTextFragment} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogTextFragment";
import {DialogUnreadMentionsCountBadge} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogUnreadMentionsCountBadge";
import {DialogUnreadCountBadge} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogUnreadCountBadge";
import {DialogUnreadMarkBadge} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogUnreadMarkBadge";
import {DialogTimeFragment} from "../../../../Sidebars/Left/Dialogs/Fragments/DialogTimeFragment";
import AppSelectedChat from "../../../../../Reactive/SelectedChat";
import AvatarComponent from "../../../../Basic/AvatarComponent";

export const DialogFragment = ({dialog}) => {
    const peer = dialog.peer
    let lastMessage = dialog.peer.messages.last

    const personClasses = {
        "person": true,
        "rp": true,
        "online": peer instanceof UserPeer && peer.onlineStatus.online,
        "active": AppSelectedChat.check(dialog.peer),
        "unread": dialog.peer.messages.unreadMentionsCount > 0 || dialog.peer.messages.unreadCount > 0 || dialog.unreadMark,
        "muted": dialog.isMuted,
    }

    if (lastMessage && lastMessage.isOut && !dialog.peer.isSelf) {
        personClasses["sent"] = true

        if (lastMessage.isRead) {
            personClasses["read"] = true
        }
    }

    return (
        <div className={personClasses}

             onClick={_ => AppSelectedChat.select(peer)}
             // onContextMenu={contextMenu}
        >

            <AvatarComponent peer={peer} saved={true}/>
            {/*<DialogAvatarFragment peer={dialog.peer}/>*/}

            <div className="content">

                <div className="top">
                    <div className="title">
                        {peer.isSelf ? "Saved Messages" : peer.name}
                    </div>

                    <div className="status tgico"/>

                    <DialogTimeFragment
                                        dialog={dialog}/>
                </div>

                <div className="bottom">
                    <DialogTextFragment
                                        dialog={dialog}/>

                    <DialogUnreadMentionsCountBadge dialog={dialog}/>
                    <DialogUnreadCountBadge dialog={dialog}/>

                    <DialogUnreadMarkBadge dialog={dialog}/>
                </div>
            </div>
        </div>
    )
}