import {AppFramework} from "../../../framework/framework"
import {UserPeer} from "../../../../dataObjects/userPeer";

function openDialog(dialog) {
    return () => AppFramework.Router.push("/", {
        queryParams: {
            p: `${dialog.type}.${dialog.id}`
        }
    })
}

export function UICreateDialog(dialog) {
    if (dialog.id == "484725047") console.log("ui create dialog", dialog)
    const peer = dialog.peer
    const unread = dialog.unreadMentionsCount > 0 ? "@" : (dialog.unreadCount > 0 ? dialog.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

    let personClasses = ["person", "rp"]
    if (peer instanceof UserPeer && peer.onlineStatus.online) {
        console.log("isOnline", peer.onlineStatus.online)
        personClasses.push("online")
    }
    if (unread !== "") personClasses.push("unread")
    if (dialog.muted) personClasses.push("muted")
    if (dialog.lastMessage.isOut) {
        personClasses.push("sent")

        if (dialog.lastMessage.isRead) personClasses.push("read")
    }

    let hasAvatar = peer.hasAvatar && peer._avatar !== undefined

    return (
        <div data-peer={`${dialog.type}.${dialog.id}`}
             data-message-id={dialog.lastMessage.id}
             className={personClasses}
             onClick={openDialog(dialog)}>
            <div className={"avatar " + (!hasAvatar ? `placeholder-${peer.avatarLetter.num}` : "")}>
                {!hasAvatar ? peer.avatarLetter.text : ""}
            </div>
            <div className="content">
                <div className="top">
                    <div className="title">{peer.peerName}</div>
                    <div className="status tgico"/>
                    <div className="time">{dialog.lastMessage.getDate('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}</div>
                </div>
                <div className="bottom">
                    <div className="message"><span
                        className="sender">{dialog.lastMessage.prefix}</span>{dialog.lastMessage.text}
                    </div>
                    <div className="badge tgico">{unread}</div>
                </div>
            </div>
        </div>
    )
}
