import mt_srp_check_password from "../crypto/mt_srp/mt_srp";

self.addEventListener("message", event => {
    const eventData = event.data

    const task = eventData.task
    const taskId = eventData.taskId
    const taskData = eventData.taskData

    let result = null

    switch (task) {

        // case "modPow":
        //     result = Bytes.modPow(taskData.x, taskData.y, taskData.m)
        //     break
        //
        // case "sha1Hash":
        //     result = sha1HashSync(taskData.bytes)
        //     break
        //
        // case "sha256Hash":
        //     result = sha256HashSync(taskData.bytes)
        //     break
        //
        // case "aesEncrypt":
        //     result = aesEncryptSync(taskData.bytes, taskData.keyBytes, taskData.ivBytes)
        //     break
        //
        // case "aesDecrypt":
        //     result = aesDecryptSync(taskData.encryptedBytes, taskData.keyBytes, taskData.ivBytes)
        //     break

        case "mt_srp_check_password":
            result = mt_srp_check_password(taskData.g, taskData.p, taskData.salt1, taskData.salt2, taskData.srp_id, taskData.srp_B, taskData.password)
            break

        default:
            throw new Error("Unknown task: " + task)
    }

    postMessage({taskId: taskId, taskResult: result})
})

postMessage("ready")
