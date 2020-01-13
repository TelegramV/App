/**
 * Simple Event Bus class
 */
export class EventBus {
    constructor() {
        /**
         * @type {Map<string, Array<Function>>}
         */
        this.listeners = new Map()
    }

    /**
     * @param {string} type
     * @param {any} event
     */
    fire(type, event) {
        const listeners = this.listeners.get(type)

        if (listeners) {
            for (const listener of listeners) {
                listener(event)
            }
        }
    }

    /**
     * @param {string} type
     * @param {Function} callback
     */
    listen(type, callback) {
        let listeners = this.listeners.get(type)

        if (!listeners) {
            this.listeners.set(type, [])
            listeners = this.listeners.get(type)
        }

        listeners.push(callback)
    }
}