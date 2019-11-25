/**
 * Simple Logger
 *
 * Note: `log` method works regardless of selected level
 *
 * @author kohutd
 */

const _levels = [
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

const createMakeLog = Logger => {
    return (level = "log", text) => {
        let output = `${Logger.prefix}`
        output += ` [${level.toUpperCase()}]`

        if (Logger.dateTime) {
            const datetime = new Date().toLocaleTimeString("en", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })
            output += ` [${datetime}]`
        }

        output += ` ${text}`

        return output
    }
}

const createOutLevel = Logger => {
    return (levelName, text, ...options) => {
        if (typeof text === "function" && options[0] !== false) {
            text(this[levelName])
        } else {
            if (typeof text === "object") {
                Logger.driver[levelName](Logger.makeLog(levelName), text, ...options)
            } else {
                Logger.driver[levelName](Logger.makeLog(levelName, text), ...options)
            }
        }
    }
}

const createLog = logger => {
    return (text, ...options) => {
        if (!logger.disableLog) {
            logger.outLevel("log", text, ...options)
        }
    }
}

const createInfo = Logger => {
    return (text, ...options) => {
        if (Logger.levelIndex >= 1) {
            Logger.outLevel("info", text, ...options)
        }
    }
}

const createWarn = Logger => {
    return (text, ...options) => {
        if (Logger.levelIndex >= 2) {
            Logger.outLevel("warn", text, ...options)
        }
    }
}

const createError = Logger => {
    return (text, ...options) => {
        if (Logger.showErrors || Logger.levelIndex >= 3) {
            Logger.outLevel("error", text, ...options)
        }
    }
}

const createDebug = Logger => {
    return (text, ...options) => {
        if (Logger.levelIndex >= 4) {
            if (typeof text === "function" && options[0] !== false) {
                text(Logger.debug)
            } else {
                if (typeof text === "object") {
                    console.groupCollapsed(Logger.makeLog("debug"), text, ...options)
                    console.trace()
                    console.groupEnd()
                } else {
                    console.groupCollapsed(Logger.makeLog("debug", text), ...options)
                    console.trace()
                    console.groupEnd()
                }
            }
        }
    }
}

export const createLogger = (name = "", options = {}) => {
    const Logger = {
        prefix: `[${name || options.prefix}]` || "",
        dateTime: options.dateTimeFormat || true,
        dateTimeFormat: options.dateTimeFormat || "default",
        level: options.level || "debug",
        levelIndex: options.levelIndex || _levels.find(v => v.name === String(options.level || "debug")).index,
        showErrors: options.showErrors || true,
        driver: options.driver || console,
        disableLog: options.disableLog || false,
    }

    Logger.makeLog = createMakeLog(Logger)
    Logger.outLevel = createOutLevel(Logger)
    Logger.log = createLog(Logger)
    Logger.info = createInfo(Logger)
    Logger.warn = createWarn(Logger)
    Logger.error = createError(Logger)
    Logger.debug = createDebug(Logger)

    return Logger
}

export default createLogger()
