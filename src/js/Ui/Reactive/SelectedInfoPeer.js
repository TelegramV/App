import UIEvents from "../EventBus/UIEvents"

class SelectedInfoPeer {
    constructor() {
        /**
         * @type {undefined|Peer}
         * @private
         */
        this._peer = undefined

        /**
         * @type {undefined|Peer}
         * @private
         */
        this._previous = undefined
    }

    /**
     * @return {undefined|Peer}
     */
    get Current() {
        return this._peer
    }

    /**
     * @return {undefined|Peer}
     */
    get Previous() {
        return this._previous
    }

    /**
     * @param {Peer} peer
     */
    select(peer) {
        if (!peer) {
            return
        }

        console.log("waat", peer)

        this._previous = this._peer
        this._peer = peer

        UIEvents.General.fire("info.select", {
            peer
        })
    }

    /**
     * Checks whether the given peer is selected.
     *
     * Warning: it checks directly by `===`!
     *
     * @param {Peer} peer
     * @return {boolean}
     */
    check(peer) {
        if (!this.Current || !peer) {
            return false
        }

        return this.Current === peer || (this.Current.type === peer.type && this.Current.id === peer.id)
    }
}

const AppSelectedInfoPeer = new SelectedInfoPeer()

export default AppSelectedInfoPeer