import AppEvents from "../../Api/EventBus/AppEvents"
import UIEvents from "../EventBus/UIEvents"

class ConnectionStatus {
    constructor() {
        this.OK = 0
        this.WAITING_FOR_NETTWORK = 1
        this.FETCHING_DIFFERENCE = 2

        this._nettworkOk = true
        this._differenceOk = true

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

    fire(Status) {
        UIEvents.General.fire("connection", {
            Status
        })
    }
}

const AppConnectionStatus = new ConnectionStatus()

export default AppConnectionStatus