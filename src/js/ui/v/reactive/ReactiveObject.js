export class ReactiveObject {

    /**
     * @type {Set<function(object: self, event: *)>}
     * @private
     */
    #subscribers = new Set()

    /**
     * @param {function(object: self, event: *)} resolve
     */
    subscribe(resolve) {
        this.#subscribers.add(resolve)
    }

    /**
     * @param {function(object: self, event: *)} resolve
     */
    unsubscribe(resolve) {
        this.#subscribers.delete(resolve)
    }

    /**
     * @param {string} type
     * @param props
     */
    fire(type, props = {}) {
        this.#subscribers.forEach(subscriber => subscriber(this, Object.assign({
            type
        }, props)))
    }
}