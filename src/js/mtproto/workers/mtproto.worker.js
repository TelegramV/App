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
        try {
            MTProtoInternal.invokeMethod(taskData.method, taskData.params, taskData.dcID).then(r => {
                postMessage({taskId: taskId, taskResult: r, failed: false})
            }).catch(r => {
                console.log("ERR", r)
                postMessage({taskId: taskId, taskResult: r, failed: true})
            })
        } catch (e) {
            console.log("ERR", e)
            postMessage({taskId: taskId, taskResult: e, failed: true})
        }
    }

    if (task === "connect") {
        try {
            loadSchema().then(() => {
                MTProtoInternal.connect(authContext, taskData.storage).then(() => {
                    postMessage({taskId: taskId, taskResult: authContext, failed: false})
                }).catch(r => {
                    postMessage({taskId: taskId, taskResult: r, failed: true})
                })
            })
        } catch (e) {
            postMessage({taskId: taskId, taskResult: e, failed: true})
        }
    }
})

postMessage("ready")