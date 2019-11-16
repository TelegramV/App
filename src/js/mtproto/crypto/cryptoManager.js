import CryptoWorker from "../workers/crypto.worker"
import {aesDecryptSync, aesEncryptSync} from "./aes"
import {pqPrimeFactorization} from "../utils/bin"
import {createLogger} from "../../common/logger"
import {PqFinder} from "../connect/pqFinder"
import {sha1HashSync} from "./sha"

const Logger = createLogger("CryptoManager", {
    level: "warn"
})

class CryptoManager {
    constructor(props = {}) {
        this.canWork = false
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
            return new Promise(resolve => {
                const enc = aesEncryptSync(bytes, keyBytes, ivBytes)
                resolve(enc)
            })
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
            return new Promise(resolve => {
                const enc = aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
                resolve(enc)
            })
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
            return new Promise(resolve => {
                const enc = pqPrimeFactorization(bytes)
                resolve(enc)
            })
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
            return new Promise(resolve => {
                const pqFinder = new PqFinder(pq)
                pqFinder.findPQ()

                const p = pqFinder.getPQAsBuffer()[0]
                const q = pqFinder.getPQAsBuffer()[1]

                resolve({p, q})
            })
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
            return new Promise(resolve => {
                const enc = sha1HashSync(bytes)
                resolve(enc)
            })
        }
    }
}

export const AppCryptoManager = new CryptoManager()
export default AppCryptoManager
