import {createLogger} from "../logger"
import {nextRandomInt} from "../../mtproto/utils/bin"

const Logger = createLogger("Storage", {
    level: "log"
})

class Storage {
    constructor(options = {
        loggerName: "Storage" + nextRandomInt()
    }) {
        this.logger = createLogger(options.loggerName || "Storage" + nextRandomInt())
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

export function createStorage(name = nextRandomInt()) {
    return new Storage({
        loggerName: name
    })
}

const storage = new Storage()
export default storage