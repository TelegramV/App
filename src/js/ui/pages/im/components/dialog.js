import {AppTemporaryStorage} from "../../../../common/storage"
import {FileAPI} from "../../../../api/fileAPI";
import {FrameworkComponent} from "../../../framework/component"
import {AppFramework} from "../../../framework/framework"
import {getMessagePreviewDialog} from "../../../utils";

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


        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)
        // TODO this should be made with css
        const submsg = message.message
        const date = new Date(message.date * 1000)

        // console.log(peer, dialog)
        this.reactive.data = {
            pinned: dialogPinned,
            peerName,
            messageUsername: messageUsername + msgPrefix,
            message: submsg,
            peer: dialog.peer,
            verified: peer.pFlags.verified,
            online: peer.status && peer.status._ === "userStatusOnline",
            photoPlaceholder: {
                num: Math.abs(peer.id) % 8,
                text: peerName[0]
            },
            hasNotification: dialog.unread_count > 0,
            unread: dialog.unread_mentions_count > 0 ? "@" : (dialog.unread_count > 0 ? dialog.unread_count.toString() : (dialog.pFlags.unread_mark ? " " : "")),
            muted: dialog.notify_settings.mute_until > 0,
            date: date.toLocaleTimeString('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }

        if (peer.photo) {
            let a = peer.photo.photo_small
            try {
                FileAPI.getPeerPhoto(a, peer.photo.dc_id, peer, false).then(url => {
                    this.reactive.data.photo = url
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
        let data = reactive.data
        let personClasses = "person rp "
        if(data.online) personClasses += "online "
        if(data.unread !== "") personClasses += "unread "
        if(data.hasNotification) personClasses += "muted "
        return (
            <div class={personClasses} onClick={this.openDialog(reactive.data.peer)}>
                <div class={"avatar " + (!data.photo ? `placeholder-${data.photoPlaceholder.num}` : "")} style={`background-image: url(${data.photo});`}>
                    {!data.photo ? data.photoPlaceholder.text : ""}
                </div>
                <div class="content">
                    <div class="top">
                        <div class="title">{data.peerName}</div>
                        <div class="status tgico"></div>
                        <div class="time">{data.date}</div>
                    </div>
                    <div class="bottom">
                        <div class="message"><span class="sender">{data.messageUsername}</span>{data.message}</div>
                        <div class="badge tgico">{data.unread}</div>
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