export class PeerParser {
    /**
     * @param peer
     * @param idNames
     * @return {{_: string, id: number}}
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
                return {}
        }
    }
}
