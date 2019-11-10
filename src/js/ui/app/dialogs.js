import {AppPermanentStorage} from "../../common/storage"

export function renderDialogsSlice(dialogsSlice) {
    const app = document.getElementById("app")

    let chatsHTML = `
<h1 id="authUsername"></h1>
<button id="logoutButton">Logout</button>
<h2>Chats: </h2>

<ul>`

    dialogsSlice.dialogs.forEach(dialog => {
        const dialogPinned = dialog.pFlags.pinned

        const peer = findPeerFromDialog(dialog, dialogsSlice)
        let peerName = getPeerName(peer)

        const message = findMessageFromDialog(dialog, dialogsSlice)
        const messageUser = findUserFromMessage(message, dialogsSlice)
        let messageUsername = messageUser ? messageUser.id !== peer.id ? `${getPeerName(messageUser, true)}` : "" : ""

        chatsHTML += `
            <li>
            <i>${dialogPinned ? "[pinned] " : ""} (${peer._})</i> 
            <b>${peerName}</b> : <i>${messageUsername}</i> ${message.message}
            </li>
            `
    })

    chatsHTML += `</ul>`

    app.innerHTML = chatsHTML

    document.getElementById("authUsername").innerHTML = AppPermanentStorage.getItem("authorizationData").user.username
    document.getElementById("logoutButton").addEventListener("click", () => {
        AppPermanentStorage.clear()
        window.location.reload()
    })
}

function findPeerFromDialog(dialog, dialogsSlice) {
    const dialogPeerMaps = {
        "peerUser": "users",
        "peerChannel": "chats",
        "peerChat": "chats",
    }

    const dialogPeerMap = {
        "peerUser": "user",
        "peerChannel": "channel",
        "peerChat": "chat",
    }

    return dialogsSlice[dialogPeerMaps[dialog.peer._]].find(item => {
        return String(item._) === String(dialogPeerMap[dialog.peer._]) && String(dialog.peer[`${item._}_id`]) === String(item.id)
    })
}

function findMessageFromDialog(dialog, dialogsSlice) {
    return dialogsSlice.messages.find(msg => {
        return String(msg.id) === String(dialog.top_message)
    })
}

function findUserFromMessage(message, dialogsSlice) {
    return dialogsSlice.users.find(user => String(user.id) === String(message.from_id))
}

function getPeerName(peer, usernameFirst = false) {
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