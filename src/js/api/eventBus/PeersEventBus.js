import {EventBus} from "./index"

export class PeersEventBus extends EventBus {
    constructor(props) {
        super(props)

        /**
         * @type {Map<Peer, Set<function(*)>>}
         * @private
         */
        this._singleSubscribers = new Map()
    }

    fire(type, event) {
        if (event.peer && this._singleSubscribers.has(event.peer)) {
            this._singleSubscribers
                .get(event.peer)
                .forEach(s => s({
                    type,
                    ...event
                }))
        }

        super.fire(type, event)
    }

    /**
     * @param {Peer} peer
     * @param {function(Peer)} callback
     */
    subscribeAnySingle(peer, callback) {
        if (!this._singleSubscribers.has(peer)) {
            this._singleSubscribers.set(peer, new Set())
        }

        this._singleSubscribers.get(peer).add(callback)
    }
}