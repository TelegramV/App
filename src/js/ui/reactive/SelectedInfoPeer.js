import ReactiveCallback from "../v/reactive/ReactiveCallback";

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

        /**
         * @type {Set<function(Peer)>}
         * @private
         */
        this._subscribers = new Set()

        /**
         * @type {{Default: Peer, FireOnly: Peer, PatchOnly: Peer}}
         * @private
         */
        this._Reactive = ReactiveCallback(resolve => {
            this.subscribe(resolve)
            return this._peer
        }, resolve => {
            this.unsubscribe(resolve)
        })
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
     * @return {{Default: Peer, FireOnly: Peer, PatchOnly: Peer}}
     * @constructor
     */
    get Reactive() {
        return this._Reactive
    }

    /**
     * @param {function(peer: Peer)} resolve
     */
    subscribe(resolve) {
        this._subscribers.add(resolve)
    }

    /**
     * @param {function(peer: Peer)} resolve
     */
    unsubscribe(resolve) {
        this._subscribers.delete(resolve)
    }

    /**
     * @param {Peer} peer
     */
    select(peer) {
        this._previous = this._peer
        this._peer = peer
        this._subscribers.forEach(listener => {
            listener(this._peer)
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