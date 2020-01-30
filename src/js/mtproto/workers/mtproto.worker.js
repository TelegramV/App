import '@babel/polyfill'
import {createNonce} from "../utils/bin"
import {loadSchema} from "../language/schema"
import MTProtoInternal from "../internal"

export const defaultDcID = 2

const authContext = {
    dcID: defaultDcID,
    nonce: createNonce(16),
    sessionID: createNonce(8)
}

MTProtoInternal.UpdatesHandler = update => postMessage({type: "update", update: update})
MTProtoInternal.workerPostMessage = data => postMessage(data)

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    if (task === "invokeMethod") {
        MTProtoInternal.invokeMethod(taskData.method, taskData.params, taskData.dcID).then(r => {
            postMessage({taskId: taskId, taskResult: r})
        })
    }

    if (task === "connect") {
        loadSchema().then(() => {
            MTProtoInternal.connect(authContext, taskData.storage)
                .then(() => {
                    postMessage({taskId: taskId, taskResult: authContext})
                })
        })
    }
})

postMessage("ready")