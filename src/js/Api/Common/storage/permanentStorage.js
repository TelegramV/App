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
        return setValue
    }

    removeItem(key) {
        this.driver.removeItem(key)
    }

    exists(key) {
        return !(!this.driver.getItem(key))
    }

    clear() {
        this.driver.clear()
    }
}
