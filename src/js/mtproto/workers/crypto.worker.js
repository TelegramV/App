import {bytesModPow, getBytes, pqPrimeFactorization} from "../utils/bin"
import {sha1HashSync} from "../crypto/sha"
import {aesDecryptSync, aesEncryptSync} from "../crypto/aes"
import {bytesToBigInt, factorizeBigInt} from "../utils/nativeBigInt"

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    let result = null

    switch (task) {
        case "findPQ":
            const pq = factorizeBigInt(bytesToBigInt(taskData.pq))
            const p = getBytes(Number(pq[0]), 4)
            const q = getBytes(Number(pq[1]), 4)
            result = {p, q}

            break
        case "pqPrimeFactorization":
            result = pqPrimeFactorization(taskData.bytes)
            break

        case "bigModPow":
            result = bytesModPow(taskData.x, taskData.y, taskData.m)
            break

        case "sha1Hash":
            result = sha1HashSync(taskData.bytes)
            break

        case "aesEncrypt":
            console.log(taskData.ivBytes)
            result = aesEncryptSync(taskData.bytes, taskData.keyBytes, taskData.ivBytes)
            break

        case "aesDecrypt":
            result = aesDecryptSync(taskData.encryptedBytes, taskData.keyBytes, taskData.ivBytes)
            break

        default:
            throw new Error("Unknown task: " + task)
    }

    postMessage({taskId: taskId, taskResult: result})
})

postMessage("ready")
