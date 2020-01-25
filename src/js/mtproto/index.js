import {ApiNetworker} from "./network/apiNetworker"
import {AppConfiguration} from "../configuration"
import {createNonce} from "./utils/bin"
import TimeManager from "./timeManager"
import {createLogger} from "../common/logger"
import {AppPermanentStorage} from "../common/storage"
import {AuthAPI} from "../api/auth";
import UpdatesManager from "../api/updates/updatesManager"
import {attach} from "../api/notifications";
import {MTProtoNetworker} from "./network/mtprotoNetworker";
import Bytes from "./utils/bytes"
import authKeyCreation from "./connect/authKeyCreation"
import {FileNetworker} from "./network/fileNetworker";
import V from "../ui/v/VFramework";

window.id = 202466030
window.send = (method, params) => {
    MTProto.invokeMethod(method, params).then(l => {
        console.log(l)
    })
}

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
        return this.MTProto.invokeMethod("auth.signU", Object.assign({
            phone_number: phoneNumber,
            phone_code_hash: phoneCodeHash,
            first_name: firstName,
            last_name: lastName
        }, options))
    }
}

function initManagers() {
    // init non-ui managers
}

class MobileProtocol {
    constructor(options = {}) {
        this.authContext = options.authContext || {}
        this.networker = options.networker || null
        this.fileNetworkers = {}
        this.timeManager = options.timeManager || TimeManager
        this.configuration = options.configuration
        this.logger = options.logger || createLogger("MTProto", {
            level: "debug"
        })

        this.UpdatesManager = UpdatesManager

        this.connected = false
        this.Auth = new MobileProtocolAPIAuth({
            MTProto: this
        })

        this.authorizedUser = undefined

        this.queue = []
    }

    createApiNetworker(authContext) {
        this.networker = new ApiNetworker(authContext)
        this.MessageProcessor = this.networker.messageProcessor
        this.connected = true

        // TODO definitely not a right place for notifications -_-
        attach()
    }

    onConnected() {
        this.queue.forEach(l => {
            this.invokeMethod(l.method, l.parameters).then(l.resolve)
        })
        this.queue = []
    }

    connect(authContext) {
        this.authContext = authContext

        if (!AppPermanentStorage.exists("authKey" + this.authContext.dcID)) {
            const mtprotoNetworker = new MTProtoNetworker(authContext)

            return authKeyCreation(mtprotoNetworker).then(_ => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AppPermanentStorage.setItem("authKey" + this.authContext.dcID, Bytes.asHex(authContext.authKey))
                AppPermanentStorage.setItem("serverSalt" + this.authContext.dcID, Bytes.asHex(authContext.serverSalt))

                this.createApiNetworker(authContext)

                initManagers()
                this.onConnected()
            })
        } else {
            authContext.authKey = new Uint8Array(Bytes.fromHex(AppPermanentStorage.getItem("authKey" + this.authContext.dcID)))
            authContext.serverSalt = Bytes.fromHex(AppPermanentStorage.getItem("serverSalt" + this.authContext.dcID))

            this.createApiNetworker(authContext)

            initManagers()
            this.onConnected()

            return Promise.resolve()
        }
    }

    async createFileNetworker(dcID) {
        if (AppPermanentStorage.exists("authKey" + dcID)) {
            // i changed it to MTProtoNetworker cause Networker does not have `invokeMethod` function @undrfined
            const networker = new FileNetworker({
                dcID: dcID,
                nonce: createNonce(16),
                sessionID: createNonce(8), // TODO check if secure?
                updates: false,
                authKey: new Uint8Array(Bytes.fromHex(AppPermanentStorage.getItem("authKey" + dcID))),
                serverSalt: new Uint8Array(Bytes.fromHex(AppPermanentStorage.getItem("serverSalt" + dcID)))
            })
            const list = this.fileNetworkers[dcID]
            this.fileNetworkers[dcID] = networker
            list.forEach(l => {
                l.resolve(networker.invokeMethod(l.method, l.parameters))
            })
            return networker
        }
        const authContext = {
            dcID: dcID,
            nonce: createNonce(16),
            sessionID: createNonce(8), // TODO check if secure?
            exportedAuth: await AuthAPI.exportAuth(dcID),
            updates: false
        }

        return new Promise(resolve => {
            const mtprotoNetworker = new MTProtoNetworker(authContext)
            authKeyCreation(mtprotoNetworker).then(response => {
                const networker = new FileNetworker(authContext)

                const list = this.fileNetworkers[dcID]
                this.fileNetworkers[dcID] = networker
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AuthAPI.importAuth(authContext.exportedAuth, dcID).then(response => {
                    list.forEach(async l => {
                        l.resolve(networker.invokeMethod(l.method, l.parameters))
                    })
                    authContext.authKey = new Uint8Array(authContext.authKey)
                    authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                    AppPermanentStorage.setItem("authKey" + authContext.dcID, Bytes.asHex(authContext.authKey))
                    AppPermanentStorage.setItem("serverSalt" + authContext.dcID, Bytes.asHex(authContext.serverSalt))

                    resolve(networker)
                })
            })
        })
    }

    invokeMethod(method, parameters = {}, dcID = null) {
        if (!this.connected) {
            console.info("Not connected, putting in queue")
            return new Promise(resolve => {
                this.queue.push({
                    method: method,
                    parameters: parameters,
                    resolve: resolve
                })
            })
        }

        if (dcID !== null && dcID !== this.authContext.dcID) {
            let networker = this.fileNetworkers[dcID]
            if (Array.isArray(networker)) {
                return new Promise(resolve => {
                    networker.push({method, parameters, resolve})
                })
            }
            if (!networker) {
                this.fileNetworkers[dcID] = []
                return new Promise(resolve => {
                    return this.createFileNetworker(dcID).then(networker => {
                        networker.invokeMethod(method, parameters).then(resolve)
                    })
                })
            }

            return networker.invokeMethod(method, parameters)
        }

        return this.networker.invokeMethod(method, parameters)
    }

    logout() {
        AppPermanentStorage.clear()
        V.router.push("/login", {})
    }

    isUserAuthorized() {
        return AppPermanentStorage.exists("authorizationData")
    }

    getAuthorizedUser() {
        if (!this.authorizedUser) {
            this.authorizedUser = AppPermanentStorage.getItem("authorizationData")
        }

        return this.authorizedUser
    }

    changeDefaultDC(dcID) {

    }
}

export const MTProto = new MobileProtocol({
    configuration: AppConfiguration
})

export default MTProto
