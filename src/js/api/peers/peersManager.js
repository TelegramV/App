import {Manager} from "../manager";
import PeersStore from "../store/peersStore"
import AppEvents from "../eventBus/appEvents"
import {MTProto} from "../../mtproto"
import {UserPeer} from "../dataObjects/peer/userPeer"
import PeerFactory from "../dataObjects/peerFactory"
import {PeerPhoto} from "../dataObjects/peer/peerPhoto";

class PeerManager extends Manager {
    constructor() {
        super()
        this.peerInitListeners = {
            user: {},
            chat: {},
            channel: {}
        }
    }

    init() {
        MTProto.UpdatesManager.subscribe("updateUserStatus", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.raw.status = update.status

                AppEvents.Peers.fire("updateUserStatus", {
                    peer
                })
            }
        })
        MTProto.UpdatesManager.subscribe("updateUserPhoto", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.photo = PeerPhoto.createEmpty(peer)
                peer.photo.fillRaw(update.photo)
            }
        })
    }

    listenPeerInit(peerName, peerId, listener) {
        if (!this.peerInitListeners[peerName]) {
            this.peerInitListeners[peerName] = {}
        }

        peerId = parseInt(peerId)

        if (!this.peerInitListeners[peerName][peerId]) {
            this.peerInitListeners[peerName][peerId] = []
        }

        if (PeersStore.get(peerName, peerId)) {
            listener(PeersStore.get(peerName, peerId))
        } else {
            this.peerInitListeners[peerName][peerId].push(listener)
        }
    }

    setFromRaw(rawPeer) {
        if (PeersStore.has(rawPeer._, rawPeer.id)) {
            const peer = PeersStore.get(rawPeer._, rawPeer.id)
            peer.fillRaw(rawPeer)
            return peer
        } else {
            const peer = PeerFactory.fromRaw(rawPeer)
            PeersStore.set(peer)
            return peer
        }
    }

    setFromRawAndFire(rawPeer) {
        if (PeersStore.has(rawPeer._, rawPeer.id)) {
            const peer = PeersStore.get(rawPeer._, rawPeer.id)
            peer.fillRawAndFire(rawPeer)
            return peer
        } else {
            const peer = PeerFactory.fromRaw(rawPeer)
            PeersStore.set(peer)

            AppEvents.Peers.fire("updateSingle", {
                peer
            })

            return peer
        }
    }
}

const PeersManager = new PeerManager()

export default PeersManager