import type {BusEvent} from "./EventBus"
import {EventBus} from "./EventBus"
import ReactiveEvent from "../../ui/v/reactive/ReactiveEvent"

export class PeersEventBus extends EventBus {
    constructor(props) {
        super(props)

        /**
         * @type {Map<Peer, Map<string, Set<function(*)>>>}
         * @private
         */
        this._singleSubscribers = new Map()

        /**
         * @type {Set<function(EventBus, *)>}
         * @private
         */
        this._reactiveAnySubscribers = new Set()

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
                const single = this._singleSubscribers.get(event.peer)

                single.get("*").forEach(s => s({
                    type,
                    ...event,
                    bus: this
                }))

                if (single.has(type)) {
                    single.get(type).forEach(s => s({
                        type,
                        ...event,
                        bus: this
                    }))
                }

            }

            this._reactiveAnySubscribers
                .forEach(s => s(this, {
                    __any: true,
                    type,
                    ...event,
                    bus: this
                }))

            if (this._reactiveSingleAnySubscribers.has(event.peer)) {
                this._reactiveSingleAnySubscribers
                    .get(event.peer)
                    .forEach(s => s(this, {
                        __any: true,
                        type,
                        ...event,
                        bus: this
                    }))
            }

            if (this._reactiveSingleSubscribers.has(event.peer)) {
                const types = this._reactiveSingleSubscribers.get(event.peer)

                if (types.has(type)) {
                    types.get(type)
                        .forEach(s => s(this, {
                            type,
                            ...event,
                            bus: this
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
            this._singleSubscribers.set(peer, new Map([
                ["*", new Set()]
            ]))
        }

        this._singleSubscribers.get(peer).get("*").add(callback)
    }

    /**
     * @param {Peer} peer
     * @param type
     * @param {function(Peer)} callback
     */
    subscribeSingle(peer, type, callback) {
        let single = this._singleSubscribers.get(peer)

        if (!single) {
            single.set(peer, new Map([
                ["*", new Set()],
                [type, new Set()]
            ]))
        } else if (!single.has(type)) {
            single.set(type, new Set())
        }

        this._singleSubscribers.get(peer).get(type).add(callback)
    }

    /**
     * @return {{Default: *, FireOnly: *, PatchOnly: *}}
     *
     * @deprecated
     */
    reactiveAny() {
        return ReactiveEvent(this, resolve => {
            this._reactiveAnySubscribers.add(resolve)

            return "*"
        }, resolve => {
            this._reactiveAnySubscribers.delete(resolve)
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

    condition(condition, type: string, callback: BusEvent => any) {
        this.subscribeSingle(condition, type, callback)
    }
}