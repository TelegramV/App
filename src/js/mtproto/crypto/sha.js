import Rusha from "rusha"
import CryptoJS from "../vendor/crypto"
import {bytesFromWords, bytesToWords} from "../utils/bin"
import Bytes from "../utils/bytes"

export const RushaSingleton = new Rusha(1024 * 1024);

export function sha1HashSync(bytes) {
    const rushaInstance = RushaSingleton || new Rusha(1024 * 1024)

    return rushaInstance.rawDigest(bytes).buffer
}

export function sha1BytesSync(bytes) {
    return Bytes.fromArrayBuffer(sha1HashSync(bytes))
}

/**
 * @param bytes
 * @return {Uint8Array}
 */
export function sha256HashSync(bytes) {
    const hashWords = CryptoJS.SHA256(bytesToWords(bytes))

    return new Uint8Array(bytesFromWords(hashWords))
}

export const SHA256 = (bytes: Uint8Array) => {
    return crypto.subtle.digest({name: "SHA-256"}, bytes).then(hash => new Uint8Array(hash))
}