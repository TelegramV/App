import {createLogger} from "../logger"

const Logger = createLogger("[Storage]")

class Storage {
    constructor() {
        window.mtprotoStorage = window.mtprotoStorage ? window.mtprotoStorage : {}
        this.data = window.mtprotoStorage
    }

    get(key, defaultValue = null) {
        Logger.debug(`reading data [${key}] [${defaultValue}]`)
        return new Promise(resolve => {
            const value = this.data[key]
            Logger.debug(`read data [${key}] = [${value}]`)
            resolve(value !== undefined && value != null ? value : defaultValue)
        })
    }

    set(key, value) {
        Logger.debug(`setting data [${key}] [${value}]`)
        this.data[key] = value
        return value
    }

    exists(key) {
        return data[key] !== undefined && data[key] != null
    }
}

const storage = new Storage()
export default storage