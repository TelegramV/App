import {AppConfiguration} from "../Config"

import MobileProtoWorker from "./workers/mtproto.worker"
import {AppPermanentStorage} from "../Api/Common/storage"
import UpdatesManager from "../Api/Updates/updatesManager"
import AppEvents from "../Api/EventBus/AppEvents"

const TimeManager = {
    lastMessageID: {},
    timeOffset: {},
    now(seconds, dcId) {
        let t = +new Date() + (this.timeOffset[dcId !== undefined ? dcId : AppConfiguration.mtproto.dataCenter.default] || 0)
        return seconds ? Math.floor(t / 1000) : t
    },
    generateMessageID(dcID) {
        return MTProto.performWorkerTask("time_generateMessageID", {
            dcID
        }).then(data => {
            return data.messageId
        })
    }

}

let lastTaskId = 0
let waitingTasks = new Map()

const MTProtoWorker = new MobileProtoWorker()

MTProtoWorker.addEventListener("message", event => {
    if (event.data.time) {
        TimeManager.lastMessageID = event.data.time.lastMessageID
        TimeManager.timeOffset = event.data.time.timeOffset
    }

    if (event.data.type === "update") {
        MTProto.UpdatesManager.process(event.data.update)
    } else if (event.data.type === "readStorage") {
        console.warn("readStorage is not implemented")
    } else if (event.data.type === "setLocalStorage") {
        // console.warn("SETTING", event.data)
        AppPermanentStorage.setItem(event.data.key, event.data.value)
    } else if (event.data.type === "removeLocalStorage") {
        AppPermanentStorage.removeItem(event.data.key)
    } else if (event.data.type === "clearLocalStorage") {
        AppPermanentStorage.clear()
    } else if (event.data.type === "connectionLost") {
        AppEvents.General.fire("connectionLost")
    } else if (event.data.type === "connectionRestored") {
        AppEvents.General.fire("connectionRestored")
    } else if (event.data.type === "syncTime") {
        TimeManager.lastMessageID = event.data.time.lastMessageID
        TimeManager.timeOffset = event.data.time.timeOffset
    }

    if (event.data.taskId) {
        resolveTask(event.data.taskId, event.data.taskResult, event.data.failed)
    }
})

function resolveTask(taskId, taskResult, failed = false) {
    let resolve = waitingTasks.get(taskId)

    if (resolve) {

        if (failed) {
            resolve = resolve[1]
        } else {
            resolve = resolve[0]
        }

        resolve(taskResult)
        waitingTasks.delete(taskId)
    } else {
        console.error("BUG: task does not exist")
    }
}

function performTask(task, data) {
    return new Promise((resolve, reject) => {
        if (lastTaskId === Number.MAX_VALUE) {
            lastTaskId = 0
        } else {
            lastTaskId++
        }

        waitingTasks.set(lastTaskId, [resolve, reject])

        MTProtoWorker.postMessage({
            task: task,
            taskId: lastTaskId,
            taskData: data
        })
    })
}

// USE THIS THING ONLY OUTSIDE AND NEVER INSIDE mtproto FOLDER

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

const dataToReadFromLocalStorage = [
    "serverSalt1",
    "serverSalt2",
    "serverSalt3",
    "serverSalt4",
    "serverSalt5",
    "serverSalt6",
    "serverSalt7",
    "serverSalt8",
    "serverSalt9",

    "authKey1",
    "authKey2",
    "authKey3",
    "authKey4",
    "authKey5",
    "authKey6",
    "authKey7",
    "authKey8",
    "authKey9",

    "authorizationData",
]

// USE THIS THING ONLY OUTSIDE AND NEVER INSIDE mtproto FOLDER
class MTProtoBridge {
    constructor() {
        this.Auth = new MobileProtocolAPIAuth({
            MTProto: this
        })
        this.UpdatesManager = UpdatesManager
        this.TimeManager = TimeManager
    }

    connect() {
        const storage = new Map()
        dataToReadFromLocalStorage.forEach(k => {
            const v = localStorage.getItem(k)
            if (v) {
                if (v.startsWith("{") || v.startsWith("[")) { // fuck
                    storage.set(k, JSON.parse(v))
                } else {
                    storage.set(k, v)
                }
            }
        })

        return performTask("connect", {
            storage
        })
    }


    invokeMethod(method, params = {}, dcID = null, isFile = false, useOneTimeNetworker = false) {
        return performTask("invokeMethod", {
            method,
            params,
            dcID,
            isFile,
            useOneTimeNetworker
        })
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

    performWorkerTask(taskName, data) {
        return performTask(taskName, data)
    }

    /**
     * do not use it now, there can be consequences
     * @param {function(MTProtoInternal)} callback
     */
    withInternalContext(callback) {
        return performTask("internalContext", callback)
    }

    changeDefaultDC(dcID) {
        this.performWorkerTask({
            type: "changeDefaultDc",
            dcID
        })
    }

    logout() {
        return this.performWorkerTask("logout").then(() => {
            AppPermanentStorage.removeItem("authorizationData")
        })
    }
}

// USE THIS THING ONLY OUTSIDE AND NEVER INSIDE mtproto FOLDER
export const MTProto = new MTProtoBridge()

export default MTProto