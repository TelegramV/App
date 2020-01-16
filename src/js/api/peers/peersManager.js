import {arrayDelete} from "../../common/utils/utils"
import {Peer} from "../dataObjects/peer/peer";
import {Manager} from "../manager";
import PeersStore from "../store/peersStore"
import AppEvents from "../eventBus/appEvents"
import {MTProto} from "../../mtproto"
import {UserPeer} from "../dataObjects/peer/userPeer"
import {getPeerObject} from "../dataObjects/peerFactory"

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
        MTProto.UpdatesManager.listenUpdate("updateUserStatus", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer && peer instanceof UserPeer) {
                peer.raw.status = update.status

                AppEvents.Peers.fire("updateUserStatus", {
                    peer
                })
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


    set(peer) {
        if (peer instanceof Peer) {
            if (PeersStore.has(peer.type, peer.id)) {
                return false
            }

            PeersStore.set(peer)

            // peer.getAvatar().catch(l => {
            //     AppEvents.Peers.fire("updatePhoto", {
            //         peer: peer
            //     })
            // })

            if (this.peerInitListeners[peer.type] && this.peerInitListeners[peer.type][peer.id]) {
                this.peerInitListeners[peer.type][peer.id].forEach(listener => {
                    listener(peer)
                    arrayDelete(this.peerInitListeners[peer.type][peer.id], listener)
                })
            }

            return true


            // this.resolveListeners({
            //     type: "set",
            // })
        }
        throw new Error("Not a peer object!")
    }

    setFromRaw(rawPeer) {
        let peer = PeersStore.get(rawPeer._, rawPeer.id)

        if (peer) {
            peer.fillRaw(rawPeer)
            return peer
        } else {
            peer = getPeerObject(rawPeer)
            PeersStore.set(peer)
        }

        return peer
    }

    setFromRawAndFire(rawPeer) {
        let peer = PeersStore.get(rawPeer._, rawPeer.id)

        if (peer) {
            peer.fillRawAndFire(rawPeer)
            return peer
        } else {
            peer = getPeerObject(rawPeer)
            PeersStore.set(peer)

            AppEvents.Peers.fire("updateSingle", {
                peer
            })
        }

        return peer
    }
}

const PeersManager = new PeerManager()

export default PeersManager