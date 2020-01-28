import WholeWorker from "./workers/whole.worker"
import {AppPermanentStorage} from "../common/storage"
import {XUpdatesManager} from "../api/updates/XUpdatesManager"

let lastTaskId = 0
let waitingTasks = new Map()

const wholeWorker = new WholeWorker()

export const XXXUpdateHandlers = []

wholeWorker.addEventListener("message", event => {
    if (event.data.type === "update") {
        XProto.UpdatesManager.process(event.data.update)
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
    lastTaskId++

    waitingTasks.set(lastTaskId, resolve)

    wholeWorker.postMessage({
        task: task,
        taskId: lastTaskId,
        taskData: data
    })
}

class XXX {

    constructor() {
        this.UpdatesManager = XUpdatesManager
    }

    connect() {
        return new Promise(resolve => {
            performTask("connect", {}, resolve)
        })
    }

    invokeMethod(name, data = {}, dcID = null) {
        return new Promise(resolve => {
            performTask("invokeMethod", {
                name,
                data,
                dcID
            }, resolve)
        })
    }

    getAuthorizedUser() {
        if (!this.authorizedUser) {
            this.authorizedUser = AppPermanentStorage.getItem("authorizationData")
        }

        return this.authorizedUser
    }
}

export const XProto = new XXX()