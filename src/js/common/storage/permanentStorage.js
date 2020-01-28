import {createLogger} from "../logger"

let Storage = {
    authorizationData: {},
    serverSalt2: "",
    authKey2: "",
}

const Logger = createLogger("PermanentStorage", {
    level: "log"
})

class CustomDriver {
    getItem(key) {
        return Storage[key]
    }

    setItem(key, value) {
        Storage[key] = value
    }

    removeItem(key) {
        delete Storage[key]
    }

    exist(key) {
        return Storage[key]
    }

    clear() {
        Storage = {}
    }
}

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
        driver: new CustomDriver(),
    }) {
        this.driver = options.driver || new CustomDriver()
    }

    getItem(key, defaultValue = undefined) {
        if (this.exists(key)) {
            let value = null
            value = this.driver.getItem(key)
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
        setValue = value
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
