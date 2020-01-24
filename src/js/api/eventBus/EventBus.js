/**
 * Simple Event Bus class
 */
export class EventBus {
    constructor() {
        /**
         * @type {Map<string, Array<function()>>}
         */
        this._subscribers = new Map()

        /**
         * @type {Set<function(*)>}
         */
        this._subscribersAny = new Set()
    }

    /**
     * @param {string} type
     * @param {*} event
     */
    fire(type, event = {}) {
        const subscribers = this._subscribers.get(type)

        event = {
            type,
            ...event
        }

        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber(event)
            }
        }

        for (const subscriber of this._subscribersAny) {
            subscriber(event)
        }
    }

    /**
     * @param {string} type
     * @param {Function} callback
     */
    subscribe(type, callback) {
        let subscribers = this._subscribers.get(type)

        if (!subscribers) {
            this._subscribers.set(type, [])
            subscribers = this._subscribers.get(type)
        }

        subscribers.push(callback)
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
    subscribeAny(callback) {
        this._subscribersAny.add(callback)
    }
}