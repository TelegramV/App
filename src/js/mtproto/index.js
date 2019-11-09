import connect from "./connect"
import {Networker} from "./network"
import CONFIG from "../configuration"
import {bytesFromHex, bytesToHex} from "./utils/bin"
import TimeManager from "./timeManager"
import {createLogger} from "../common/logger"

class MobileProtocol {
    constructor(options = {}) {
        this.authContext = options.authContext || {}
        this.networker = options.networker || null
        this.timeManager = options.timeManager || TimeManager
        this.configuration = options.configuration
        this.logger = options.logger || createLogger("MTProto", {
            level: "debug"
        })

        this.connected = false
    }

    connect(authContext) {
        this.authContext = authContext

        if (!window.localStorage.getItem("authKey")) {
            return connect(authContext).then(() => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                window.localStorage.setItem("authKey", bytesToHex(authContext.authKey))
                window.localStorage.setItem("serverSalt", bytesToHex(authContext.serverSalt))

                this.networker = new Networker(authContext)
                this.connected = true
            })
        } else {
            return new Promise(resolve => {
                authContext.authKey = new Uint8Array(bytesFromHex(window.localStorage.getItem("authKey")))
                authContext.serverSalt = bytesFromHex(window.localStorage.getItem("serverSalt"))

                this.networker = new Networker(authContext)
                this.connected = true
                resolve()
            })
        }
    }

    invokeMethod(method, parameters = {}) {
        if (!this.connected) {
            throw new Error("Looks like you have not connected yet..")
        }

        return this.networker.callApi(this.networker.wrapApiCall(method, parameters))
    }
}

export const MTProto = new MobileProtocol({
    configuration: CONFIG
})