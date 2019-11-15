const $peers = []
const $listeners = []

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

function push(peer) {
    $peers.push(peer)
    resolveListeners({
        type: "push",
    })
}

function find(name, id) {
    return $peers.find(peer => peer._ === name && peer.id === Number(id))
}

function updateSingle(name, id, data, props = {}) {
    const peerIndex = $peers.findIndex(peer => peer._ === name && peer.id === id)

    if (peerIndex >= 0) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                $peers[peerIndex][key] = data[key]
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

export const PeersManager = {
    listenUpdates,
    push,
    getPeers,
    find
}

export default PeersManager
