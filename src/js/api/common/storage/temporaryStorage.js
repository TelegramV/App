/**
 * Data stored in this storage has expiration time.
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
export class TemporaryStorage {
    constructor(options = {}) {
        this.name = options.name || ""

        this.driver = options.driver || new SimpleStorageDriver(this.name)
    }

    getItem(key, defaultValue = undefined) {
        if (this.exists(key)) {
            let value = null
            value = this.driver.getItem(key)
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
        setValue = value
        this.driver.setItem(key, setValue)
        return setValue
    }

    removeItem(key) {
        this.driver.removeItem(key)
    }

    exists(key) {
        return this.driver.exists(key)
    }

    clear() {
        this.driver.clear()
    }
}

class SimpleStorageDriver {
    constructor(name = "") {
        this.name = name
        this.data = {}
    }

    getItem(key) {
        if (this.exists(key)) {
            return this.data[key]
        } else {
            console.error(`${key} was not found`)
        }
    }

    setItem(key, value) {
        this.data[key] = value
        return value
    }

    removeItem(key) {
        delete this.data[key]
    }

    exists(key) {
        return !(!this.data[key])
    }

    clear() {
        this.data = {}
    }
}
