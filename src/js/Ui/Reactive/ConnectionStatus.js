import AppEvents from "../../Api/EventBus/AppEvents"
import UIEvents from "../EventBus/UIEvents"

class ConnectionStatus {
    OK = 0
    WAITING_FOR_NETWORK = 1
    FETCHING_DIFFERENCE = 2
    CONNECTING = 3

    constructor() {
        this._networkOk = true
        this._differenceOk = true
        this._connectionOk = true

        window.addEventListener("offline", () => {
            this._networkOk = false

            console.warn("network lost")
            this.fire(this.Status)
        })

        window.addEventListener("online", () => {
            this._networkOk = true

            console.warn("network lost")
            this.fire(this.Status)
        })

        AppEvents.General.subscribe("connectionRestored", event => {
            console.log("connectionRestored")
            this._connectionOk = true

            this.fire(this.Status)
        })

        AppEvents.General.subscribe("connectionLost", event => {
            console.log("connectionLost")
            this._connectionOk = false

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
        if (!this._networkOk) {
            return this.WAITING_FOR_NETWORK
        }

        if (!this._connectionOk) {
            return this.CONNECTING
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