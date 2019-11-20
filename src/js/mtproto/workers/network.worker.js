import {AppPermanentStorage} from "../../common/storage"
import {FileNetworker} from "../network/fileNetworker"
import {bytesFromHex, bytesToHex, createNonce} from "../utils/bin"
import {AuthAPI} from "../../api/auth"
import {sendReqPQ} from "../connect/methods"
import {Networker} from "../network/networker"

const fileNetworkers = {}
const networker = {}

async function createFileNetworker(dcID) {
    if (AppPermanentStorage.exists("authKey" + dcID)) {
        // i changed it to MTProtoNetworker cause Networker does not have `invokeMethod` function @undrfined
        const networker = new FileNetworker({
            dcID: dcID,
            nonce: createNonce(16),
            sessionID: createNonce(8), // TODO check if secure?
            updates: false,
            authKey: new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("authKey" + dcID))),
            serverSalt: new Uint8Array(bytesFromHex(AppPermanentStorage.getItem("serverSalt" + dcID)))
        })
        const list = this.fileNetworkers[dcID]
        this.fileNetworkers[dcID] = networker
        list.forEach(l => {
            l.resolve(networker.invokeMethod(l.method, l.parameters))
        })
        return networker
    }
    const authContext = {
        dcID: dcID,
        nonce: createNonce(16),
        sessionID: createNonce(8), // TODO check if secure?
        exportedAuth: await AuthAPI.exportAuth(dcID),
        updates: false
    }

    return new Promise(resolve => {
        sendReqPQ(authContext, e => {
            const networker = new Networker(authContext)

            const list = this.fileNetworkers[dcID]
            this.fileNetworkers[dcID] = networker
            authContext.authKey = new Uint8Array(authContext.authKey)
            authContext.serverSalt = new Uint8Array(authContext.serverSalt)

            AuthAPI.importAuth(authContext.exportedAuth, dcID).then(response => {
                list.forEach(async l => {
                    l.resolve(networker.invokeMethod(l.method, l.parameters))
                })
                authContext.authKey = new Uint8Array(authContext.authKey)
                authContext.serverSalt = new Uint8Array(authContext.serverSalt)

                AppPermanentStorage.setItem("authKey" + authContext.dcID, bytesToHex(authContext.authKey))
                AppPermanentStorage.setItem("serverSalt" + authContext.dcID, bytesToHex(authContext.serverSalt))

                resolve(networker)
            })
        }, this)
    })
}

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    const method = taskData.method
    const parameters = taskData.parameters
    const dcID = taskData.dcID
    const authContext = taskData.authContext

    let result = null

    switch (task) {
        case "invokeMethod":
            if (dcID !== null && dcID !== this.authContext.dcID) {
                let networker = fileNetworkers[dcID]
                if (Array.isArray(networker)) {
                    result = new Promise(resolve => {
                        networker.push({method, parameters, resolve})
                    })
                }
                if (!networker) {
                    fileNetworkers[dcID] = []
                    result = new Promise(resolve => {
                        result = createFileNetworker(dcID).then(networker => {
                            networker.invokeMethod(method, parameters).then(resolve)
                        })
                    })
                }

                result = networker.invokeMethod(method, parameters)
            }

            result = networker.invokeMethod(method, parameters)

            break

        default:
            throw new Error("Unknown task: " + task)
    }

    postMessage({taskId: taskId, taskResult: result})
})
