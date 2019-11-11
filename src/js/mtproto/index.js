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

    updateServerSalt(newSalt) {
        this.authContext.serverSalt = newSalt
        AppPermanentStorage.setItem("serverSalt", bytesToHex(newSalt))
    }

    connect(authContext, processor, proc_context) {
        this.authContext = authContext

        if (!AppPermanentStorage.exists("authKey")) {
            //return new Promise(resolve => {
                connect(authContext, function(){//.then(() => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AppPermanentStorage.setItem("authKey", bytesToHex(authContext.authKey))
                AppPermanentStorage.setItem("serverSalt", bytesToHex(authContext.serverSalt))

                this.networker = new Networker(authContext)
                this.connected = true

                processor.call(proc_context);
                //resolve()
                }, this)
            //})
            //})
        } else {
            return new Promise(resolve => {
                authContext.authKey = new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("authKey")))
                authContext.serverSalt = bytesFromHex(AppPermanentStorage.getItem("serverSalt"))

                this.networker = new Networker(authContext)
                this.connected = true
                resolve()
                processor.call(proc_context);
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