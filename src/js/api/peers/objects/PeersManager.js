import {Manager} from "../../manager";
import PeersStore from "../../store/PeersStore"
import AppEvents from "../../eventBus/AppEvents"
import {MTProto} from "../../../mtproto/external"
import {UserPeer} from "./UserPeer"
import PeerFactory from "../PeerFactory"
import {tsNow} from "../../../mtproto/timeManager"

class PeerManager extends Manager {

    constructor() {
        super()
    }

    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        MTProto.UpdatesManager.subscribe("updateUserStatus", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.raw.status = update.status
                // peer.raw.status.expires = tsNow(true) + 2

                peer.fire("updateUserStatus")

                AppEvents.Peers.fire("updateUserStatus", {
                    peer
                })
            }
        })

        MTProto.UpdatesManager.subscribe("updateUserPhoto", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.photo.fillRaw(update.photo)
            }
        })

        this._inited = true
    }

    fillPeersFromUpdate(rawUpdate) {
        const data = {
            users: [],
            chats: [],
        }

        if (rawUpdate.users) {
            data.users = rawUpdate.users.map(rawUser => {
                return PeersManager.setFromRaw(rawUser)
            })
        }

        if (rawUpdate.chats) {
            data.chats = rawUpdate.chats.map(rawUser => {
                return PeersManager.setFromRaw(rawUser)
            })
        }

        return data
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