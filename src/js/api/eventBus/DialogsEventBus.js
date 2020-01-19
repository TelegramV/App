import {EventBus} from "./index"

export class DialogsEventBus extends EventBus {
    constructor(props) {
        super(props)

        /**
         * @type {Map<Dialog, Set<function(*)>>}
         * @private
         */
        this._singleSubscribers = new Map()
    }

    fire(type, event) {
        if (event.dialog && this._singleSubscribers.has(event.dialog)) {
            this._singleSubscribers
                .get(event.dialog)
                .forEach(s => s({
                    type,
                    ...event
                }))
        }

        super.fire(type, event)
    }

    /**
     * @param {Dialog} dialog
     * @param {function(Dialog)} callback
     */
    subscribeAnySingle(dialog, callback) {
        if (!this._singleSubscribers.has(dialog)) {
            this._singleSubscribers.set(dialog, new Set())
        }

        this._singleSubscribers.get(dialog).add(callback)
    }
}