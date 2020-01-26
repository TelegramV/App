// @flow

export type Event = {
    type: string,
    [string]: any,
}

/**
 * Simple Event Bus class
 */
export class EventBus {

    subscribers: Map<string, Set<(Event | Object) => any>> = new Map()
    subscribersAny: Set<(Event | Object) => any> = new Set()

    /**
     * @param {string} type
     * @param props
     */
    fire(type: string, props: Object) {
        const subscribers = this.subscribers.get(type)

        const event: Event = {type, ...props}

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
    subscribe(type: string, callback: Event => any) {
        let subscribers = this.subscribers.get(type)

        if (!subscribers) {
            this.subscribers.set(type, new Set())
            subscribers = this.subscribers.get(type)
        }

        // $FlowFixMe
        subscribers.add(callback)
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
    subscribeAny(callback: (Event | Object) => any) {
        this.subscribersAny.add(callback)
    }
}