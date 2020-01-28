import '@babel/polyfill'
import {createNonce} from "../utils/bin"
import {loadSchema} from "../language/schema"
import MTProto, {MobileProtocolUpdateHandlers} from "../index"

export const defaultDcID = 2

const authContext = {
    dcID: defaultDcID,
    nonce: createNonce(16),
    sessionID: createNonce(8)
}

MobileProtocolUpdateHandlers.push(u => {
    postMessage({type: "update", update: u})
})

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    if (task === "invokeMethod") {
        MTProto.invokeMethod(taskData.name, taskData.data, taskData.dcID).then(r => {
            postMessage({taskId: taskId, taskResult: r})
        })
    }

    if (task === "connect") {
        loadSchema().then(() => {
            MTProto.connect(authContext)
                .then(() => {
                    postMessage({taskId: taskId, taskResult: authContext})
                })
        })
    }
})

postMessage("ready")
