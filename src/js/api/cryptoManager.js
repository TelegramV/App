import CryptoWorker from "../mtproto/workers/crypto.worker"
// import {aesDecryptSync, aesEncryptSync} from "./aes"
// import {createLogger} from "../../common/logger"
// import {sha1HashSync, sha256HashSync} from "./sha"
import mt_srp_check_password from "../mtproto/crypto/mt_srp/mt_srp";

let canWork = window.Worker || false
let _lastTaskId = 0
let _waitingTasks = {}
let _waitingPqTasks = {}

const cryptoWorker = canWork ? new CryptoWorker() : undefined

// const pqWorker = canWork ? new PQWorker() : undefined

/**
 * @param {number} taskId
 * @param {*} taskResult
 */
function resolveTask(taskId, taskResult) {
    const resolve = _waitingTasks[taskId]

    // Logger.debug(`resolving task = `, taskId)

    if (resolve) {
        resolve(taskResult)
        delete _waitingTasks[taskId]
    }
}

/**
 * @param {number} taskId
 * @param {*} taskResult
 */
function resolvePqTask(taskId, taskResult) {
    const resolve = _waitingPqTasks[taskId]

    // Logger.debug(`resolving task = `, taskId)

    if (resolve) {
        resolve(taskResult)
        delete _waitingPqTasks[taskId]
    }
}

/**
 * @param {string} task
 * @param {*} data
 * @param {function} promise
 */
function performTask(task, data, promise) {
    _lastTaskId++

    _waitingTasks[_lastTaskId] = promise

    // Logger.debug(`performing task [${task}] = `, _lastTaskId)

    cryptoWorker.postMessage({
        task: task,
        taskId: _lastTaskId,
        taskData: data
    })
}

// /**
//  * @param {string} task
//  * @param {*} data
//  * @param {function} promise
//  */
// function performPqTask(task, data, promise) {
//     _lastTaskId++
//
//     _waitingPqTasks[_lastTaskId] = promise
//
//     // Logger.debug(`performing task [${task}] = `, _lastTaskId)
//
//     pqWorker.postMessage({
//         task: task,
//         taskId: _lastTaskId,
//         taskData: data
//     })
// }

// /**
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} keyBytes
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} ivBytes
//  * @return {Promise<Array>|Promise<any>}
//  */
// function aesEncrypt(bytes, keyBytes, ivBytes) {
//     if (canWork) {
//         return new Promise(resolve => {
//             performTask("aesEncrypt", {
//                 bytes, keyBytes, ivBytes
//             }, resolve)
//         })
//     } else {
//         const enc = aesEncryptSync(bytes, keyBytes, ivBytes)
//         return Promise.resolve(enc)
//     }
// }

// /**
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} encryptedBytes
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} keyBytes
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} ivBytes
//  * @return {Promise<Array>|Promise<any>}
//  */
// function aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
//     if (canWork) {
//         return new Promise(resolve => {
//             performTask("aesDecrypt", {
//                 encryptedBytes, keyBytes, ivBytes
//             }, resolve)
//         })
//     } else {
//         const enc = aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
//         return Promise.resolve(enc)
//     }
// }

/**
 * @param g
 * @param p
 * @param salt1
 * @param salt2
 * @param srp_id
 * @param srp_B
 * @param password
 * @return {Promise<{srp_id, A, M1}>|Promise<any>}
 */
function srpCheckPassword(g, p, salt1, salt2, srp_id, srp_B, password) {
    if (canWork) {
        return new Promise(resolve => {
            performTask("mt_srp_check_password", {
                g, p, salt1, salt2, srp_id, srp_B, password
            }, resolve)
        })
    } else {
        const enc = mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password)
        return Promise.resolve(enc)
    }
}

// /**
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array} pq
//  * @return {Promise<any>|Promise<{p: *, q: *}>}
//  */
// function decomposePQ(pq) {
//     if (canWork) {
//         return new Promise(resolve => {
//             performPqTask("decomposePQ", {
//                 pq
//             }, resolve)
//         })
//     } else {
//         return Promise.resolve(PQ.decompose(pq))
//     }
// }

// /**
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer} bytes
//  * @return {Promise<ArrayBuffer|Array>}
//  */
// function sha1Hash(bytes) {
//     if (canWork) {
//         return new Promise(resolve => {
//             performTask("sha1Hash", {
//                 bytes
//             }, resolve)
//         })
//     } else {
//         const enc = sha1HashSync(bytes)
//         return Promise.resolve(enc)
//     }
// }

// /**
//  * @param {Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer} bytes
//  * @return {Promise<ArrayBuffer|Array>}
//  */
// function sha256Hash(bytes) {
//     if (canWork) {
//         return new Promise(resolve => {
//             performTask("sha256Hash", {
//                 bytes
//             }, resolve)
//         })
//     } else {
//         const enc = sha256HashSync(bytes)
//         return Promise.resolve(enc)
//     }
// }

if (canWork) {
    cryptoWorker.addEventListener("message", event => {
        if (event.data.taskId) {
            resolveTask(event.data.taskId, event.data.taskResult)
        }
    })

    // pqWorker.addEventListener("message", event => {
    //     if (event.data.taskId) {
    //         resolvePqTask(event.data.taskId, event.data.taskResult)
    //     }
    // })
}

const AppCryptoManager = {
    // aesEncrypt: aesEncrypt,
    // aesDecrypt: aesDecrypt,
    srpCheckPassword: srpCheckPassword, // todo: remove this
    // decomposePQ: decomposePQ,
    // sha1Hash: sha1Hash,
    // sha256Hash: sha256Hash
}

export default AppCryptoManager
