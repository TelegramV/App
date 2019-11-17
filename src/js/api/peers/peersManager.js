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

        $peers[peer._][peer.id] = peer

        if (peer.photo) {
            let a = peer.photo.photo_small
            FileAPI.getPeerPhoto(a, peer.photo.dc_id, peer, false).then(url => {
                $peers[peer._][peer.id]["photo"] = url
                resolveListeners({
                    type: "updatePhoto",
                })
            })
        }


        $peers[peer._][peer.id].photoPlaceholder = {
            num: Math.abs(peer.id) % 8,
            text: getPeerName(peer)[0]
        }

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

function updateOnline(peer, online, props = {}) {
    if (find(peer._, peer.id)) {
        $peers[name][id][key].online = online

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

    MTProto.MessageProcessor.listenUpdateShort(update => {
        switch (update._) {
            case "updateUserStatus":
                const status = message.status
                console.log(update)
                break
        }
    })
}

export const PeersManager = {
    listenUpdates,
    listenPeerInit,
    set,
    getPeers,
    find,
    init
}

export default PeersManager
