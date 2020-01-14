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
            console.warn("unexpected peerName = ", peerName)
            return {
                _: "inputPeerEmpty"
            }
    }
}
export function getInputFromPeer(peerName, peerId, accessHash = "") {
    switch (peerName) {
        case "chat":
            return {
                _: "inputChat",
                chat_id: peerId
            }
        case "user":
            return {
                _: "inputUser",
                user_id: peerId,
                access_hash: accessHash
            }
        case "channel":
            return {
                _: "inputChannel",
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

export function getInputPeerFromPeerWithoutAccessHash(peerName, peerId) {
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
            }
        case "channel":
            return {
                _: "inputPeerChannel",
                channel_id: peerId,
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

export function getPeerNameFromType(peerType) {
    switch (peerType) {
        case "peerChat":
            return "chat"
        case "peerUser":
            return "user"
        case "peerChannel":
            return "channel"
        default:
            return ""
    }
}