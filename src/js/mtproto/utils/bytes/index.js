import {BigInteger} from "../../vendor/jsbn/jsbn"
import {bufferConcat, uint6ToBase64} from "../bin"
import {SecureRandomSingleton} from "../singleton"

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} a
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} b
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
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} a
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} b
 * @return {Array}
 */
function xor(a, b) {
    const c = []

    for (let i = 0; i < a.length; ++i) {
        c[i] = a[i] ^ b[i]
    }

    return c
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
 * @return {ArrayBufferLike}
 */
function asUint8Buffer(bytes) {
    return asUint8Array(bytes).buffer
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
 * @return {Uint8Array|*}
 */
function asUint8Array(bytes) {
    if (bytes.buffer !== undefined) {
        return bytes
    }

    return new Uint8Array(bytes)
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
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
 * @param {ArrayBuffer} buffer
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
 * @return {Uint8Array}
 */
function fromBigInteger(bigInteger, length = undefined) {
    let bytes = new Uint8Array(bigInteger.toByteArray())

    if (length && bytes.length < length) {
        const padding = []
        for (let i = 0, needPadding = length - bytes.length; i < needPadding; i++) {
            padding[i] = 0
        }
        if (bytes instanceof ArrayBuffer) {
            bytes = bufferConcat(padding, bytes)
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
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} x
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} y
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} m
 * @return {number|Uint8Array}
 */
function modPow(x, y, m) {
    try {
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
    } catch (e) {
        console.error("mod pow error", e)
    }

    return Bytes.fromBigInteger(new BigInteger(x).modPow(new BigInteger(y), new BigInteger(m)), 256)
}

/**
 * @param {Array|Uint8Array|Uint16Array|Uint32Array} bytes
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

        if (bytes instanceof ArrayBuffer) {
            bytes = bufferConcat(bytes, padding)
        } else {
            bytes = bytes.concat(padding)
        }
    }

    return bytes
}

const Bytes = {
    compare,
    xor,
    asUint8Buffer,
    asUint8Array,
    asBase64,
    fromHex,
    asHex,
    fromArrayBuffer,
    fromBigInteger,
    modPow,
    addPadding,
}

export default Bytes
