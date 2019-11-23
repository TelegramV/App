export function getInputPeerFromPeer(peerName, peerId) {
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
                access_hash: ""
            }
        case "channel":
            return {
                _: "inputPeerChannel",
                channel_id: peerId,
                access_hash: ""
            }
        default:
            console.warn("unexpected peerName")
            return {
                _: "inputPeerEmpty"
            }
    }
}

export function findUserFromMessage(message, dialogsSlice) {
    return dialogsSlice.users.find(user => String(user.id) === String(message.from_id))
}
