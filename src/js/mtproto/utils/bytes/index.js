import {uint6ToBase64} from "../bin"
import {SecureRandomSingleton} from "../singleton"
import crypto from "crypto"
import VBigInt from "../../bigint/VBigInt"
import {BigInteger} from "../../vendor/jsbn/jsbn"
import CryptoJS from "../../vendor/crypto"

/**
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @return {boolean}
 */
function compare(a, b) {
    if (a.length !== b.length) {
        return false
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }

    return true
}

/**
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @return {Array|ArrayLike|ArrayBufferLike}
 */
function xor(a, b) {
    const c = []

    for (let i = 0; i < a.length; ++i) {
        c[i] = a[i] ^ b[i]
    }

    return c
}

function xorBuffer(a, b) {
    var length = Math.min(a.length, b.length)


    for (let i = 0; i < length; ++i) {
        a[i] = a[i] ^ b[i]
    }

    return a
}

function xorA(a, b) {
    for (let i = 0; i < Math.min(a.length, b.length); ++i) {
        a[i] = a[i] ^ b[i]
    }

    return a
}

/**
 * @param {Array|ArrayLike|ArrayBufferLike} bytes
 * @return {Array|ArrayLike|ArrayBufferLike}
 */
function asUint8Buffer(bytes) {
    return asUint8Array(bytes).buffer
}

/**
 * @param {Array|ArrayLike|ArrayBufferLike} bytes
 * @return {Array|ArrayLike|ArrayBufferLike}
 */
function asUint8Array(bytes) {
    if (bytes instanceof Uint8Array) {
        return bytes
    }

    return new Uint8Array(bytes)
}

/**
 * @param {Array|ArrayLike|ArrayBufferLike} bytes
 * @return {string}
 */
function asBase64(bytes) {
    let mod3
    let result = ""

    for (let nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
        mod3 = nIdx % 3
        nUint24 |= bytes[nIdx] << (16 >>> mod3 & 24)
        if (mod3 === 2 || nLen - nIdx === 1) {
            result += String.fromCharCode(
                uint6ToBase64(nUint24 >>> 18 & 63),
                uint6ToBase64(nUint24 >>> 12 & 63),
                uint6ToBase64(nUint24 >>> 6 & 63),
                uint6ToBase64(nUint24 & 63)
            )
            nUint24 = 0
        }
    }

    return result.replace(/A(?=A$|$)/g, '=')
}

/**
 * @param {string} hex
 * @return {Array}
 */
function fromHex(hex) {
    const bytes = []
    let start = 0

    if (hex.length % 2) {
        bytes.push(parseInt(hex.charAt(0), 16))
        start++
    }

    for (let i = start; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16))
    }

    return bytes
}

/**
 * @param {Array|ArrayLike|ArrayBufferLike} buffer
 * @return {Array}
 */
function fromArrayBuffer(buffer) {
    const len = buffer.byteLength
    const byteView = new Uint8Array(buffer)
    const bytes = []

    for (let i = 0; i < len; ++i) {
        bytes[i] = byteView[i]
    }

    return bytes
}

/**
 * @param {BigInteger} bigInteger
 * @param {number} length
 * @return {Array|ArrayLike|ArrayBufferLike}
 */
function fromBigInteger(bigInteger, length = undefined) {
    let bytes = new Uint8Array(bigInteger.toByteArray())

    if (length && bytes.length < length) {
        const padding = []
        for (let i = 0, needPadding = length - bytes.length; i < needPadding; i++) {
            padding[i] = 0
        }
        if (bytes instanceof ArrayBuffer) {
            bytes = Bytes.concatBuffer(padding, bytes)
        } else {
            bytes = padding.concat(bytes)
        }
    } else {
        while (!bytes[0] && (!length || bytes.length > length)) {
            bytes = bytes.slice(1)
        }
    }

    return bytes
}


/**
 * @param {Array|ArrayLike|ArrayBufferLike} x
 * @param {Array|ArrayLike|ArrayBufferLike} y
 * @param {Array|ArrayLike|ArrayBufferLike} m
 * @return {number|ArrayLike|ArrayBufferLike}
 */
function modPow(x, y, m) {
    try {
        const xBigInt = VBigInt.create(asHex(x), 16)
        const yBigInt = VBigInt.create(asHex(y), 16)
        const mBigInt = VBigInt.create(asHex(m), 16)
        let res = xBigInt.modPow(yBigInt, mBigInt).toByteArray()
        if (res.length > 256) {
            res = res.splice(res.length - 256)
        } else if (res.length < 256) {
            return res.unshift(0)
        }

        return res
        /*
        const xBigInt = new BigInteger(asHex(x), 16)
        const yBigInt = new BigInteger(asHex(y), 16)
        const mBigInt = new BigInteger(asHex(m), 16)
        let resBigInt = xBigInt.modPow(yBigInt, mBigInt).toByteArray()
        if (resBigInt.length > 256) {
            resBigInt = resBigInt.splice(resBigInt.length - 256)
        } else if (resBigInt.length < 256) {
            return resBigInt.unshift(0)
        }

        return resBigInt
         */
    } catch (e) {
        console.error("mod pow error", e)
    }

    return VBigInt.create(x).modPow(y, m).getBytes(256)
}


/**
 * @param {Array|ArrayLike|ArrayBufferLike} bytes
 * @return {string}
 */
function asHex(bytes) {
    const arr = []

    for (let i = 0; i < bytes.length; i++) {
        arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16))
    }

    return arr.join("")
}

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
        const padding = new Array(needPadding)

        if (zeroes) {
            for (let i = 0; i < needPadding; i++) {
                padding[i] = 0
            }
        } else {
            SecureRandomSingleton.nextBytes(padding)
        }

        console.error("padding",padding)

        if (bytes instanceof ArrayBuffer) {
            bytes = Bytes.concatBuffer(bytes, padding)
        } else {
            bytes = bytes.concat(padding)
        }
    }

    return bytes
}

/**
 *
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @returns {Uint8Array}
 */
function concat(a, b) {
    const l1 = a.byteLength || a.length
    const l2 = b.byteLength || b.length
    const tmp = new Uint8Array(l1 + l2)

    tmp.set(a instanceof ArrayBuffer ? new Uint8Array(a) : a, 0)
    tmp.set(b instanceof ArrayBuffer ? new Uint8Array(b) : b, l1)

    return tmp
}

/**
 *
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @returns {ArrayBufferLike}
 */
function concatBuffer(a, b) {
    return concat(a, b).buffer
}

/**
 * @param {number} length
 * @return {Array}
 */
function randomArray(length = 32) {
    const bytesArray = new Array(length)
    SecureRandomSingleton.nextBytes(bytesArray)
    return bytesArray
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
 * @param {number} length
 * @return {ArrayBufferLike|ArrayBuffer|Buffer}
 */
function randomBuffer(length = 32) {
    return crypto.randomBytes(length)
}

const Bytes = {
    compare,
    xor,
    xorBuffer,
    xorA,
    asUint8Buffer,
    asUint8Array,
    asBase64,
    fromHex,
    asHex: asHex,
    fromArrayBuffer: fromArrayBuffer,
    fromBigInteger: fromBigInteger,
    modPow: modPow,
    addPadding: addPadding,
    concat,
    fromWords,
    toWords,
    concatBuffer: concatBuffer,
}

export default Bytes
