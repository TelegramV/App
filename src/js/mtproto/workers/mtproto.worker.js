import '@babel/polyfill'
import {createNonce, gzipUncompress} from "../utils/bin"
import {loadSchema} from "../language/schema"
import MTProtoInternal from "../internal"
import AppConfiguration from "../../configuration"
import mt_srp_check_password from "../crypto/mt_srp/mt_srp"

const authContext = {
    dcID: AppConfiguration.mtproto.dataCenter.default,
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

    try {
        if (task === "invokeMethod") {
            MTProtoInternal.invokeMethod(taskData.method, taskData.params, taskData.dcID).then(r => {
                postMessage({taskId: taskId, taskResult: r, failed: false})
            }).catch(r => {
                console.log("ERR", r)
                postMessage({taskId: taskId, taskResult: r, failed: true})
            })
        } else if (task === "connect") {
            loadSchema().then(() => {
                MTProtoInternal.connect(authContext, taskData.storage).then(() => {
                    postMessage({taskId: taskId, taskResult: authContext, failed: false})
                }).catch(r => {
                    postMessage({taskId: taskId, taskResult: r, failed: true})
                })
            })
        } else if (task === "mt_srp_check_password") {
            postMessage({
                taskId: taskId,
                taskResult: mt_srp_check_password(taskData.g, taskData.p, taskData.salt1, taskData.salt2, taskData.srp_id, taskData.srp_B, taskData.password)
            })
        } else if (task === "gzipUncompress") {
            postMessage({
                taskId: taskId,
                taskResult: gzipUncompress(taskData)
            })
        } else if (task === "internalContext") {
            // BE VERY CAREFUL WITH THIS
            postMessage({
                taskId: taskId,
                taskResult: taskData(MTProtoInternal)
            })
        }
    } catch (e) {
        postMessage({taskId: taskId, taskResult: e, failed: true})
    }


})

postMessage("ready")