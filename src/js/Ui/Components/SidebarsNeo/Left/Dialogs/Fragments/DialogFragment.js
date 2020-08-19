import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer"
import AppSelectedChat from "../../../../../Reactive/SelectedChat"
import AvatarComponent from "../../../../Basic/AvatarComponent"
import {DialogTimeFragment} from "./DialogTimeFragment"
import {DialogTextFragment} from "./DialogTextFragment"
import {DialogUnreadMentionsCountBadge} from "./DialogUnreadMentionsCountBadge"
import {DialogUnreadCountBadge} from "./DialogUnreadCountBadge"
import {DialogUnreadMarkBadge} from "./DialogUnreadMarkBadge"
import Locale from "../../../../../../Api/Localization/Locale"

export const DialogFragment = (
    {
        dialog,
        contextMenu,
        click,
        timeFragmentRef,
        textFragmentRef,
        unreadMentionsCountFragmentRef,
        unreadCountFragmentRef,
        unreadMarkFragmentRef,
        ...otherArgs
    }
) => {
    const peer = dialog.peer
    let lastMessage = dialog.peer.messages.last

    const personClasses = {
        "person": true,
        "rp": true,
        "online": peer instanceof UserPeer && peer.online,
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
        <div data-message-id={lastMessage.id}
             className={personClasses}
             onClick={click}
             onContextMenu={contextMenu}
             style={{
                 // "height": "70px",
             }}>

            <AvatarComponent peer={dialog.peer}/>

            <div className="content">

                <div className="top">
                    <div className="title">
                        {peer.isSelf ? Locale.l("lng_saved_messages") : peer.name}
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