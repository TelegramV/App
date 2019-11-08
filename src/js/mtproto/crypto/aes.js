import CryptoJS from "../vendor/crypto"
import {addPadding, bytesFromWords, bytesToWords} from "../utils/bin"

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
    const len = bytes.byteLength || bytes.length

    // console.log(dT(), 'AES encrypt start', len/*, bytesToHex(keyBytes), bytesToHex(ivBytes)*/)
    bytes = addPadding(bytes)
    const encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    }).ciphertext

    const encryptedBytes = bytesFromWords(encryptedWords)
    // console.log(dT(), 'AES encrypt finish')

    return encryptedBytes
}

export function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {
    // console.log('AES decrypt start', encryptedBytes.length)

    const decryptedWords = CryptoJS.AES.decrypt({ciphertext: bytesToWords(encryptedBytes)}, bytesToWords(keyBytes), {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    })

    const bytes = bytesFromWords(decryptedWords)
    // console.log('AES decrypt finish')

    return bytes
}