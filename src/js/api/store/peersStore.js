import MappedStore from "./MappedStore"
import {PeerAPI} from "../peerAPI"
import MTProto from "../../mtproto"

/**
 * @property {Map<string, Map<number, Peer>>} _data
 */
class PeersMapStore extends MappedStore {
    constructor() {
        super({
            initialData: new Map([
                ["chat", new Map()],
                ["channel", new Map()],
                ["user", new Map()],
            ])
        })

        this._self = undefined
    }

    /**
     * @return {Map<string, Map<number, Peer>>}
     */
    get data() {
        return super.data
    }

    /**
     * @return {Peer}
     */
    self() {
        if (!this._self) {
            this._self = this.get("user", MTProto.getAuthorizedUser().user.id)
        }

        return this._self
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {Peer|boolean}
     */
    get(type, id) {
        if (this.data.has(type)) {
            return this.data.get(type).get(id) || false
        } else {
            return false
        }
    }

    /**
     * @param {Object} dialogRawPeer
     * @return {Peer|boolean}
     */
    getFromDialogRawPeer(dialogRawPeer) {
        const plain = PeerAPI.getPlain(dialogRawPeer, false)

        if (this.data.has(plain._)) {
            return this.data.get(plain._).get(plain.id)
        } else {
            return false
        }
    }

    /**
     * @param {Peer} peer
     * @return {this}
     */
    set(peer) {
        if (this.data.has(peer.type)) {
            this.data.get(peer.type).set(peer.id, peer)
            return this
        } else {
            console.error("invalid peer type", peer)
            return this
        }
    }

    /**
     * @param {Array<Peer>} peers
     * @return {this}
     */
    setMany(peers) {
        for (const peer of peers) {
            this.set(peer)
        }

        return this
    }

    /**
     * @param {string} username
     * @return {Peer|false}
     */
    getByUsername(username) {
        return this.find(peer => peer.username === username)
    }

    /**
     * @param {function(peer: Peer): boolean} predicate
     * @return {Peer|boolean}
     */
    find(predicate) {
        for (const [_, data] of this.data.entries()) {
            for (const [_, peer] of data.entries()) {
                if (predicate(peer)) {
                    return peer
                }
            }
        }

        return false
    }

    /**
     * @param {string} type
     * @param {function(peer: Peer): boolean} predicate
     * @return {Peer|boolean}
     */
    findWithType(type, predicate) {
        if (this.data.has(type)) {
            for (const [_, peer] of this.data.get(type).entries()) {
                if (predicate(peer)) {
                    return peer
                }
            }
        } else {
            console.error("invalid peer type", type)
        }

        return false
    }

    /**
     * @param {string} type
     * @param {number} id
     * @return {boolean}
     */
    has(type, id) {
        if (!this.data.has(type)) {
            return false
        }

        return this.data.get(type).has(id)
    }
}

const PeersStore = new PeersMapStore()

export default PeersStore