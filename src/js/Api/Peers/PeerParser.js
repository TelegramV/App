export class PeerParser {
    /**
     * @param peer
     * @param idNames
     * @return {{_: string, id: number}}
     */
    static getPlain(peer, idNames = true) {
        switch (peer._) {
            case "inputPeerChat":
            case "peerChat":
                return {
                    _: "chat",
                    ...(idNames ? {chat_id: peer.chat_id} : {id: peer.chat_id})
                }
            case "inputPeerUser":
            case "peerUser":
                return {
                    _: "user",
                    ...(idNames ? {user_id: peer.user_id} : {id: peer.user_id})
                }
            case "inputPeerChannel":
            case "peerChannel":
                return {
                    _: "channel",
                    ...(idNames ? {channel_id: peer.channel_id} : {id: peer.channel_id})
                }
            default:
                return {}
        }
    }
}
