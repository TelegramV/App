import connect from "./connect"
import {Networker} from "./network"
import {AppConfiguration} from "../configuration"
import {bytesFromHex, bytesToHex} from "./utils/bin"
import TimeManager from "./timeManager"
import {createLogger} from "../common/logger"
import {AppPermanentStorage} from "../common/storage"

class MobileProtocolAPIAuth {
    constructor(options = {}) {
        if (!options.MTProto) {
            throw new Error("MTProto is not defined")
        }

        this.MTProto = options.MTProto
    }

    sendCode(phoneNumber, options = {}) {
        return this.MTProto.invokeMethod("auth.sendCode", Object.assign({
            flags: 0,
            phone_number: phoneNumber,
            api_id: AppConfiguration.mtproto.api.api_id,
            api_hash: AppConfiguration.mtproto.api.api_hash,
            settings: {
                _: "codeSettings",
                flags: 0,
                pFlags: {
                    current_number: false,
                    allow_app_hash: false,
                    allow_flashcall: false
                }
            },
            lang_code: navigator.language || 'en'
        }, options))
    }

    signIn(phoneNumber, phoneCodeHash, phoneCode, options = {}) {
        return this.MTProto.invokeMethod("auth.signIn", Object.assign({
            phone_number: phoneNumber,
            phone_code_hash: phoneCodeHash,
            phone_code: phoneCode
        }, options))
    }

    signUp(phoneNumber, phoneCodeHash, firstName, lastName, options = {}) {
        return this.MTProto.invokeMethod("auth.signUp", Object.assign({
            phone_number: phoneNumber,
            phone_code_hash: phoneCodeHash,
            first_name: firstName,
            last_name: lastName
        }, options))
    }
}

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
        this.Auth = new MobileProtocolAPIAuth({
            MTProto: this
        })
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

    isUserAuthorized() {
        return AppPermanentStorage.exists("authorizationData")
    }

    getAuthorizedUser() {
        return AppPermanentStorage.getItem("authorizationData")
    }
}

export const MTProto = new MobileProtocol({
    configuration: AppConfiguration
})

export default MTProto
