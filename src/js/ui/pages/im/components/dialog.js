import {AppTemporaryStorage} from "../../../../common/storage"
import {FileAPI} from "../../../../api/fileAPI";

const VDOM = require("../../../framework/vdom")

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

function vNodeTemplate(data, openDialog) {
    let personClasses = "person rp "
    if(data.online) personClasses += "online "
    if(data.unread !== "") personClasses += "unread "
    if(data.hasNotification) personClasses += "muted "
    return (
        <div class={personClasses} onClick={openDialog}>
            <img class="avatar" src={data.photo} alt="avatar"/>
            <div class="content">
                <div class="top">
                    <div class="title">{data.peerName}</div>
                    <div class="status tgico"></div>
                    <div class="time">{data.date}</div>
                </div>
                <div class="bottom">
                    <div class="message">{data.messageUsername.length > 0 ? data.messageUsername + ": " : "."}</div>
                    <div class="badge tgico">{data.unread}</div>
                </div>
            </div>
        </div>
    )
}

export class TelegramDialogComponent extends HTMLElement {
    constructor(options = {}) {
        super();
        this.dialog = options.dialog
        this.dialogsSlice = options.dialogsSlice || AppTemporaryStorage.getItem("dialogsSlice")

        this.vNode = null
    }

    connectedCallback() {
        this.initVNode().then(() => {
            this.render()
        })
    }

    async initVNode() {
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

        const data =  {
            pinned: dialogPinned,
            peerName,
            messageUsername,
            message: submsg,
            peer: dialog.peer,
            photo: "./icons/admin_3x.png",
            hasNotification: dialog.unread_count > 0,
            unread: dialog.unread_mentions_count > 0 ? "@" : (dialog.unread_count > 0 ? dialog.unread_count.toString() : ""),
            muted: dialog.notify_settings.mute_until,
            date: date.toLocaleTimeString('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
        const onClick = d => {
            // TODO ask @kohutd how to open it properly
            window.location = `/#/?p=${data.peer._}.${data.peer[dialogPeerMap[data.peer._] + "_id"]}`
        }

        this.vNode = vNodeTemplate(data, onClick)

        if(peer.photo) {
            let a = peer.photo.photo_small
            FileAPI.getPeerPhoto(a, peer, false).then(response => {
                const blob = new Blob([response.bytes], { type: 'application/jpeg' });
                data.photo = URL.createObjectURL(blob)
                this.vNode = vNodeTemplate(data, onClick)
                this.render()
            })
        }
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
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