/**
 * Simple Logger
 *
 * Note: `log` method works regardless of selected level
 *
 * @author kohutd
 */

export class Logger {
    constructor(name = "", options = {}) {
        this.levels = [
            {
                index: 0,
                name: "log",
            },
            {
                index: 1,
                name: "info",
            },
            {
                index: 2,
                name: "warn",
            },
            {
                index: 3,
                name: "error",
            },
            {
                index: 4,
                name: "debug",
            },
        ]

        this.prefix = `[${name || options.prefix}]` || ""
        this.dateTime = options.dateTimeFormat || true
        this.dateTimeFormat = options.dateTimeFormat || "default"
        this.level = options.level || "debug"
        this.levelIndex = options.levelIndex || this.levels.find(v => v.name === String(this.level)).index
        this.showErrors = options.showErrors || true
        this.driver = options.driver || console
        this.disableLog = false
    }

    makeLog(level = "log", text) {
        let output = `${this.prefix}`
        output += ` [${level.toUpperCase()}]`

        if (this.dateTime) {
            const datetime = new Date().getTime()
            output += ` [${datetime}]`
        }

        output += ` ${text}`

        return output
    }

    log(text, ...options) {
        if (!this.disableLog) {
            if (typeof text === "object") {
                this.driver.log(this.makeLog("log"), text, ...options)
            } else {
                this.driver.log(this.makeLog("log", text), ...options)
            }
        }
    }

    info(text, ...options) {
        if (this.levelIndex >= 1) {
            if (typeof text === "object") {
                this.driver.info(this.makeLog("info"), text, ...options)
            } else {
                this.driver.info(this.makeLog("info", text), ...options)
            }
        }
    }

    warn(text, ...options) {
        if (this.levelIndex >= 2) {
            if (typeof text === "object") {
                this.driver.warn(this.makeLog("warn"), text, ...options)
            } else {
                this.driver.warn(this.makeLog("warn", text), ...options)
            }
        }
    }

    error(text, ...options) {
        if (this.showErrors || this.levelIndex >= 3) {
            if (typeof text === "object") {
                this.driver.error(this.makeLog("error"), text, ...options)
            } else {
                this.driver.error(this.makeLog("error", text), ...options)
            }
        }
    }

    debug(text, ...options) {
        if (this.levelIndex >= 4) {
            if (typeof text === "object") {
                console.groupCollapsed(this.makeLog("debug"), text, ...options)
                console.trace()
                console.groupEnd()
            } else {
                console.groupCollapsed(this.makeLog("debug", text), ...options)
                console.trace()
                console.groupEnd()
            }
        }
    }
}

export function createLogger(name = "", options = {}) {
    return new Logger(name, Object.assign({
        level: "debug",
    }, options))
}

export default new Logger({
    level: "debug"
})