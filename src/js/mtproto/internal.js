/**
 * (c) Telegram V
 */

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

import {ApiNetworker} from "./network/ApiNetworker"
import {AppConfiguration} from "../configuration"
import {createNonce} from "./utils/bin"
import TimeManager from "./timeManager"
import {AuthAPI} from "./auth"
import Bytes from "./utils/bytes"
import authKeyCreation from "./connect/authKeyCreation"
import {FileNetworker} from "./network/FileNetworker"

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

// CURRENTLY WRITE ONLY
// THIS IS NOT SAFE!!!!!!!!!!
class MobileProtocolPermanentStorage {
    constructor(mtp) {
        /**
         * @type MobileProtocol
         */
        this.mtp = mtp

        this.storage = new Map()
    }

    getItem(key) {
        return this.storage.get(key)
    }

    data() {
        return this.storage
    }

    setItem(key, value) {
        this.storage.set(key, value)
        return Promise.resolve(this.mtp.workerPostMessage({
            type: "setLocalStorage",
            key,
            value
        }))
    }

    removeItem(key) {
        this.storage.delete(key)
        return Promise.resolve(this.mtp.workerPostMessage({
            type: "removeLocalStorage",
            key,
        }))
    }

    clear() {
        this.storage.clear()
        return Promise.resolve(this.mtp.workerPostMessage({
            type: "clearLocalStorage",
        }))
    }

    exists(key) {
        return this.storage.has(key)
    }
}

const fileNetworkerMethods = [
    "upload.getFile",
    "upload.getFileHashes",
    "upload.getWebFile",
    "messages.getDocumentByHash",
    "photos.uploadProfilePhoto",
    "upload.saveFilePart",
    "upload.saveBigFilePart",
]

class MobileProtocol {
    constructor(options = {}) {
        this.authContext = options.authContext || {}
        this.networker = options.networker || null
        this.fileNetworkers = {}
        this.timeManager = options.timeManager || TimeManager
        this.configuration = options.configuration

        this.connected = false

        this.UpdatesHandler = () => {
            console.error("no updates handler")
        }

        this.PermanentStorage = new MobileProtocolPermanentStorage(this)
        this.workerPostMessage = () => {
            console.error("fuck it is very badly")
        }

        this.queue = []
    }

    processUpdate(update) {
        this.UpdatesHandler(update)
    }

    createApiNetworker(apiNetworker) {
        this.networker = apiNetworker
        this.networker.mtproto = false
        this.connected = true
    }

    onConnected() {
        this.queue.forEach(l => {
            this.invokeMethod(l.method, l.parameters).then(l.resolve)
        })
        this.queue = []
    }

    connect(authContext, storage = {}) {
        this.PermanentStorage.storage = storage
        this.authContext = authContext

        if (!this.PermanentStorage.exists("authKey" + this.authContext.dcID)) {
            const mtprotoNetworker = new ApiNetworker(authContext, true)

            return authKeyCreation(mtprotoNetworker).then(_ => {
                mtprotoNetworker.init()
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                this.PermanentStorage.setItem("authKey" + this.authContext.dcID, Bytes.asHex(authContext.authKey))
                    .then(() => this.PermanentStorage.setItem("serverSalt" + this.authContext.dcID, Bytes.asHex(authContext.serverSalt)))
                    .then(() => {
                        this.createApiNetworker(mtprotoNetworker)
                        this.onConnected()
                    })
            })

        } else {
            authContext.authKey = new Uint8Array(Bytes.fromHex(this.PermanentStorage.getItem("authKey" + this.authContext.dcID)))
            authContext.serverSalt = Bytes.fromHex(this.PermanentStorage.getItem("serverSalt" + this.authContext.dcID))

            this.createApiNetworker(new ApiNetworker(authContext))

            this.onConnected()

            return Promise.resolve()
        }
    }

    async createFileNetworker(dcID) {
        if (this.PermanentStorage.exists("authKey" + dcID)) {
            const networker = new FileNetworker({
                dcID: dcID,
                nonce: createNonce(16),
                sessionID: createNonce(8), // TODO check if secure?
                updates: false,
                authKey: new Uint8Array(Bytes.fromHex(this.PermanentStorage.getItem("authKey" + dcID))),
                serverSalt: new Uint8Array(Bytes.fromHex(this.PermanentStorage.getItem("serverSalt" + dcID)))
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

        const mtprotoNetworker = new FileNetworker(authContext, true)

        return authKeyCreation(mtprotoNetworker).then(response => {
            const networker = mtprotoNetworker
            mtprotoNetworker.mtproto = false
            networker.init()

            const list = this.fileNetworkers[dcID]
            this.fileNetworkers[dcID] = networker

            authContext.authKey = new Uint8Array(authContext.authKey)
            authContext.serverSalt = new Uint8Array(authContext.serverSalt)

            return AuthAPI.importAuth(authContext.exportedAuth, dcID, true).then(response => {
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                return this.PermanentStorage.setItem("authKey" + authContext.dcID, Bytes.asHex(authContext.authKey))
                    .then(() => this.PermanentStorage.setItem("serverSalt" + authContext.dcID, Bytes.asHex(authContext.serverSalt)))
                    .then(() => {
                        list.forEach(async l => {
                            l.resolve(networker.invokeMethod(l.method, l.parameters))
                        })
                    })
                    .then(() => networker)
            })
        })
    }

    invokeMethod(method, parameters = {}, dcID = null, file) {
        if (fileNetworkerMethods.includes(method)) {
            file = true
        }

        if (!this.connected) {
            console.info("Not connected, putting in queue", method)
            return new Promise(resolve => {
                this.queue.push({
                    method: method,
                    parameters: parameters,
                    resolve: resolve
                })
            })
        }


        // if (dcID !== null && dcID !== this.authContext.dcID) {

        if (file) {
            if (dcID === null) {
                dcID = this.authContext.dcID
            }

            let networker = this.fileNetworkers[dcID]

            if (Array.isArray(networker)) {
                return new Promise(resolve => {
                    networker.push({method, parameters, resolve})
                })
            }

            if (!networker) {
                this.fileNetworkers[dcID] = []

                return this.createFileNetworker(dcID).then(networker => {
                    networker.invokeMethod(method, parameters)
                })
            }

            return networker.invokeMethod(method, parameters)
        }

        return this.networker.invokeMethod(method, parameters)
    }

    logout() {

        try {
            return this.invokeMethod("auth.logOut")
                .then(() => {
                    this.networker.socket.refreshSocket()
                    this.PermanentStorage.removeItem("authorizationData")
                })
        } catch (e) {
            return Promise.resolve()
        }
    }

    changeDefaultDC(dcID) {

    }

    connectionRestored() {
        this.workerPostMessage({
            type: "connectionRestored"
        })
    }

    connectionLost() {
        this.workerPostMessage({
            type: "connectionLost"
        })
    }

    syncTimeWithFrontend() {
        this.workerPostMessage({
            type: "syncTime"
        })
    }
}

// NEVER USE THIS THING OUTSIDE mtproto FOLDER

export const MTProtoInternal = new MobileProtocol({
    configuration: AppConfiguration
})

export default MTProtoInternal
