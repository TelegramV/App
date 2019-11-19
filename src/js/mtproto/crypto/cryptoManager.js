import CryptoWorker from "../workers/crypto.worker"
import {aesDecryptSync, aesEncryptSync} from "./aes"
import {pqPrimeFactorization} from "../utils/bin"
import {createLogger} from "../../common/logger"
import {PqFinder} from "../connect/pqFinder"
import {sha1HashSync} from "./sha"
import mt_srp_check_password from "./mt_srp/mt_srp";

const Logger = createLogger("CryptoManager", {
    level: "warn"
})

class CryptoManager {
    constructor(props = {}) {
        this.canWork = true
        if (this.canWork) {
            this.cryptoWorker = new CryptoWorker()
            this.cryptoWorker.addEventListener("message", event => {
                if (event.data.taskId) {
                    this.resolveTask(event.data.taskId, event.data.taskResult)
                }
            })
        }
        this.lastTaskId = 0
        this.waitingTasks = {}
    }

    resolveTask(taskId, taskResult) {
        const resolve = this.waitingTasks[taskId]

        Logger.debug(`resolving task = `, taskId)

        if (resolve) {
            resolve(taskResult)
            delete this.waitingTasks[taskId]
        }
    }

    performTask(task, data, promise) {
        this.lastTaskId++

        this.waitingTasks[this.lastTaskId] = promise

        Logger.debug(`performing task [${task}] = `, this.lastTaskId)

        this.cryptoWorker.postMessage({
            task: task,
            taskId: this.lastTaskId,
            taskData: data
        })
    }

    aesEncrypt(bytes, keyBytes, ivBytes) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("aesEncrypt", {
                    bytes, keyBytes, ivBytes
                }, resolve)
            })
        } else {
            const enc = aesEncryptSync(bytes, keyBytes, ivBytes)
            return Promise.resolve(enc)

        }
    }

    mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("mt_srp_check_password", {
                    g, p, salt1, salt2, srp_id, srp_B, password
                }, resolve)
            })
        } else {
            const enc = mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password)
            return Promise.resolve(enc)
        }
    }

    aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("aesDecrypt", {
                    encryptedBytes, keyBytes, ivBytes
                }, resolve)
            })
        } else {
            const enc = aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
            return Promise.resolve(enc)
        }
    }

    pqPrimeFactorization(bytes) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("pqPrimeFactorization", {
                    bytes
                }, resolve)
            })
        } else {
            const enc = pqPrimeFactorization(bytes)
            return Promise.resolve(enc)
        }
    }

    findPQ(pq) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("findPQ", {
                    pq
                }, resolve)
            })
        } else {
            const pqFinder = new PqFinder(pq)
            pqFinder.findPQ()

            const p = pqFinder.getPQAsBuffer()[0]
            const q = pqFinder.getPQAsBuffer()[1]

            return Promise.resolve({p, q})
        }
    }

    sha1Hash(bytes) {
        if (this.canWork) {
            return new Promise(resolve => {
                this.performTask("sha1Hash", {
                    bytes
                }, resolve)
            })
        } else {
            const enc = sha1HashSync(bytes)
            return Promise.resolve(enc)
        }
    }
}

export const AppCryptoManager = new CryptoManager()
export default AppCryptoManager
