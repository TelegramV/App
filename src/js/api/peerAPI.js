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
}
