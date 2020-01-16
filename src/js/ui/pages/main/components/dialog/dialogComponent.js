import {UserPeer} from "../../../../../api/dataObjects/peer/userPeer"
import {DialogTextComponent} from "./dialogTextComponent"
import {AppFramework} from "../../../../framework/framework"
import {DialogAvatarComponent} from "./dialogAvatarComponent"
import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"

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

export function DialogComponent({dialog}) {
    const peer = dialog.peer
    const unread = dialog.messages.unreadMentionsCount > 0 ? "@" : (dialog.messages.unreadCount > 0 ? dialog.messages.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

    let personClasses = ["person", "rp"]
    if (peer instanceof UserPeer && peer.onlineStatus.online) {
        personClasses.push("online")
    }
    if (AppSelectedDialog.check(dialog)) {
        personClasses.push("active")
    }
    if (unread !== "") personClasses.push("unread")
    if (dialog.isMuted) personClasses.push("muted")
    if (dialog.messages.last.isOut) {
        personClasses.push("sent")

        if (dialog.messages.last.isRead) personClasses.push("read")
    }

    return (
        <div data-peer-username={dialog.peer} data-peer={`${dialog.type}.${dialog.id}`}
             data-message-id={dialog.messages.last.id}
             data-date={dialog.messages.last.date}
             data-pinned={dialog.isPinned === undefined ? false : dialog.isPinned}
             className={personClasses}
             onClick={handleClick(dialog)}
             data-index={dialog.index}>

            <DialogAvatarComponent dialog={dialog}/>

            <div className="content">
                <div className="top">
                    <div className="title">{peer.name}</div>
                    <div className="status tgico"/>
                    <div className="time">{dialog.messages.last.getDate("en", DATE_FORMAT)}</div>
                </div>

                <div className="bottom">
                    <DialogTextComponent dialog={dialog}/>

                    <div css-display={dialog.messages.unreadMentionsCount === 0 ? "none" : ""}
                         className="badge tgico">@{dialog.messages.unreadMentionsCount}</div>
                    <div css-display={dialog.messages.unreadCount === 0 ? "none" : ""}
                         className="badge tgico">{dialog.messages.unreadCount}</div>
                    <div css-display={!dialog.unreadMark ? "none" : ""} className="badge tgico">?</div>
                </div>
            </div>
        </div>
    )
}
