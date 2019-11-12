import {AppPermanentStorage} from "../../common/storage"
import {MTProto} from "../../mtproto";
import {bufferConcat, createNonce, intToBytes, longToBytes} from "../../mtproto/utils/bin";
import {FileAPI} from "../../api/fileAPI";
import {PeerAPI} from "../../api/peerAPI";
import {parseMessageEntities} from "../../mtproto/utils/htmlHelpers";

function renderMessagesForDialog(dialog, peer) {
    let messages_list = document.querySelector("#messages_list")
    messages_list.innerHTML = "";
    MTProto.invokeMethod("messages.getHistory", {
        peer: PeerAPI.getInput(peer),
        offset_id: 0,
        offset_date: 0,
        add_offset: 0,
        limit: 20,
        max_id: 0,
        min_id: 0,
        hash: 0

    }).then(response => {
        response.messages.forEach((message, i) => {
            const li = document.createElement("li");
            li.innerHTML = parseMessageEntities(message.message, message.entities);
            if(message.media) {
                if(message.media.photo) {
                    const img = document.createElement("img")
                    li.appendChild(img)
                    FileAPI.getFile(message.media.document || message.media.photo).then(response => {
                        if(response._ === "upload.file") {
                            const blob = new Blob([response.bytes], { type: 'application/jpeg' });
                            img.setAttribute("src", URL.createObjectURL(blob))
                        }
                    })
                } else if(message.media.document) {
                    const docLink = document.createElement("a")
                    li.appendChild(docLink)
                    FileAPI.getFile(message.media.document).then(response => {
                        if(response._ === "upload.file") {
                            // message.media.document.mime_type
                            const blob = new Blob([response.bytes], { type: "octec/stream" });
                            docLink.setAttribute("href", URL.createObjectURL(blob))
                            docLink.innerText = `Download file (${message.media.document.mime_type})`
                            // console.log("Attributes", message.media.document.attributes)
                        }
                    })
                }
            }
            messages_list.appendChild(li)
        })
    })
}

const dialogs = []

export function renderDialogsSlice(dialogsSlice) {
    const app = document.getElementById("app")

    let chatsHTML = `
<h1 id="authUsername"></h1>
<button id="logoutButton">Logout</button>
<div style="display: flex; flex-direction: row">
<table border="1" style="width: 400px;">
<tr>
    <th>Chats: </th>
</tr>

`
    let testChat = null
    dialogsSlice.dialogs.forEach(dialog => {
        const dialogPinned = dialog.pFlags.pinned

        const peer = findPeerFromDialog(dialog, dialogsSlice)
        if(peer.id == 196706924) testChat = dialog // TODO remove, only for tests
        let peerName = getPeerName(peer)

        const message = findMessageFromDialog(dialog, dialogsSlice)
        const messageUser = findUserFromMessage(message, dialogsSlice)
        let messageUsername = messageUser ? messageUser.id !== peer.id ? `${getPeerName(messageUser, true)}` : "" : ""
        if(peer.photo) {
            let a = peer.photo.photo_small
            // FileAPI.getPeerPhoto(a, peer, false).then(response => {
            //     const blob = new Blob([response.bytes], { type: 'application/jpeg' });
            //     document.querySelector(`#avatar_${peer.id}`).setAttribute("src", URL.createObjectURL(blob))
            // })
        }
        chatsHTML += `
            <tr>
                <td id="dialog_${peer.id}">
                    <img id="avatar_${peer.id}">
                    <i>${dialogPinned ? "[pinned] " : ""} (${peer._})</i> 
                    <b>${peerName}</b> : <i>${messageUsername}</i> ${parseMessageEntities(message.message, message.entities, true)}
                </td>
            </tr>
            `
        dialogs.push(dialog)
    })

    chatsHTML += `

</table>
<div>
<h1>Messages</h1>
<ul id="messages_list">
</ul>
</div>
</div>
`

    app.innerHTML = chatsHTML

    renderMessagesForDialog(testChat, findPeerFromDialog(testChat, dialogsSlice))

    dialogs.forEach((dialog) => {
        const peer = findPeerFromDialog(dialog, dialogsSlice)
        document.querySelector(`#dialog_${peer.id}`).onclick = function() {
            renderMessagesForDialog(dialog, peer)
        }
    })

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