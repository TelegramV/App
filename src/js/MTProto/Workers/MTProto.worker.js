import MTProtoInternal from "../internal"
import mt_srp_check_password from "../crypto/mt_srp/mt_srp"
import task_invokeMethod from "./tasks/task_invokeMethod"
import task_connect from "./tasks/task_connect"
import task_mt_srp_check_password from "./tasks/task_mt_srp_check_password"
import task_gzipUncompress from "./tasks/task_gzipUncompress"
import task_time_generateMessageID from "./tasks/task_time_generateMessageID"

type Task = {
    id: number,
    name: string,
    data: any,
}

function postMessageWithTime(data) {
    Object.assign(data, {
        time: {
            lastMessageID: MTProtoInternal.timeManager.lastMessageID,
            timeOffset: MTProtoInternal.timeManager.timeOffset,
        }
    })

    postMessage(data)
}

function postSuccess(id: number, data: any) {
    postMessageWithTime({taskId: id, taskResult: data, failed: false})
}

function postFail(id: number, error: any) {
    postMessageWithTime({taskId: id, taskResult: error, failed: true})
}

MTProtoInternal.UpdatesHandler = update => postMessageWithTime({type: "update", update: update})
MTProtoInternal.workerPostMessage = data => postMessageWithTime(data)

const TASKS: Map<string, Task => any> = new Map()

TASKS.set("invokeMethod", task_invokeMethod)
TASKS.set("connect", task_connect)
TASKS.set("mt_srp_check_password", task_mt_srp_check_password)
TASKS.set("gzipUncompress", task_gzipUncompress)
TASKS.set("time_generateMessageID", task_time_generateMessageID)

self.addEventListener("message", event => {
    const data = event.data

    const task: Task = {
        id: data.taskId,
        name: data.task,
        data: data.taskData,
        success: result => postSuccess(data.taskId, result),
        fail: error => postFail(data.taskId, error),
    }

    const handler = TASKS.get(task.name)

    handler.call(null, task)
})

postMessage("ready")