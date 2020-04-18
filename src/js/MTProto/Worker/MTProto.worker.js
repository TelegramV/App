import MTProtoInternal from "../Internal"
import mt_srp_check_password from "../Cryptography/mt_srp"
import task_invokeMethod from "./tasks/task_invokeMethod"
import task_connect from "./tasks/task_connect"
import task_mt_srp_check_password from "./tasks/task_mt_srp_check_password"
import task_gzipUncompress from "./tasks/task_gzipUncompress"
import task_time_generateMessageId from "./tasks/task_time_generate_message_id"

type Task = {
    id: number,
    name: string,
    data: any,
}

function postMessageWithTime(data) {
    Object.assign(data, {
        time: {
            lastMessageID: MTProtoInternal.application.mainConnection.state.lastMessageId,
            timeOffset: MTProtoInternal.application.mainConnection.state.offset,
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

MTProtoInternal.updatesHandler = update => postMessageWithTime({type: "update", update: update})
MTProtoInternal.workerPostMessage = data => postMessageWithTime(data)

const TASKS: Map<string, Task => any> = new Map()

TASKS.set("invokeMethod", task_invokeMethod)
TASKS.set("connect", task_connect)
TASKS.set("mt_srp_check_password", task_mt_srp_check_password)
TASKS.set("gzipUncompress", task_gzipUncompress)
TASKS.set("time_generateMessageId", task_time_generateMessageId)

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