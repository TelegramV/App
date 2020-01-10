import {UserPeer} from "../../../../../dataObjects/userPeer"
import {DialogTextComponent} from "./dialogTextComponent"
import {AppFramework} from "../../../../framework/framework"
import {DialogAvatarComponent} from "./dialogAvatarComponent"

const DATE_FORMAT = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}

/**
 * @param {Dialog} dialog
 */
function handleClick(dialog) {
    const p = dialog.peer.username ? `@${dialog.peer.username}` : `${dialog.type}.${dialog.id}`

    return () => AppFramework.Router.push("/", {
        queryParams: {
            p
        }
    })
}

export const DialogComponent = {
    name: "dialog",
    h({dialog}) {
        const peer = dialog.peer
        const unread = dialog.unreadMentionsCount > 0 ? "@" : (dialog.unreadCount > 0 ? dialog.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

        let personClasses = ["person", "rp"]
        if (peer instanceof UserPeer && peer.onlineStatus.online) {
            personClasses.push("online")
        }
        if (unread !== "") personClasses.push("unread")
        if (dialog.muted) personClasses.push("muted")
        if (dialog.lastMessage.isOut) {
            personClasses.push("sent")

            if (dialog.lastMessage.isRead) personClasses.push("read")
        }

        return (
            <div data-peer-username={dialog.peer} data-peer={`${dialog.type}.${dialog.id}`}
                 data-message-id={dialog.lastMessage.id}
                 className={personClasses}
                 onClick={handleClick(dialog)}>

                <DialogAvatarComponent dialog={dialog}/>

                <div className="content">
                    <div className="top">
                        <div className="title">{peer.peerName}</div>
                        <div className="status tgico"/>
                        <div className="time">{dialog.lastMessage.getDate("en", DATE_FORMAT)}</div>
                    </div>

                    <div className="bottom">
                        <DialogTextComponent dialog={dialog}/>

                        <div className="badge tgico">{unread}</div>
                    </div>
                </div>
            </div>
        )
    }
}
