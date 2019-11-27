import {createLogger} from "../logger"

const Logger = createLogger("PermanentStorage", {
    level: "log"
})

/**
 * Data stored in this storage has no expiration time.
 *
 * TODO: mb we should make all methods async..
 *
 * The `driver` must implement following methods:
 * - `getItem(key)`
 * - `setItem(key, value)
 * - `removeItem(key, value)
 * - `exists(key)`
 * - `clear()`
 */
export class PermanentStorage {
    constructor(options = {
        driver: window.localStorage,
    }) {
        this.driver = options.driver || window.localStorage
    }

    getItem(key, defaultValue = undefined) {
        if (this.exists(key)) {
            let value = null
            if (this.driver === window.localStorage) {
                const valueFromStorage = this.driver.getItem(key)
                if (valueFromStorage.startsWith("{") || valueFromStorage.startsWith("[")) { // fuck
                    value = JSON.parse(valueFromStorage)
                } else {
                    value = valueFromStorage
                }
            } else {
                value = this.driver.getItem(key)
            }
            Logger.debug(`read [${key}]`, value)
            return value
        } else {
            if (typeof defaultValue !== "undefined") {
                return defaultValue
            } else {
                throw new Error(`${key} was not found`)
            }
        }
    }

    setItem(key, value) {
        let setValue = null
        if (this.driver === window.localStorage) {
            if (typeof value === "object" || Array.isArray(value)) {
                setValue = JSON.stringify(value)
            } else {
                setValue = value
            }
        } else {
            setValue = value
        }
        this.driver.setItem(key, setValue)
        Logger.debug(`set [${key}]`, value)
        return setValue
    }

    removeItem(key) {
        this.driver.removeItem(key)
        Logger.debug(`removed [${key}]`)
    }

    exists(key) {
        return !(!this.driver.getItem(key))
    }

    clear() {
        Logger.debug(`cleared`)
        this.driver.clear()
    }
}
