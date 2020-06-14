import TypedPublisher from "./TypedPublisher"

export type BusEvent = {
    type: string,
    bus: EventBus,
    [string]: any,
}

/**
 * Simple Event Bus class
 */
export class EventBus extends TypedPublisher {

    /**
     * @type {Map<string, Map<function, function>>}
     * @private
     */
    _conditionalSubscriptions = new Map()

    fire(type: any, event: BusEvent = {}) {
        super.fire(type, event)

        if (this._conditionalSubscriptions.has(type)) {
            this._conditionalSubscriptions.get(type)
                .forEach((v, k) => {
                    if (v(event)) {
                        k(event)
                    }
                })
        }
    }

    /**
     * @param type
     * @param {function(event: BusEvent)} subscription
     */
    unsubscribe(type: any, subscription) {
        super.unsubscribe(type, subscription)

        if (this._conditionalSubscriptions.has(type)) {
            this._conditionalSubscriptions.get(type).delete(subscription)
        }
    }

    /**
     * @param {function({
     *     type: string,
     *     peer: Peer,
     *     dialog: Dialog,
     *     message: Message,
     *     messages: Message[],
     * })} subscription
     */
    subscribeAny(subscription) {
        super.subscribeAny(subscription)
    }

    withFilter(condition, type: string, subscription: BusEvent => any) {
        if (!this._conditionalSubscriptions.has(type)) {
            this._conditionalSubscriptions.set(type, new Map())
        }

        this._conditionalSubscriptions.get(type).set(subscription, condition)
    }
}