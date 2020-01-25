import AppEvents from "../../api/eventBus/AppEvents"
import ReactiveCallback from "../v/reactive/ReactiveCallback"

class ConnectionStatus {
    constructor() {
        this.OK = 0
        this.WAITING_FOR_NETTWORK = 1
        this.FETCHING_DIFFERENCE = 2

        this._nettworkOk = true
        this._differenceOk = true

        /**
         * @type {Set<*>}
         * @private
         */
        this._subscribers = new Set()

        /**
         * @type {Set<function(number)>}
         * @private
         */
        this._subscribers = new Set()

        this._reactive = ReactiveCallback(resolve => {
            this._subscribers.add(resolve)
            return this.Status
        }, resolve => {
            this._subscribers.delete(resolve)
        })


        AppEvents.General.subscribe("connectionRestored", event => {
            console.log("connectionRestored")
            this._nettworkOk = true

            this._subscribers.forEach(listener => {
                listener(this.Status)
            })
        })

        AppEvents.General.subscribe("connectionLost", event => {
            console.log("connectionLost")
            this._nettworkOk = false

            this._subscribers.forEach(listener => {
                listener(this.Status)
            })
        })

        AppEvents.General.subscribe("gotDifference", event => {
            this._differenceOk = true

            this._subscribers.forEach(listener => {
                listener(this.Status)
            })
        })

        AppEvents.General.subscribe("waitingForDifference", event => {
            this._differenceOk = false

            this._subscribers.forEach(listener => {
                listener(this.Status)
            })
        })
    }

    /**
     * @return {number}
     */
    get Status() {
        if (!this._nettworkOk) {
            return this.WAITING_FOR_NETTWORK
        }

        if (!this._differenceOk) {
            return this.FETCHING_DIFFERENCE
        }

        return this.OK
    }

    get Reactive() {
        return this._reactive
    }
}

const AppConnectionStatus = new ConnectionStatus()

export default AppConnectionStatus