import {FrameworkComponent} from "../../../framework/component"
import {AppFramework} from "../../../framework/framework"

export const dialogPeerMaps = {
    "peerUser": "users",
    "peerChannel": "chats",
    "peerChat": "chats",
}

export const dialogPeerMap = {
    "peerUser": "user",
    "peerChannel": "channel",
    "peerChat": "chat",
}

export class TelegramDialogComponent extends FrameworkComponent {
    constructor(props = {}) {
        super()
        this.dialog = props.dialog
    }

    openDialog(peer) {
        return () => AppFramework.Router.push("/", {
            queryParams: {
                p: `${peer._}.${peer.id}`
            }
        })
    }

    mounted() {
    }

    h() {
        const dialog = this.dialog

        if (!dialog) {
            return <div>...</div>
        }

        const unread = dialog.unreadMentionsCount > 0 ? "@" : (dialog.unreadCount > 0 ? dialog.unreadCount.toString() : (dialog.unreadMark ? " " : ""))

        let personClasses = "person rp "
        if (dialog.online) personClasses += "online "
        if (unread !== "") personClasses += "unread "
        if (dialog.unreadCount > 0) personClasses += "muted "

        return (
            // FIXME: replaceWith is really bad kostyl!
            <div replaceWith={true} class={personClasses} onClick={this.openDialog(dialog.peer)}>
                <div class={"avatar " + (!dialog.photo ? `placeholder-${dialog.photoPlaceholder.num}` : "")}
                     style={`background-image: url(${dialog.photo});`}>
                    {!dialog.photo ? dialog.photoPlaceholder.text : ""}
                </div>
                <div class="content">
                    <div class="top">
                        <div class="title">{dialog.title}</div>
                        <div class="status tgico"></div>
                        <div class="time">{dialog.date.toLocaleTimeString('en', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}</div>
                    </div>
                    <div class="bottom">
                        <div class="message"><span
                            class="sender">{dialog.message.self ? "" : `${dialog.message.sender ? dialog.message.sender + ": " : ""}`}</span>{dialog.message.text}
                        </div>
                        <div class="badge tgico">{unread}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export function findMessageFromDialog(dialog, dialogsSlice) {
    return dialogsSlice.messages.find(msg => {
        return String(msg.id) === String(dialog.top_message)
    })
}

export function findUserFromMessage(message, dialogsSlice) {
    return dialogsSlice.users.find(user => String(user.id) === String(message.from_id))
}

export function getPeerType(peer) {
    switch (peer._) {
        case "chat":
            return "chat"
        case "channel":
            return "channel"
        case "user":
            return "user"
    }
}

export function getPeerName(peer, usernameFirst = false) {
    if (!peer) {
        return ""
    }

    if (usernameFirst && peer.username) {
        return `@${peer.username}`
    }

    let peerName = ""

    switch (peer._) {
        case "chat":
            peerName = peer.title
            break
        case "channel":
            peerName = peer.title
            break
        case "user":
            peerName = peer.first_name
            if (peer.last_name)
                peerName += ` ${peer.last_name}`
            break
    }

    return peerName
}

export function findPeerFromDialog(dialog, dialogsSlice) {
    return dialogsSlice[dialogPeerMaps[dialog.peer._]].find(item => {
        return String(item._) === String(dialogPeerMap[dialog.peer._]) && String(dialog.peer[`${item._}_id`]) === String(item.id)
    })
}
