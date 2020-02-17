/**
 * (c) Telegram V
 */

import {AES_IGE_DECRYPT, AES_IGE_ENCRYPT} from "./aes"
import {SHA256} from "./sha"

export const substr = (bytes: Uint8Array, begin, len) => {
    if (!(bytes instanceof Uint8Array)) {
        bytes = new Uint8Array(bytes)
    }

    return bytes.slice(begin, begin + len)
}

export const concat = (...uint8Arrays: Uint8Array[]) => {
    let length = 0

    for (let i = 0; i < uint8Arrays.length; i++) {
        length += uint8Arrays[i].length
    }

    const uint8Array = new Uint8Array(length)

    let offset = 0

    for (let i = 0; i < uint8Arrays.length; i++) {
        uint8Array.set(uint8Arrays[i], offset)
        offset += uint8Arrays[i].length
    }

    return uint8Array
}

const compute_msg_key = (plaintext: Uint8Array, auth_key: Uint8Array, x = 0) => {
    if (!(plaintext instanceof Uint8Array)) {
        plaintext = new Uint8Array(plaintext)
    }
    if (!(auth_key instanceof Uint8Array)) {
        auth_key = new Uint8Array(auth_key)
    }

    const msg_key_large = SHA256(concat(substr(auth_key, 88 + x, 32), plaintext))

    return substr(msg_key_large, 8, 16);

}

const compute_auth_key_and_iv = (auth_key: Uint8Array, msg_key: Uint8Array, x) => {
    const sha256_a = SHA256(concat(msg_key, substr(auth_key, x, 36)))
    const sha256_b = SHA256(concat(substr(auth_key, 40 + x, 36), msg_key))
    const aes_key = concat(substr(sha256_a, 0, 8), substr(sha256_b, 8, 16), substr(sha256_a, 24, 8))
    const aes_iv = concat(substr(sha256_b, 0, 8), substr(sha256_a, 8, 16), substr(sha256_b, 24, 8))

    return {
        aes_key,
        aes_iv
    }
}

const decrypt = (data: Uint8Array, auth_key: Uint8Array, msg_key: Uint8Array, x = 0) => {
    if (!(data instanceof Uint8Array)) {
        data = new Uint8Array(data)
    }
    if (!(auth_key instanceof Uint8Array)) {
        auth_key = new Uint8Array(auth_key)
    }
    if (!(msg_key instanceof Uint8Array)) {
        msg_key = new Uint8Array(msg_key)
    }

    const computed = compute_auth_key_and_iv(auth_key, msg_key, x)

    return AES_IGE_DECRYPT(data, computed.aes_key, computed.aes_iv)
}

const encrypt = (data: Uint8Array, auth_key: Uint8Array, msg_key: Uint8Array, x = 0) => {
    if (!(data instanceof Uint8Array)) {
        data = new Uint8Array(data)
    }
    if (!(auth_key instanceof Uint8Array)) {
        auth_key = new Uint8Array(auth_key)
    }
    if (!(msg_key instanceof Uint8Array)) {
        msg_key = new Uint8Array(msg_key)
    }

    const computed = compute_auth_key_and_iv(auth_key, msg_key, x)

    return AES_IGE_ENCRYPT(data, computed.aes_key, computed.aes_iv)
}

const encrypt_message = (data: Uint8Array, auth_key: Uint8Array, x = 0) => {
    const msg_key = compute_msg_key(data, auth_key, x)

    const encrypted = encrypt(data, auth_key, msg_key, x)

    return {
        bytes: encrypted,
        msg_key: msg_key
    }
}

const decrypt_message = (data: Uint8Array, auth_key: Uint8Array, msg_key: Uint8Array, x = 8) => {
    const encrypted = decrypt(data, auth_key, msg_key, x)
    msg_key = compute_msg_key(encrypted, auth_key, x)

    return {
        bytes: encrypted,
        msg_key: msg_key
    }
}

const TELEGRAM_CRYPTO = {
    decrypt: decrypt,
    encrypt: encrypt,
    encrypt_message: encrypt_message,
    decrypt_message: decrypt_message,
    compute_key_and_iv: compute_auth_key_and_iv,
    compute_msg_key: compute_msg_key,
}

export default TELEGRAM_CRYPTO
