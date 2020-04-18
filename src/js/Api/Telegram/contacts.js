import MTProto from "../../MTProto/External"
import PeersManager from "../Peers/Objects/PeersManager"

const getTopPeers = (params = {}) => {
    return MTProto.invokeMethod("contacts.getTopPeers", params).then(TopPeers => {
        PeersManager.fillPeersFromUpdate(TopPeers)

        return TopPeers
    })
}

const contacts = {
    getTopPeers: getTopPeers
}

export default contacts