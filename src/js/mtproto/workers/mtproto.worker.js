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

const postMessageWithTime = (data) => {
    Object.assign(data, {
        time: {
            lastMessageID: MTProtoInternal.timeManager.lastMessageID,
            timeOffset: MTProtoInternal.timeManager.timeOffset,
        }
    })
    postMessage(data)
}

MTProtoInternal.UpdatesHandler = update => postMessageWithTime({type: "update", update: update})
MTProtoInternal.workerPostMessage = data => postMessageWithTime(data)

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    try {
        if (task === "invokeMethod") {
            MTProtoInternal.invokeMethod(taskData.method, taskData.params, taskData.dcID).then(r => {
                postMessageWithTime({taskId: taskId, taskResult: r, failed: false})
            }).catch(r => {
                console.log("ERR", r)
                postMessageWithTime({taskId: taskId, taskResult: r, failed: true})
            })
        } else if (task === "connect") {
            loadSchema().then(() => {
                MTProtoInternal.connect(authContext, taskData.storage).then(() => {
                    postMessageWithTime({taskId: taskId, taskResult: authContext, failed: false})
                }).catch(r => {
                    postMessageWithTime({taskId: taskId, taskResult: r, failed: true})
                })
            })
        } else if (task === "mt_srp_check_password") {
            postMessageWithTime({
                taskId: taskId,
                taskResult: mt_srp_check_password(taskData.g, taskData.p, taskData.salt1, taskData.salt2, taskData.srp_id, taskData.srp_B, taskData.password)
            })
        } else if (task === "gzipUncompress") {
            postMessageWithTime({
                taskId: taskId,
                taskResult: gzipUncompress(taskData)
            })
        } else if (task === "internalContext") {
            // BE VERY CAREFUL WITH THIS
            postMessageWithTime({
                taskId: taskId,
                taskResult: taskData(MTProtoInternal)
            })
        } else if (task === "time_generateMessageID") {
            postMessageWithTime({
                taskId: taskId,
                taskResult: MTProtoInternal.timeManager.generateMessageID(taskData.dcID)
            })
        } else if (task === "changeDefaultDc") {
            MTProtoInternal.changeDefaultDC(taskData.dcID)
            postMessageWithTime({taskId: taskId})
        } else if (task === "logout") {
            MTProtoInternal.logout().then(() => {
                postMessageWithTime({
                    taskId: taskId,
                })
            })
        }
    } catch (e) {
        postMessageWithTime({taskId: taskId, taskResult: e, failed: true})
    }


})

postMessage("ready")