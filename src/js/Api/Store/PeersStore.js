/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import MappedStore from "./MappedStore"
import {PeerParser} from "../Peers/PeerParser"
import MTProto from "../../MTProto/External"

/**
 * @property {Map<string, Map<number, Peer>>} _data
 */
class PeersMapStore extends MappedStore {
    constructor() {
        super({
            initialData: new Map([
                ["chat", new Map()],
                ["chatForbidden", new Map()],
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
            this._self = this.get("user", MTProto.getAuthorizedUserId())
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
    getByPeerType(dialogRawPeer) {
        const plain = PeerParser.getPlain(dialogRawPeer, false)

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
            this.fire("set", {peer})
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
     * @return {Array<Peer>}
     */
    toArray() {
        const array = []
        for (const [_, data] of this.data.entries()) {
            for (const [_, peer] of data.entries()) {
                array.push(peer)
            }
        }
        return array
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

    /**
     *
     * @param {function(peer: Peer)} subscription
     */
    onSet(subscription) {
        super.onSet(subscription)
    }
}

const PeersStore = new PeersMapStore()

export default PeersStore