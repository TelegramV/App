import AppEvents from "../../Api/EventBus/AppEvents"
import ReactiveCallback from "../../V/Reactive/ReactiveCallback"
import type {Subscription} from "../../Api/EventBus/Publisher"
import {Publisher} from "../../Api/EventBus/Publisher"

class ConnectionStatus extends Publisher<Subscription, number> {
    constructor() {
        super()

        this.OK = 0
        this.WAITING_FOR_NETTWORK = 1
        this.FETCHING_DIFFERENCE = 2

        this._nettworkOk = true
        this._differenceOk = true

        this._reactive = ReactiveCallback(subscription => {
            this.subscribe(subscription)
            return this.Status
        }, subscription => {
            this.unsubscribe(subscription)
        })


        AppEvents.General.subscribe("connectionRestored", event => {
            console.log("connectionRestored")
            this._nettworkOk = true

            this.fire(this.Status)
        })

        AppEvents.General.subscribe("connectionLost", event => {
            console.log("connectionLost")
            this._nettworkOk = false

            this.fire(this.Status)
        })

        AppEvents.General.subscribe("gotDifference", event => {
            this._differenceOk = true

            this.fire(this.Status)
        })

        AppEvents.General.subscribe("waitingForDifference", event => {
            this._differenceOk = false

            this.fire(this.Status)
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