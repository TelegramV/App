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

    const personClasses = {
        "person": true,
        "rp": true,
        "online": peer instanceof UserPeer && peer.onlineStatus.online,
        "active": AppSelectedDialog.check(dialog),
        "unread": unread !== "",
        "muted": dialog.isMuted,
    }

    if (dialog.messages.last.isOut) {
        personClasses["sent"] = true

        if (dialog.messages.last.isRead) {
            personClasses["read"] = true
        }
    }

    return (
        <div data-peer-username={dialog.peer.username} data-peer={`${dialog.type}.${dialog.id}`}
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
                         className="badge tgico">@
                    </div>
                    <div
                        css-display={dialog.messages.unreadCount === 0 || dialog.messages.unreadMentionsCount > 0 ? "none" : ""}
                        className="badge tgico">{dialog.messages.unreadCount}</div>
                    <div css-display={!dialog.unreadMark ? "none" : ""} className="badge tgico">?</div>
                </div>
            </div>
        </div>
    )
}
