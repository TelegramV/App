import {EventBus} from "./EventBus"
import ReactiveEvent from "../../ui/v/reactive/ReactiveEvent"

export class DialogsEventBus extends EventBus {
    constructor(props) {
        super(props)

        /**
         * @type {Map<Dialog, Set<function(*)>>}
         * @private
         */
        this._singleAnySubscribers = new Map()

        /**
         * @type {Map<Dialog, Set<function(EventBus, *)>>}
         * @private
         */
        this._reactiveSingleAnySubscribers = new Map()

        /**
         * @type {Map<Dialog, Map<string, Set<function(EventBus, *)>>>}
         * @private
         */
        this._reactiveSingleSubscribers = new Map()
    }

    fire(type, event) {
        if (event.dialog) {
            if (this._singleAnySubscribers.has(event.dialog)) {
                this._singleAnySubscribers
                    .get(event.dialog)
                    .forEach(s => s({
                        type,
                        ...event,
                        bus: this
                    }))
            }

            if (this._reactiveSingleAnySubscribers.has(event.dialog)) {
                this._reactiveSingleAnySubscribers
                    .get(event.dialog)
                    .forEach(s => s(this, {
                        __any: true,
                        type,
                        ...event,
                        bus: this
                    }))
            }

            if (this._reactiveSingleSubscribers.has(event.dialog)) {
                const types = this._reactiveSingleSubscribers.get(event.dialog)

                if (types.has(type)) {
                    types.get(type)
                        .forEach(s => s(this, {
                            type,
                            ...event,
                            bus: this
                        }))
                }
            }
        }

        super.fire(type, event)
    }

    /**
     * @param {Dialog} dialog
     * @param {function(Dialog)} callback
     */
    subscribeAnySingle(dialog, callback) {
        this._singleAnySubscribers.get(dialog).add(callback)
    }

    /**
     * @param {Dialog} dialog
     * @return {{Default: *, FireOnly: *, PatchOnly: *}}
     */
    reactiveAnySingle(dialog) {
        return ReactiveEvent(this, resolve => {
            if (!this._reactiveSingleAnySubscribers.has(dialog)) {
                this._reactiveSingleAnySubscribers.set(dialog, new Set())
            }

            this._reactiveSingleAnySubscribers.get(dialog).add(resolve)

            return "*"
        }, resolve => {
            if (this._reactiveSingleAnySubscribers.has(dialog)) {
                this._reactiveSingleAnySubscribers.get(dialog).delete(resolve)
            } else {
                console.error("BUG: reactiveAnySingle")
            }
        })
    }

    /**
     * PYZDEC
     *
     * @param {Dialog} dialog
     * @param {string} eventType
     * @return {{Default: *, FireOnly: *, PatchOnly: *}}
     */
    reactiveOnlySingle(dialog, eventType) {
        return ReactiveEvent(this, resolve => {
            let subscriberTypes = this._reactiveSingleSubscribers.get(dialog)

            if (!subscriberTypes) {
                subscriberTypes = this._reactiveSingleSubscribers.set(dialog, new Map()).get(dialog)

                subscriberTypes.set(eventType, new Set()).get(eventType).add(resolve)

            } else if (!subscriberTypes.has(eventType)) {
                subscriberTypes.set(eventType, new Set()).get(eventType).add(resolve)
            } else {
                subscriberTypes.get(eventType).add(resolve)
            }

            return eventType
        }, resolve => {
            if (this._reactiveSingleSubscribers.has(dialog)) {
                let subscriberTypes = this._reactiveSingleSubscribers.get(dialog)

                if (subscriberTypes.has(eventType)) {
                    subscriberTypes.get(eventType).delete(resolve)
                } else {
                    console.error("BUG: reactiveOnlySingle no type")
                }

            } else {
                console.error("BUG: reactiveOnlySingle no dialog")
            }
        })
    }
}