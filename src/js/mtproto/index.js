import connect from "./connect"
import {Networker} from "./network"
import {AppConfiguration} from "../configuration"
import {bytesFromHex, bytesToHex} from "./utils/bin"
import TimeManager from "./timeManager"
import {createLogger} from "../common/logger"
import {AppPermanentStorage} from "../common/storage"

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

        if (!AppPermanentStorage.exists("authKey")) {
            return connect(authContext).then(() => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AppPermanentStorage.setItem("authKey", bytesToHex(authContext.authKey))
                AppPermanentStorage.setItem("serverSalt", bytesToHex(authContext.serverSalt))

                this.networker = new Networker(authContext)
                this.connected = true
            })
        } else {
            return new Promise(resolve => {
                authContext.authKey = new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("authKey")))
                authContext.serverSalt = bytesFromHex(AppPermanentStorage.getItem("serverSalt"))

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
    configuration: AppConfiguration
})