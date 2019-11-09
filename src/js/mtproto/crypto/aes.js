import CryptoJS from "../vendor/crypto"
import {addPadding, bytesFromWords, bytesToWords} from "../utils/bin"

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
    bytes = addPadding(bytes)

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