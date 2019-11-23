import {createLogger} from "../common/logger";

const Logger = createLogger("Manager")

export class Manager {
    constructor() {
        this.listeners = []
    }

    resolveListeners(event) {
        if (event) {
            this.listeners.forEach(listener => {
                listener.listener(event)
                // if (listener.listenOnce) {
                //     unlistenUpdates(listener)
                // }
            })
        } else {
            Logger.warn("invalid event", event)
        }
    }

    listenOnce(listener) {
        if (listener && typeof listener === "function") {
            this.listeners.push({listener, listenOnce: true})
        }
    }

    listenUpdates(listener) {
        if (listener && typeof listener === "function") {
            this.listeners.push({listener, listenOnce: false})
        }
    }

    unlistenUpdates(listener) {
        delete this.listeners[listener]
    }
}