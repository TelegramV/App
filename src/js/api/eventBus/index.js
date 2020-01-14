/**
 * Simple Event Bus class
 */
export class EventBus {
    constructor() {
        /**
         * @type {Map<string, Array<Function>>}
         */
        this._listeners = new Map()

        /**
         * @type {Array<Function>}
         */
        this._listenersAny = []
    }

    /**
     * @param {string} type
     * @param {*} event
     */
    fire(type, event) {
        const listeners = this._listeners.get(type)
        event = {
            type,
            ...event
        }

        if (listeners) {
            for (const listener of listeners) {
                listener(event)
            }
        }

        for (const listener of this._listenersAny) {
            listener(event)
        }
    }

    /**
     * @param {string} type
     * @param {Function} callback
     */
    listen(type, callback) {
        let listeners = this._listeners.get(type)

        if (!listeners) {
            this._listeners.set(type, [])
            listeners = this._listeners.get(type)
        }

        listeners.push(callback)
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
    listenAny(callback) {
        this._listenersAny.push(callback)
    }
}