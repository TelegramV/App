import ComponentReactive from "../framework/reactive/componentReactive"

class ConnectionStatus {
    constructor() {
        this._status = true

        /**
         * @type {Set<*>}
         * @private
         */
        this._subscribers = new Set()

        /**
         * @type {Set<Component>}
         * @private
         */
        this._componentSubscribers = new Set()

        this._componentReactive = ComponentReactive(component => {
            this._componentSubscribers.add(component)
            return this._status
        }, component => {
            this._componentSubscribers.delete(component)
        })
    }

    /**
     * @return {boolean}
     */
    get Status() {
        return this._status
    }

    /**
     * @param status
     */
    set Status(status) {
        this._status = status
        this._subscribers.forEach(s => s(status))
    }

    get ComponentReactive() {
        return this._componentReactive
    }
}

const AppConnectionStatus = new ConnectionStatus()

export default AppConnectionStatus