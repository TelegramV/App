import Rusha from "rusha"
import CryptoJS from "../vendor/crypto"
import {bytesFromArrayBuffer, bytesFromWords, bytesToWords} from "../utils/bin"

const rusha = new Rusha(1024 * 1024);

export function sha1HashSync(bytes) {
    const rushaInstance = rusha || new Rusha(1024 * 1024)

    return rushaInstance.rawDigest(bytes).buffer
}

export function sha1BytesSync(bytes) {
    return bytesFromArrayBuffer(sha1HashSync(bytes))
}

export function sha256HashSync(bytes) {
    const hashWords = CryptoJS.SHA256(bytesToWords(bytes))

    return bytesFromWords(hashWords)
}