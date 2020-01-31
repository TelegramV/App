import {AppConfiguration} from "../configuration"

import MobileProtoWorker from "./workers/mtproto.worker"
import {AppPermanentStorage} from "../common/storage"
import UpdatesManager from "../api/updates/updatesManager"

let lastTaskId = 0
let waitingTasks = new Map()

const MTProtoWorker = new MobileProtoWorker()

MTProtoWorker.addEventListener("message", event => {
    if (event.data.type === "update") {
        MTProto.UpdatesManager.process(event.data.update)
    } else if (event.data.type === "readStorage") {

    } else if (event.data.type === "setLocalStorage") {
        AppPermanentStorage.setItem(event.data.key, event.data.value)
    } else if (event.data.type === "removeLocalStorage") {
        AppPermanentStorage.removeItem(event.data.key)
    } else if (event.data.type === "clearLocalStorage") {
        AppPermanentStorage.clear()
    }

    if (event.data.taskId) {
        resolveTask(event.data.taskId, event.data.taskResult)
    }
})

function resolveTask(taskId, taskResult) {
    const resolve = waitingTasks.get(taskId)

    if (resolve) {
        resolve(taskResult)
        waitingTasks.delete(taskId)
    }
}

function performTask(task, data, resolve) {
    if (lastTaskId > 101010) {
        lastTaskId = 0
    } else {
        lastTaskId++
    }

    waitingTasks.set(lastTaskId, resolve)

    MTProtoWorker.postMessage({
        task: task,
        taskId: lastTaskId,
        taskData: data
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

        return new Promise(resolve => {
            performTask("connect", {
                storage
            }, resolve)
        })
    }


    invokeMethod(method, params, dcID = null, isFile = false) {
        return new Promise(resolve => {
            performTask("invokeMethod", {
                method,
                params,
                dcID,
                isFile
            }, resolve)
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
}

// USE THIS THING ONLY OUTSIDE AND NEVER INSIDE mtproto FOLDER
export const MTProto = new MTProtoBridge()

export default MTProto
