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
    // console.log(dT(), 'SHA-2 hash start', bytes.byteLength || bytes.length)
    const hashWords = CryptoJS.SHA256(bytesToWords(bytes))
    // console.log(dT(), 'SHA-2 hash finish')

    return bytesFromWords(hashWords)
}