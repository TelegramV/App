export function getInputPeerFromPeer(peerName, peerId, accessHash = "") {
    switch (peerName) {
        case "chat":
            return {
                _: "inputPeerChat",
                chat_id: peerId
            }
        case "user":
            return {
                _: "inputPeerUser",
                user_id: peerId,
                access_hash: accessHash
            }
        case "channel":
            return {
                _: "inputPeerChannel",
                channel_id: peerId,
                access_hash: accessHash
            }
        default:
            console.warn("unexpected peerName")
            return {
                _: "inputPeerEmpty"
            }
    }
}

export function getInputPeerFromMessage(peerName, peerId, message) {
    switch (peerName) {
        case "user":
            return {
                _: "inputPeerUserFromMessage",
                user_id: peerId,
                msg_id: message
            }
        case "channel":
            return {
                _: "inputPeerChannelFromMessage",
                channel_id: peerId,
                msg_id: message
            }
        default:
            console.warn("unexpected peerName")
            return {
                _: "inputPeerEmpty"
            }
    }
}

export function getPeersInput(peerName) {
    switch (peerName) {
        case "chat":
            return "messages.getFullChat"
        case "user":
            return "users.getFullUser"
        case "channel":
            return "channel.getFullChannel"
        default:
            return ""
    }
}


export function findUserFromMessage(message, dialogsSlice) {
    return dialogsSlice.users.find(user => String(user.id) === String(message.from_id))
}
