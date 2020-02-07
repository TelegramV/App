import {MTProto} from "../../mtproto/external"
import PeersManager from "../peers/objects/PeersManager"
import {Manager} from "../manager"

class SearchManagerSingleton extends Manager {

    cachedRecent = new Set()

    searchMessages(peer, {offsetId, filter, limit = 33, q = ""}) {
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

            PeersManager.fillPeersFromUpdate(Messages)

            Messages.count = Messages.count === undefined ? Messages.messages.length : Messages.count

            return Messages
        })
    }

    globalSearch(q, {offsetId, filter, limit = 33}) {
        // todo: implement
    }

    loadRecent() {
        // todo: implement
    }
}

const SearchManager = new SearchManagerSingleton()

export default SearchManager