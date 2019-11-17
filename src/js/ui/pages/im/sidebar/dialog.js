import {AppFramework} from "../../../framework/framework"
import VDOM from "../../../framework/vdom"

function openDialog(peer) {
    return () => AppFramework.Router.push("/", {
        queryParams: {
            p: `${peer._}.${peer.id}`
        }
    })
}

export function UICreateDialog(dialog) {
    const unread = dialog.unreadMentionsCount > 0 ? "@" : (dialog.unreadCount > 0 ? dialog.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

    let personClasses = ["person", "rp"]
    if (dialog.online) personClasses.push("online")
    if (unread !== "") personClasses.push("unread")
    if (dialog.unreadCount > 0) personClasses.push("muted")

    return VDOM.render(
        <div data-peer={`${dialog.peer._}.${dialog.peer.id}`}
             data-message-id={dialog.message.id}
             className={personClasses}
             onClick={openDialog(dialog.peer)}>
            <div className={"avatar " + (!dialog.photo ? `placeholder-${dialog.photoPlaceholder.num}` : "")}
                 style={`background-image: url(${dialog.photo});`}>
                {!dialog.photo ? dialog.photoPlaceholder.text : ""}
            </div>
            <div className="content">
                <div className="top">
                    <div className="title">{dialog.title}</div>
                    <div className="status tgico"/>
                    <div className="time">{new Date(dialog.message.date).toLocaleTimeString('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}</div>
                </div>
                <div className="bottom">
                    <div className="message"><span
                        className="sender">{dialog.message.self ? "" : `${dialog.message.sender ? dialog.message.sender + ": " : ""}`}</span>{dialog.message.text}
                    </div>
                    <div className="badge tgico">{unread}</div>
                </div>
            </div>
        </div>
    )
}
