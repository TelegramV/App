import {EventBus} from "./index"
import ReactiveEvent from "../../ui/framework/reactive/reactiveEvent"

export class PeersEventBus extends EventBus {
    constructor(props) {
        super(props)

        /**
         * @type {Map<Peer, Set<function(*)>>}
         * @private
         */
        this._singleSubscribers = new Map()

        /**
         * @type {Map<Peer, Set<function(EventBus, *)>>}
         * @private
         */
        this._reactiveSingleAnySubscribers = new Map()

        /**
         * @type {Map<Peer, Map<string, Set<function(EventBus, *)>>>}
         * @private
         */
        this._reactiveSingleSubscribers = new Map()
    }

    fire(type, event) {
        if (event.peer) {
            if (this._singleSubscribers.has(event.peer)) {
                this._singleSubscribers
                    .get(event.peer)
                    .forEach(s => s({
                        type,
                        ...event
                    }))
            }

            if (this._reactiveSingleAnySubscribers.has(event.peer)) {
                this._reactiveSingleAnySubscribers
                    .get(event.peer)
                    .forEach(s => s(this, {
                        __any: true,
                        type,
                        ...event
                    }))
            }

            if (this._reactiveSingleSubscribers.has(event.peer)) {
                const types = this._reactiveSingleSubscribers.get(event.peer)

                if (types.has(type)) {
                    types.get(type)
                        .forEach(s => s(this, {
                            type,
                            ...event
                        }))
                }
            }
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

    /**
     * @param {Peer} peer
     * @return {{Default: *, FireOnly: *, PatchOnly: *}}
     */
    reactiveAnySingle(peer) {
        return ReactiveEvent(this, resolve => {
            if (!this._reactiveSingleAnySubscribers.has(peer)) {
                this._reactiveSingleAnySubscribers.set(peer, new Set())
            }

            this._reactiveSingleAnySubscribers.get(peer).add(resolve)

            return "*"
        }, resolve => {
            if (this._reactiveSingleAnySubscribers.has(peer)) {
                this._reactiveSingleAnySubscribers.get(peer).delete(resolve)
            } else {
                console.error("BUG: peer reactiveAnySingle")
            }
        })
    }

    /**
     * PYZDEC
     *
     * @param {Peer} peer
     * @param {string} eventType
     * @return {{Default: *, FireOnly: *, PatchOnly: *}}
     */
    reactiveOnlySingle(peer, eventType) {
        return ReactiveEvent(this, resolve => {
            let subscriberTypes = this._reactiveSingleSubscribers.get(peer)

            if (!subscriberTypes) {
                subscriberTypes = this._reactiveSingleSubscribers.set(peer, new Map()).get(peer)

                subscriberTypes.set(eventType, new Set()).get(eventType).add(resolve)

            } else if (!subscriberTypes.has(eventType)) {
                subscriberTypes.set(eventType, new Set()).get(eventType).add(resolve)
            } else {
                subscriberTypes.get(eventType).add(resolve)
            }

            return eventType
        }, resolve => {
            if (this._reactiveSingleSubscribers.has(peer)) {
                let subscriberTypes = this._reactiveSingleSubscribers.get(peer)

                if (subscriberTypes.has(eventType)) {
                    subscriberTypes.get(eventType).delete(resolve)
                } else {
                    console.error("BUG: peer reactiveOnlySingle no type")
                }

            } else {
                console.error("BUG: reactiveOnlySingle no peer")
            }
        })
    }
}