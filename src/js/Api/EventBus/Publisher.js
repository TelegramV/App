import type {BusEvent} from "./EventBus"

export type Subscription = (event: BusEvent) => void | Function

export class Publisher<T: Subscription, E: BusEvent> {

    /**
     * @type {Set<function(event: BusEvent)>}
     * @protected
     */
    _subscriptions: Set<T> = new Set()


    /**
     * @param {function(event: BusEvent)} subscription
     */
    subscribe(subscription: T) {
        this._subscriptions.add(subscription)
    }

    /**
     * @param {function(event: BusEvent)} subscription
     */
    unsubscribe(subscription: T) {
        this._subscriptions.delete(subscription)
    }

    /**
     * @param {BusEvent} event
     */
    fire(event: E) {
        this._subscriptions.forEach(subscription => subscription(event))
    }
}