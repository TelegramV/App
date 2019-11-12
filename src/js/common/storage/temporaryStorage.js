import {createLogger} from "../logger"

/**
 * Data stored in this storage has expiration time.
 *
 * TODO: mb we should make all methods async..
 *
 * The `driver` should implement following methods:
 * - `getItem(key)`
 * - `setItem(key, value)
 * - `removeItem(key, value)
 * - `exists(key)`
 * - `clear()`
 */
export class TemporaryStorage {
    constructor(options = {}) {
        this.name = options.name || ""

        this.driver = options.driver || new PerTabStorageDriver(this.name)
        this.logger = createLogger(`TemporaryStorage${this.name}`, {
            level: "log"
        })
    }

    getItem(key, defaultValue = undefined) {
        if (this.exists(key)) {
            let value = null
            if (this.driver === window.localStorage) {
                value = JSON.parse(this.driver.getItem(key))
            } else {
                value = this.driver.getItem(key)
            }
            this.logger.debug(`read [${key}]`, value)
            return value
        } else {
            if (typeof defaultValue !== "undefined") {
                return defaultValue
            } else {
                // throw new Error(`${key} was not found`)
                return {}
            }
        }
    }

    setItem(key, value) {
        let setValue = null
        if (this.driver === window.localStorage) {
            setValue = JSON.stringify(value)
        } else {
            setValue = value
        }
        this.driver.setItem(key, setValue)
        this.logger.debug(`set [${key}]`, value)
        return setValue
    }

    removeItem(key) {
        this.driver.removeItem(key)
        this.logger.debug(`removed [${key}]`)
    }

    exists(key) {
        return this.driver.exists(key)
    }

    clear() {
        this.logger.debug(`cleared`)
        this.driver.clear()
    }
}

class PerTabStorageDriver {
    constructor(name = "") {
        this.name = name

        if (!window[`perTabStorage${this.name}`]) {
            window[`perTabStorage${this.name}`] = {}
        }
    }

    getItem(key) {
        if (this.exists(key)) {
            return window[`perTabStorage${this.name}`][key]
        } else {
            throw new Error(`${key} was not found`)
        }
    }

    setItem(key, value) {
        window[`perTabStorage${this.name}`][key] = value
        return value
    }

    removeItem(key) {
        delete window[`perTabStorage${this.name}`][key]
    }

    exists(key) {
        return !(!window[`perTabStorage${this.name}`][key])
    }

    clear() {
        window[`perTabStorage${this.name}`] = {}
    }
}