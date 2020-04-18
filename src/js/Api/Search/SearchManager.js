import {MTProto} from "../../MTProto/External"
import PeersManager from "../Peers/Objects/PeersManager"
import {Manager} from "../Manager"
import API from "../Telegram/API"
import PeersStore from "../Store/PeersStore"
import {SearchMessage} from "../Messages/SearchMessage"

class SearchManagerSingleton extends Manager {

    searchMessages(peer, {offsetId, filter, limit = 33, q = ""}) {
        return MTProto.invokeMethod("messages.search", {
            peer: peer.inputPeer,
            q: q,
            filter: filter || {
                _: "inputMessagesFilterEmpty"
            },
            limit: limit,
            offset_id: offsetId
        }).then(Messages => {
            Messages.__q = q

            if (Messages._ === "messages.channelMessages" && peer.dialog) {
                peer.dialog.pts = Messages.pts
            }

            Messages._peer = peer

            PeersManager.fillPeersFromUpdate(Messages)

            Messages.current_count = Messages.messages.length

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