import {ApiNetworker} from "./network/apiNetworker"
import {AppConfiguration} from "../configuration"
import {bytesFromHex, bytesToHex, createNonce} from "./utils/bin"
import TimeManager from "./timeManager"
import {createLogger} from "../common/logger"
import {AppPermanentStorage} from "../common/storage"
import {AuthAPI} from "../api/auth";
import {sendReqPQ} from "./connect/methods";
import PeersManager from "../api/peers/peersManager"
import MessagesManager from "../api/messages/messagesManager"
import DialogsManager from "../api/dialogs/dialogsManager"
import {attach} from "../api/notifications";
import {MTProtoNetworker} from "./network/mtprotoNetworker";
import {Networker} from "./network/networker"

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

function initManagers() {
    DialogsManager.init()
    PeersManager.init()
    MessagesManager.init()
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

        this.connected = false
        this.Auth = new MobileProtocolAPIAuth({
            MTProto: this
        })
    }

    updateServerSalt(newSalt) {
        this.authContext.serverSalt = newSalt
        AppPermanentStorage.setItem("serverSalt", bytesToHex(newSalt))
    }

    createApiNetworker(authContext) {
        this.networker = new ApiNetworker(authContext)
        this.MessageProcessor = this.networker.messageProcessor
        this.connected = true

        attach()
    }

    connect(authContext) {
        this.authContext = authContext

        if (!AppPermanentStorage.exists("authKey" + this.authContext.dcID)) {
            const mtprotoNetworker = new MTProtoNetworker(authContext)

            return sendReqPQ(mtprotoNetworker).then(_ => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AppPermanentStorage.setItem("authKey" + this.authContext.dcID, bytesToHex(authContext.authKey))
                AppPermanentStorage.setItem("serverSalt" + this.authContext.dcID, bytesToHex(authContext.serverSalt))

                this.createApiNetworker(authContext)

                initManagers()
            })
        } else {
            authContext.authKey = new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("authKey" + this.authContext.dcID)))
            authContext.serverSalt = bytesFromHex(AppPermanentStorage.getItem("serverSalt" + this.authContext.dcID))

            this.createApiNetworker(authContext)

            initManagers()

            return Promise.resolve()
        }
    }

    async createFileNetworker(dcID) {
        if (AppPermanentStorage.exists("authKey" + dcID)) {
            const networker = new Networker({
                dcID: dcID,
                nonce: createNonce(16),
                sessionID: createNonce(8), // TODO check if secure?
                updates: false,
                authKey: new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("authKey" + dcID))),
                serverSalt: new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("serverSalt" + dcID)))
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
            sendReqPQ(authContext, e => {
                const networker = new Networker(authContext)

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

                    AppPermanentStorage.setItem("authKey" + authContext.dcID, bytesToHex(authContext.authKey))
                    AppPermanentStorage.setItem("serverSalt" + authContext.dcID, bytesToHex(authContext.serverSalt))

                    resolve(networker)
                })
            }, this)
        })
    }

    invokeMethod(method, parameters = {}, dcID = null) {
        if (!this.connected) {
            throw new Error("Looks like you have not connected yet..")
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

    isUserAuthorized() {
        return AppPermanentStorage.exists("authorizationData")
    }

    getAuthorizedUser() {
        return AppPermanentStorage.getItem("authorizationData")
    }

    changeDefaultDC(dcID) {

    }
}

export const MTProto = new MobileProtocol({
    configuration: AppConfiguration
})

export default MTProto
