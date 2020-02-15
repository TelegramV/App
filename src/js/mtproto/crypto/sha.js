import Rusha from "rusha"
import CryptoJS from "../vendor/crypto"
import Bytes from "../utils/bytes"

export const RushaSingleton = new Rusha(1024 * 1024)

export function SHA1_ArrayBuffer(bytes) {
    const rushaInstance = RushaSingleton || new Rusha(1024 * 1024)

    return rushaInstance.rawDigest(bytes).buffer
}

export function SHA1(bytes) {
    return Bytes.fromArrayBuffer(SHA1_ArrayBuffer(bytes))
}

/**
 * @param bytes
 * @return {Uint8Array}
 */
export function SHA256(bytes) {
    const hashWords = CryptoJS.SHA256(Bytes.toWords(bytes))

    return new Uint8Array(Bytes.fromWords(hashWords))
}