import {AppFramework} from "../../../framework/framework"
import VDOM from "../../../framework/vdom"
import {UserDialog} from "../../../../dataObjects/userDialog";
import {Dialog} from "../../../../dataObjects/dialog";

function openDialog(dialog) {
    return () => AppFramework.Router.push("/", {
        queryParams: {
            p: dialog instanceof Dialog ? `${dialog.type}.${dialog.id}` : dialog
        }
    })
}

export function UICreateDialog(dialog) {
    console.log("UICreateDialog")
    const unread = dialog.unreadMentionsCount > 0 ? "@" : (dialog.unreadCount > 0 ? dialog.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

    let personClasses = ["person", "rp"]
    if (dialog instanceof UserDialog && dialog.onlineStatus.online) personClasses.push("online")
    if (unread !== "") personClasses.push("unread")
    if (dialog.muted) personClasses.push("muted")
    if(dialog.lastMessage.isOut) {
        personClasses.push("sent")

        if (dialog.lastMessage.isRead) personClasses.push("read")
    }

    let hasAvatar = dialog.hasAvatar && dialog._avatar !== undefined
    console.log(dialog, hasAvatar)

    return VDOM.render(
        <div data-peer={`${dialog.type}.${dialog.id}`}
             data-message-id={dialog.lastMessage.id}
             className={personClasses}
             onClick={openDialog(dialog)}>
            <div className={"avatar " + (!hasAvatar ? `placeholder-${dialog.avatarLetter.num}` : "")}
                 style={`background-image: url(${dialog._avatar});`}>
                {!hasAvatar ? dialog.avatarLetter.text : ""}
            </div>
            <div className="content">
                <div className="top">
                    <div className="title">{dialog.peerName}</div>
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
