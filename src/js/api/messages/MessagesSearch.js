import {MTProto} from "../../mtproto/external"
import PeersManager from "../peers/PeersManager"

class MessagesSearch {

    static search(peer, {offsetId, filter, limit = 33, q = ""}) {
        return MTProto.invokeMethod("messages.search", {
            peer: peer.inputPeer,
            q: q,
            filter: filter,
            limit: limit,
            offset_id: offsetId
        }).then(Messages => {
            if (Messages._ === "messages.channelMessages") {
                peer.dialog.pts = Messages.pts
            }

            Messages._peer = peer

            Messages.users.forEach(rawUser => PeersManager.setFromRawAndFire(rawUser))
            Messages.chats.forEach(rawChat => PeersManager.setFromRawAndFire(rawChat))

            Messages.count = Messages.count === undefined ? Messages.messages.length : Messages.count

            return Messages
        })
    }
}

export default MessagesSearch