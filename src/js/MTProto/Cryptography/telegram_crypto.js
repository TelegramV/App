/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import aes_ige_decrypt from "./aes_ige_decrypt"
import aes_ige_encrypt from "./aes_ige_encrypt"
import sha256 from "./sha256"
import Uint8 from "../Utils/Uint8"

const {substr, concat} = Uint8;

const compute_msg_key = (plaintext: Uint8Array, auth_key: Uint8Array, x = 0) => {
    if (!(plaintext instanceof Uint8Array)) {
        plaintext = new Uint8Array(plaintext)
    }
    if (!(auth_key instanceof Uint8Array)) {
        auth_key = new Uint8Array(auth_key)
    }

    const msg_key_large = sha256(concat(substr(auth_key, 88 + x, 32), plaintext))

    return substr(msg_key_large, 8, 16);

}

const compute_auth_key_and_iv = (auth_key: Uint8Array, msg_key: Uint8Array, x) => {
    const sha256_a = sha256(concat(msg_key, substr(auth_key, x, 36)))
    const sha256_b = sha256(concat(substr(auth_key, 40 + x, 36), msg_key))
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

    return aes_ige_decrypt(data, computed.aes_key, computed.aes_iv)
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

    return aes_ige_encrypt(data, computed.aes_key, computed.aes_iv)
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

const telegram_crypto = {
    decrypt: decrypt,
    encrypt: encrypt,
    encrypt_message: encrypt_message,
    decrypt_message: decrypt_message,
    compute_key_and_iv: compute_auth_key_and_iv,
    compute_msg_key: compute_msg_key,
}

export default telegram_crypto
