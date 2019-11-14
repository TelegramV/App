import {AppTemporaryStorage} from "../../../../common/storage"
import {FileAPI} from "../../../../api/fileAPI";
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
        this.dialogsSlice = props.dialogsSlice || AppTemporaryStorage.getItem("dialogsSlice")

        this.init()
    }


    // yes, kostyl, but idk another way now
    openDialog(peer) {
        return () => AppFramework.Router.push("/", {
            queryParams: {
                p: `${peer._}.${peer[dialogPeerMap[peer._] + "_id"]}`
            }
        })
    }

    // default value to `this.reactive`
    data() {
        return {
            message: {
                pinned: false,
                peerName: "undefined",
                messageUsername: "undefined",
                message: null,
                peer: null,
                photo: ""
            }
        }
    }

    init() {
        const dialogsSlice = this.dialogsSlice
        const dialog = this.dialog

        const dialogPinned = dialog.pFlags.pinned

        const peer = findPeerFromDialog(dialog, dialogsSlice)
        let peerName = getPeerName(peer)

        const message = findMessageFromDialog(dialog, dialogsSlice)
        const messageUser = findUserFromMessage(message, dialogsSlice)
        let messageUsername = messageUser ? messageUser.id !== peer.id ? `${getPeerName(messageUser, false)}` : "" : ""

        const submsg = message.message ? (message.message.length > 64 ? (message.message.substring(0, 64) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        this.reactive.data = {
            pinned: dialogPinned,
            peerName,
            messageUsername,
            message: submsg,
            peer: dialog.peer,
            photo: "/static/images/icons/admin_3x.png",
            hasNotification: dialog.unread_count > 0,
            unread: dialog.unread_mentions_count > 0 ? "@" : dialog.unread_count.toString(),
            muted: dialog.notify_settings.mute_until,
            date: date.toLocaleTimeString('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }

        if (peer.photo) {
            let a = peer.photo.photo_small
            try {
                FileAPI.getPeerPhoto(a, peer, false).then(response => {
                    const blob = new Blob([response.bytes], {type: 'application/jpeg'});
                    this.reactive.data.photo = URL.createObjectURL(blob)
                }).catch(e => {
                    //
                })
            } catch (e) {
                //
            }
        }
    }

    h({reactive}) {
        if (!reactive.data) {
            return <div>...</div>
        }

        const notificationClasses = `dialog-notification${reactive.data.muted ? " muted" : ""}`
        return (
            <div className="dialog-item" onClick={this.openDialog(reactive.data.peer)}>
                <img className="dialog-photo round-block"
                     src={reactive.data.photo}/>
                <div className="dialog-info">
                    <div className="dialog-peer">{reactive.data.peerName}</div>
                    <div className="dialog-short-text"><span
                        className="dialog-short-text-sender">{reactive.data.messageUsername.length > 0 ? reactive.data.messageUsername + ": " : ""}</span>{this.reactive.data.message}
                    </div>
                </div>
                <div className="dialog-meta">
                    <div className="dialog-time">{reactive.data.date}</div>
                    <br/>
                    {reactive.data.hasNotification || reactive.data.pinned ? (
                        <div className={notificationClasses}>
                            {reactive.data.pinned && !reactive.data.hasNotification ?
                                <img className="full-center" src="/static/images/icons/pinnedchat_svg.svg"/> : ""}
                            {reactive.data.hasNotification ?
                                <div className="dialog-notification">{reactive.data.unread}</div> : ""}
                        </div>
                    ) : ""}
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