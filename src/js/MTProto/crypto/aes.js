import CryptoJS from "../../../../vendor/CryptoJS"
import Bytes from "../utils/bytes"

export function AES_IGE_DECRYPT(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
    const decrypted = CryptoJS.AES.decrypt({ciphertext: Bytes.toWords(data)}, Bytes.toWords(key), {
        iv: Bytes.toWords(iv),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    })

    return new Uint8Array(Bytes.fromWords(decrypted))
}

export function AES_IGE_ENCRYPT(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
    data = Bytes.addPadding(data)

    const encrypted = CryptoJS.AES.encrypt(Bytes.toWords(data), Bytes.toWords(key), {
        iv: Bytes.toWords(iv),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    }).ciphertext

    return new Uint8Array(Bytes.fromWords(encrypted))
}
