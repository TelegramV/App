import CryptoWorker from "../workers/crypto.worker"
import {aesDecryptSync, aesEncryptSync} from "./aes"
import {createLogger} from "../../common/logger"
import {sha1HashSync, sha256HashSync} from "./sha"
import mt_srp_check_password from "./mt_srp/mt_srp";
import PQ from "../utils/pq"

const Logger = createLogger("CryptoManager", {
    level: "warn"
})

let _canWork = window.Worker || false
let _lastTaskId = 0
let _waitingTasks = {}

const _cryptoWorker = _canWork ? new CryptoWorker() : undefined

/**
 * @param {number} taskId
 * @param {*} taskResult
 */
function resolveTask(taskId, taskResult) {
    const resolve = _waitingTasks[taskId]

    Logger.debug(`resolving task = `, taskId)

    if (resolve) {
        resolve(taskResult)
        delete _waitingTasks[taskId]
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

    Logger.debug(`performing task [${task}] = `, _lastTaskId)

    _cryptoWorker.postMessage({
        task: task,
        taskId: _lastTaskId,
        taskData: data
    })
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} keyBytes
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} ivBytes
 * @return {Promise<Array>|Promise<any>}
 */
function aesEncrypt(bytes, keyBytes, ivBytes) {
    if (_canWork) {
        return new Promise(resolve => {
            performTask("aesEncrypt", {
                bytes, keyBytes, ivBytes
            }, resolve)
        })
    } else {
        const enc = aesEncryptSync(bytes, keyBytes, ivBytes)
        return Promise.resolve(enc)
    }
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} encryptedBytes
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} keyBytes
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} ivBytes
 * @return {Promise<Array>|Promise<any>}
 */
function aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
    if (_canWork) {
        return new Promise(resolve => {
            performTask("aesDecrypt", {
                encryptedBytes, keyBytes, ivBytes
            }, resolve)
        })
    } else {
        const enc = aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
        return Promise.resolve(enc)
    }
}

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
    if (_canWork) {
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

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} pq
 * @return {Promise<any>|Promise<{p: *, q: *}>}
 */
function decomposePQ(pq) {
    if (_canWork) {
        return new Promise(resolve => {
            performTask("decomposePQ", {
                pq
            }, resolve)
        })
    } else {
        return Promise.resolve(PQ.decompose(pq))
    }
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer} bytes
 * @return {Promise<ArrayBuffer|Array>}
 */
function sha1Hash(bytes) {
    if (_canWork) {
        return new Promise(resolve => {
            performTask("sha1Hash", {
                bytes
            }, resolve)
        })
    } else {
        const enc = sha1HashSync(bytes)
        return Promise.resolve(enc)
    }
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array|ArrayBuffer} bytes
 * @return {Promise<ArrayBuffer|Array>}
 */
function sha256Hash(bytes) {
    if (_canWork) {
        return new Promise(resolve => {
            performTask("sha256Hash", {
                bytes
            }, resolve)
        })
    } else {
        const enc = sha256HashSync(bytes)
        return Promise.resolve(enc)
    }
}

if (_canWork) {
    _cryptoWorker.addEventListener("message", event => {
        if (event.data.taskId) {
            resolveTask(event.data.taskId, event.data.taskResult)
        }
    })
}

const AppCryptoManager = {
    aesEncrypt,
    aesDecrypt,
    srpCheckPassword,
    decomposePQ,
    sha1Hash,
    sha256Hash
}

export default AppCryptoManager
