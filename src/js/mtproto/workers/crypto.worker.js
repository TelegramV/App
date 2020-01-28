import {sha1HashSync, sha256HashSync} from "../crypto/sha"
import {aesDecryptSync, aesEncryptSync} from "../crypto/aes"
import mt_srp_check_password from "../crypto/mt_srp/mt_srp";
import Bytes from "../utils/bytes"


self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    let result = null

    switch (task) {

        case "modPow":
            result = Bytes.modPow(taskData.x, taskData.y, taskData.m)
            break

        case "sha1Hash":
            result = sha1HashSync(taskData.bytes)
            break

        case "sha256Hash":
            result = sha256HashSync(taskData.bytes)
            break

        case "aesEncrypt":
            result = aesEncryptSync(taskData.bytes, taskData.keyBytes, taskData.ivBytes)
            break

        case "aesDecrypt":
            result = aesDecryptSync(taskData.encryptedBytes, taskData.keyBytes, taskData.ivBytes)
            break

        case "mt_srp_check_password":
            result = mt_srp_check_password(taskData.g, taskData.p, taskData.salt1, taskData.salt2, taskData.srp_id, taskData.srp_B, taskData.password)
            break

        case "aes_decryptor":
            result = true
            // result = aes_decryptors[taskData.url].decrypt(new Uint8Array(taskData.data)).buffer
            break

        case "set_aes_decryptor":
            // aes_decryptors[taskData.url] = new aesjs.ModeOfOperation.ctr(taskData.deobf_key_256, new aesjs.Counter(taskData.deobf_vector_128));
            result = true
            break

        default:
            throw new Error("Unknown task: " + task)
    }

    postMessage({taskId: taskId, taskResult: result})
})

postMessage("ready")
