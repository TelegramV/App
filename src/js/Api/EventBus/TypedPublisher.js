import type {BusEvent} from "./EventBus"

export type TypedSubscription = (event: BusEvent) => void

/**
 * WARNING: type `*` is reserved.
 */
export class TypedPublisher<T: TypedSubscription | Function> {

    /**
     * @type {Map<string, Set<T>>}
     * @private
     */
    _subscriptions: Map<any, Set<T>> = new Map([
        ["*", new Set()]
    ])

    /**
     * @param type
     * @param {function(event: BusEvent)} subscription
     */
    subscribe(type: any, subscription: T) {
        if (!this._subscriptions.has(type)) {
            this._subscriptions.set(type, new Set())
        }

        this._subscriptions.get(type).add(subscription)
    }

    /**
     * @param {function(event: BusEvent)} subscription
     */
    subscribeAny(subscription: T) {
        this._subscriptions.get("*").add(subscription)
    }

    /**
     * @param type
     * @param {function(event: BusEvent)} subscription
     */
    unsubscribe(type: any, subscription: T) {
        this._subscriptions.get("*").delete(subscription)

        if (this._subscriptions.has(type)) {
            this._subscriptions.get(type).delete(subscription)
        }
    }

    /**
     * @param type
     * @param {BusEvent} event
     */
    fire(type: any, event: BusEvent = {}) {

        Object.assign(event, {
            type
        })

        this._subscriptions.get("*").forEach(subscription => subscription(event))

        if (this._subscriptions.has(type)) {
            this._subscriptions.get(type).forEach(subscription => subscription(event))
        }
    }
}