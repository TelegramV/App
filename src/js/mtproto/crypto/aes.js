import CryptoJS from "../vendor/crypto"
import {bytesFromWords, bytesToWords} from "../utils/bin"
import Bytes from "../utils/bytes"

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
    bytes = Bytes.addPadding(bytes)

    const encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    }).ciphertext

    return bytesFromWords(encryptedWords)
}

export function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {
    const decryptedWords = CryptoJS.AES.decrypt({ciphertext: bytesToWords(encryptedBytes)}, bytesToWords(keyBytes), {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    })

    return bytesFromWords(decryptedWords)
}
