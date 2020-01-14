export class PeerAPI {
    static getInput(peer) {
        switch (peer._) {
            case "channel":
                return {
                    _: "inputPeerChannel",
                    channel_id: peer.id,
                    access_hash: peer.access_hash
                }
            case "user":
                return {
                    _: "inputPeerUser",
                    user_id: peer.id,
                    access_hash: peer.access_hash
                }
            case "chat":
                return {
                    _: "inputPeerChat",
                    chat_id: peer.id
                }
            case "self": // TODO check
                return {
                    _: "inputPeerSelf"
                }
        }
    }

    /**
     * @param peer
     * @param idNames
     * @return {{_: string}}
     */
    static getPlain(peer, idNames = true) {
        switch (peer._) {
            case "peerChat":
                return {
                    _: "chat",
                    ...(idNames ? {chat_id: peer.chat_id} : {id: peer.chat_id})
                }
            case "peerUser":
                return {
                    _: "user",
                    ...(idNames ? {user_id: peer.user_id} : {id: peer.user_id})
                }
            case "peerChannel":
                return {
                    _: "channel",
                    ...(idNames ? {channel_id: peer.channel_id} : {id: peer.channel_id})
                }
            default:
                return {

                }
        }
    }
}
