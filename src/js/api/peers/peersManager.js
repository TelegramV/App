import {arrayDelete} from "../../common/utils/utils"
import {FileAPI} from "../fileAPI"
import {getPeerName} from "../dialogs/util"
import {MTProto} from "../../mtproto"

const $peers = {
    user: {},
    chat: {},
    channel: {}
}
const $listeners = []
const $peerInitListeners = {
    user: {},
    chat: {},
    channel: {}
}

let __inited = false

function resolveListeners(event) {
    if (event) {
        $listeners.forEach(listener => {
            listener(event)
        })
    } else {
        console.warn("invalid event", event)
    }
}

function listenUpdates(listener) {
    if (listener && typeof listener === "function") {
        $listeners.push(listener)
    }
}

function listenPeerInit(peerName, peerId, listener) {
    if (!$peerInitListeners[peerName]) {
        $peerInitListeners[peerName] = {}
    }

    peerId = Number(peerId)

    if (!$peerInitListeners[peerName][peerId]) {
        $peerInitListeners[peerName][peerId] = []
    }

    if ($peers[peerName][peerId]) {
        listener($peers[peerName][peerId])
    } else {
        $peerInitListeners[peerName][peerId].push(listener)
    }
}

function set(peer) {
    if (peer._) {
        if (!$peers[peer._]) {
            $peers[peer._] = {}
        }

        peer.photoPlaceholder = {
            num: Math.abs(peer.id) % 8,
            text: getPeerName(peer)[0]
        }

        if (peer.photo) {
            let a = peer.photo.photo_small
            let dcid = peer.photo.dc_id

            const pfstorage = find(peer._, peer.id)

            if (pfstorage && pfstorage.photo) {
                peer.photo = pfstorage.photo
            } else {
                peer.photo = false
            }

            FileAPI.getPeerPhoto(a, dcid, peer, false).then(url => {
                $peers[peer._][peer.id]["photo"] = url
                resolveListeners({
                    type: "updatePhoto",
                    peer: peer
                })
            }).catch(() => {
                $peers[peer._][peer.id]["photo"] = false
                resolveListeners({
                    type: "updatePhoto",
                    peer: peer
                })
            })
        }

        $peers[peer._][peer.id] = peer

        if ($peerInitListeners[peer._] && $peerInitListeners[peer._][peer.id]) {
            $peerInitListeners[peer._][peer.id].forEach(listener => {
                listener(peer)
                arrayDelete($peerInitListeners[peer._][peer.id], listener)
            })
        }


        resolveListeners({
            type: "set",
        })
    }
}

function find(name, id) {
    if (!$peers[name]) {
        return null
    }

    return $peers[name][id]
}


function findObj(peer) {
    return find(peer._, peer.id)
}

function updateOnline(peer, online, props = {}) {
    if (find(peer._, peer.id)) {
        $peers[peer._][peer.id].status = online

        resolveListeners({
            type: "updateOnline",
            peer: peer,
            status: online
        })
    } else {
        console.warn("peer wasn't found", name)
    }
}

function updateSingle(name, id, data, props = {}) {
    if (find(name, id)) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                $peers[name][id][key] = data[key]
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
    return $peers
}

function init() {
    if (!__inited) {
        __inited = true
    } else {
        console.warn("PeersManager already inited")
        return
    }

    MTProto.MessageProcessor.listenUpdateShort(({update}) => {
        if (update._ === "updateUserStatus") {
            updateOnline({_: "user", id: update.user_id}, update.status)
        }
    })
}

export const PeersManager = {
    listenUpdates,
    listenPeerInit,
    set,
    getPeers,
    find,
    findObj,
    init
}

export default PeersManager
