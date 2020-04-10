import {AppConfiguration} from "../Config/AppConfiguration"

import MobileProtoWorker from "./workers/MTProto.worker"
import {AppPermanentStorage} from "../Api/Common/Storage"
import UpdatesManager from "../Api/Updates/UpdatesManager"
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

    switch (event.data.type) {
        case "event.data.type":
            MTProto.UpdatesManager.process(event.data.update)
            break

        case "readStorage":
            console.warn("readStorage is not implemented")
            break

        case "setLocalStorage":
            AppPermanentStorage.setItem(event.data.key, event.data.value)
            break

        case "removeLocalStorage":
            AppPermanentStorage.removeItem(event.data.key)
            break

        case "clearLocalStorage":
            AppPermanentStorage.clear()
            break

        case "connectionLost":
            AppEvents.General.fire("connectionLost")
            break

        case "connectionRestored":
            AppEvents.General.fire("connectionRestored")
            break

        case "syncTime":
            TimeManager.lastMessageID = event.data.time.lastMessageID
            TimeManager.timeOffset = event.data.time.timeOffset
            break
    }

    if (event.data.taskId) {
        resolveTask(event.data.taskId, event.data.taskResult, event.data.failed)
    }
})

function resolveTask(taskId, taskResult, failed = false) {
    let resolve: Function = waitingTasks.get(taskId)

    if (resolve) {

        if (failed) {
            resolve = resolve[2]
        } else {
            resolve = resolve[1]
        }

        resolve.apply(resolve[0], [taskResult])
        waitingTasks.delete(taskId)
    } else {
        console.error("BUG: task does not exist")
    }
}

function performTask(task, data) {
    return new Promise(function (resolve, reject) {
        if (lastTaskId === Number.MAX_VALUE) {
            lastTaskId = 0
        } else {
            lastTaskId++
        }

        waitingTasks.set(lastTaskId, [this, resolve, reject])

        MTProtoWorker.postMessage({
            task: task,
            taskId: lastTaskId,
            taskData: data
        })
    })
}

// USE THIS THING ONLY OUTSIDE AND NEVER INSIDE mtproto FOLDER

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
        }).then(async _ => {
            await MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
                if (response.this_dc !== response.nearest_dc) {
                    MTProto.changeDefaultDC(response.nearest_dc)

                    AppEvents.General.fire("nearestDc", {
                        dcResponse: response
                    })
                }
            })

            return _
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
