import {AppTemporaryStorage} from "../../../../common/storage"

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

function vNodeTemplate(data) {
    return (
        <a href={`/#/?p=${data.peer._}.${data.peer[dialogPeerMap[data.peer._] + "_id"]}`}>
            <i>
                {data.pinned ? "[pinned] " : ""}
            </i>
            <b>
                {data.peerName}
            </b>
            <i>
                {data.messageUsername}
            </i>
            {data.message}
        </a>
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
        let messageUsername = messageUser ? messageUser.id !== peer.id ? `${getPeerName(messageUser, true)}` : "" : ""

        const submsg = message.message ? (message.message.length > 64 ? (message.message.substring(0, 64) + "...") : message.message) : ""

        this.vNode = vNodeTemplate({
            pinned: dialogPinned,
            peerName,
            messageUsername,
            message: submsg,
            peer: dialog.peer
        })
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