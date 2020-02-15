import CryptoJS from "../vendor/crypto"
import {bytesFromWords, bytesToWords} from "../utils/bin"
import Bytes from "../utils/bytes"
import * as sjcl from "./mt_srp/sjcl"
import aesjs from "../utils/aes"

// import crypto from "crypto"

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
    console.warn("eb", encryptedBytes, keyBytes, ivBytes)
    const decryptedWords = CryptoJS.AES.decrypt({ciphertext: bytesToWords(encryptedBytes)}, bytesToWords(keyBytes), {
        iv: bytesToWords(ivBytes),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    })

    console.log("words", decryptedWords)

    return bytesFromWords(decryptedWords)
}

// https://mgp25.com/AESIGE/
// https://gist.github.com/Rulexec/f4ddf6e7a859b837f996b3f50097153a
export async function AES_IGE_DECRYPT(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
    const cipter = new aesjs.ModeOfOperation.ige(key, iv)

    return cipter.decrypt(data)
}

// https://mgp25.com/AESIGE/
// https://gist.github.com/Rulexec/f4ddf6e7a859b837f996b3f50097153a
export async function AES_IGE_ENCRYPT(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
    Bytes.addPadding(data)

    const cipter = new aesjs.ModeOfOperation.ige(key, iv)

    return cipter.encrypt(data)
}