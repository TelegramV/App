import {arrayDelete} from "../../common/utils/utils"
import {FileAPI} from "../fileAPI"
import {getInputPeerFromPeer, getPeerName, getPeersInput} from "../dialogs/util"
import {MTProto} from "../../mtproto"
import {Peer} from "../../dataObjects/peer";
import {Manager} from "../manager";
import {createLogger} from "../../common/logger";
import {getPeerObject} from "../../dataObjects/peerFactory";

const Logger = createLogger("PeerManager")

export class PeerManager extends Manager {
    constructor() {
        super()
        this.peers = {
            user: {},
            chat: {},
            channel: {}
        }
        this.peerInitListeners = {
            user: {},
            chat: {},
            channel: {}
        }
    }

    find(name, id) {
        return this.peers[name][id]
    }

    findByPeer(peer) {
        if(peer instanceof Peer) return peer

        const keys = {
            peerUser: "user",
            peerChannel: "channel",
            peerChat: "chat"
        }
        const key = keys[peer._]
        const keysId = {
            peerUser: "user_id",
            peerChannel: "channel_id",
            peerChat: "chat_id"
        }
        const keyId = keysId[peer._]
        return this.find(key, peer[keyId])
    }

    listenPeerInit(peerName, peerId, listener) {
        if (!this.peerInitListeners[peerName]) {
            this.peerInitListeners[peerName] = {}
        }

        peerId = Number(peerId)

        if (!this.peerInitListeners[peerName][peerId]) {
            this.peerInitListeners[peerName][peerId] = []
        }

        if (this.peers[peerName][peerId]) {
            listener(this.peers[peerName][peerId])
        } else {
            this.peerInitListeners[peerName][peerId].push(listener)
        }
    }


    set(peer) {
        if (peer instanceof Peer) {
            if (!this.peers[peer.type]) {
                this.peers[peer.type] = {}
            }

            peer.getAvatar().catch(l => {
                this.resolveListeners({
                    type: "updatePhoto",
                    peer: peer
                })
            })

            this.peers[peer.type][peer.id] = peer

            if (this.peerInitListeners[peer.type] && this.peerInitListeners[peer.type][peer.id]) {
                this.peerInitListeners[peer.type][peer.id].forEach(listener => {
                    listener(peer)
                    arrayDelete(this.peerInitListeners[peer.type][peer.id], listener)
                })
            }


            // this.resolveListeners({
            //     type: "set",
            // })
        }
    }
}

export default new PeerManager()
/*
const $peerInitListeners = {
    user: {},
    chat: {},
    channel: {}
}

let __inited = false

function listenPeerInit(peerName, peerId, listener) {
    if (!$peerInitListeners[peerName]) {
        $peerInitListeners[peerName] = {}
    }

    peerId = Number(peerId)

    if (!$peerInitListeners[peerName][peerId]) {
        $peerInitListeners[peerName][peerId] = []
    }

    if (this.peers[peerName][peerId]) {
        listener(this.peers[peerName][peerId])
    } else {
        $peerInitListeners[peerName][peerId].push(listener)
    }
}



function updateOnline(peer, online, props = {}) {
    if (find(peer._, peer.id)) {
        this.peers[name][id][key].online = online

        resolveListeners({
            type: "updateOnline",
        })
    } else {
        console.warn("peer wasn't found", name, id)
    }
}

function updateSingle(name, id, data, props = {}) {
    if (find(name, id)) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this.peers[name][id][key] = data[key]
            }
        }

        resolveListeners({
            type: "updateSingle",
        })
    } else {
        console.warn("peer wasn't found", name, id)
    }
}

function getPeers() {
    return this.peers
}

function init() {
    if (!__inited) {
        __inited = true
    } else {
        console.warn("PeersManager already inited")
        return
    }

    MTProto.MessageProcessor.listenUpdateShort(update => {
        // console.log(update)
        // switch (update._) {
        //     case "updateUserStatus":
        //         const status = message.status
        //         console.log(update)
        //         break
        // }
    })
}
*/