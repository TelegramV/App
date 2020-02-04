export type BusEvent = {
    type: string,
    bus: EventBus,
    [string]: any,
}

/**
 * Simple BusEvent Bus class
 */
export class EventBus {

    subscribers: Map<string, Set<(BusEvent | Object) => any>> = new Map()
    subscribersAny: Set<(BusEvent | Object) => any> = new Set()

    /**
     * @param {string} type
     * @param props
     */
    fire(type: string, props: Object) {
        const subscribers = this.subscribers.get(type)

        const event: BusEvent = {type, ...props, bus: this}

        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber(event)
            }
        }

        for (const subscriber of this.subscribersAny) {
            subscriber(event)
        }
    }

    /**
     * @param {string} type
     * @param {Function} callback
     */
    subscribe(type: string, callback: BusEvent => any) {
        let subscribers = this.subscribers.get(type)

        if (!subscribers) {
            this.subscribers.set(type, new Set())
            subscribers = this.subscribers.get(type)
        }

        subscribers.add(callback)
    }

    /**
     * @param type
     * @param {function(event: BusEvent)} subscription
     */
    unsubscribe(type: any, subscription: BusEvent => any) {
        this.subscribersAny.delete(subscription)

        if (this.subscribers.has(type)) {
            this.subscribers.get(type).delete(subscription)
        }
    }

    /**
     * @param {function({
     *     type: string,
     *     peer: Peer,
     *     dialog: Dialog,
     *     message: Message,
     *     messages: Message[],
     * })} callback
     */
    subscribeAny(callback: (BusEvent | Object) => any) {
        this.subscribersAny.add(callback)
    }

    condition(condition, type: string, callback: BusEvent => any) {
        console.error(this, `[${type}] -> [${condition}] conditions are not implemented`)
    }
}