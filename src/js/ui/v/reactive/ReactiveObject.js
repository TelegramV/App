type ReactiveObjectSubscriber = (object: this, event: any) => any

export class ReactiveObject {

    /**
     * @type {Set<function(object: self, event: *)>}
     * @private
     */
    #subscribers: Set<ReactiveObjectSubscriber> = new Set()

    /**
     * @param {function(object: self, event: *)} resolve
     */
    subscribe(resolve: ReactiveObjectSubscriber) {
        this.#subscribers.add(resolve)
    }

    /**
     * @param {function(object: self, event: *)} resolve
     */
    unsubscribe(resolve: ReactiveObjectSubscriber) {
        this.#subscribers.delete(resolve)
    }

    /**
     * @param {string} type
     * @param props
     */
    fire(type: string, props: Object = {}) {
        this.#subscribers.forEach(subscriber => subscriber(this, Object.assign({
            type
        }, props)))
    }
}