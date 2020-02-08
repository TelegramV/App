import {MTProto} from "../../mtproto/external"
import PeersManager from "../peers/objects/PeersManager"
import {Manager} from "../manager"
import API from "../telegram/API"
import PeersStore from "../store/PeersStore"
import {SearchMessage} from "../messages/SearchMessage"

class SearchManagerSingleton extends Manager {

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

    globalSearch(q: string, {offsetId, offsetRate, limit = 33}) {
        return API.messages.searchGlobal({
            q,
            limit,
            offsetId,
            offsetRate
        }).then(Messages => {
            Messages.__q = q

            Messages.messages = Messages.messages.map(Message => (new SearchMessage(undefined)).fillRaw(Message))
            Messages.count = Messages.count === undefined ? Messages.messages.length : Messages.count

            return Messages
        })
    }

    searchContactsByUsername(q, limit = 20) {
        return MTProto.invokeMethod("contacts.search", {
            q,
            limit
        }).then(Found => {
            Found.__q = q
            PeersManager.fillPeersFromUpdate(Found)
            Found.peers = Found.results.map(Peer => PeersStore.getByPeerType(Peer))
            Found.myPeers = Found.my_results.map(Peer => PeersStore.getByPeerType(Peer))
            return Found
        })
    }
}

const SearchManager = new SearchManagerSingleton()

export default SearchManager