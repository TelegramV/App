/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import crypto from "crypto"
import CryptoJS from "../../../../vendor/CryptoJS"
import Uint8 from "./Uint8"

/**
 * @param {ArrayBuffer|Array|Uint8Array|Uint16Array|Uint32Array} bytes
 * @param {number} blockSize
 * @param {boolean} zeroes
 * @return {{byteLength}}
 */
function addPadding(bytes, blockSize = 16, zeroes = false) {
    const len = bytes.byteLength || bytes.length
    const needPadding = blockSize - (len % blockSize)

    if (needPadding > 0 && needPadding < blockSize) {
        const padding = Array.from(crypto.randomBytes(needPadding))

        if (zeroes) {
            for (let i = 0; i < needPadding; i++) {
                padding[i] = 0
            }
        }

        if (bytes instanceof ArrayBuffer) {
            bytes = Bytes.concatBuffer(bytes, padding)
        } else {
            if (bytes instanceof Uint8Array) {
                bytes = Uint8.concat(bytes, padding)
            } else {
                bytes = bytes.concat(padding)
            }
        }
    }

    return bytes
}

/**
 *
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @returns {ArrayBufferLike}
 */
function concatBuffer(a, b) {
    return Uint8.concat(a, b).buffer
}

function fromWords(wordArray) {
    const words = wordArray.words
    const sigBytes = wordArray.sigBytes
    const bytes = []

    for (let i = 0; i < sigBytes; i++) {
        bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)
    }

    return bytes
}

function toWords(bytes) {
    if (bytes instanceof ArrayBuffer) {
        bytes = new Uint8Array(bytes)
    }

    const len = bytes.length
    const words = []

    for (let i = 0; i < len; i++) {
        words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8)
    }

    return new CryptoJS.lib.WordArray.init(words, len)
}

/**
 * @deprecated треба переписати все під Uint8Array, я цим вже займаюсь (Uint8.js)
 */
const Bytes = {
    addPadding: addPadding,
    fromWords: fromWords,
    toWords: toWords,
    concatBuffer: concatBuffer,
}

export default Bytes
