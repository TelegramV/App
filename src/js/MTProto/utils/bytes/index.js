import {uint6ToBase64} from "../bin"
import crypto from "crypto"
import CryptoJS from "../../../../../vendor/CryptoJS"
import BigInteger from "big-integer"

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
        const padding = Array.from(crypto.randomBytes(needPadding))

        if (zeroes) {
            for (let i = 0; i < needPadding; i++) {
                padding[i] = 0
            }
        }

        console.error("padding", padding)

        if (bytes instanceof ArrayBuffer) {
            bytes = Bytes.concatBuffer(bytes, padding)
        } else {
            if (bytes instanceof Uint8Array) {
                bytes = concat(bytes, padding)
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

// https://ourcodeworld.com/articles/read/164/how-to-convert-an-uint8array-to-string-in-javascript
function uInt8ArrayToString(uInt8Array: Uint8Array) {
    let out, i, len, c
    let char2, char3

    out = "";
    len = uInt8Array.byteLength
    i = 0;

    while (i < len) {
        c = uInt8Array[i++]
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c)
                break
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = uInt8Array[i++]
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
                break
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = uInt8Array[i++]
                char3 = uInt8Array[i++]
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0))
                break;

            default:
                out += String.fromCharCode(c)
                break
        }
    }

    return out;
}

const fromBigInteger = (bigInt) => {
    return new Uint8Array(bigInt.toArray(256).value)
}

const toBigInteger = (bytes: Uint8Array) => {
    return BigInteger.fromArray(Array.isArray(bytes) ? bytes : Array.from(bytes), 256, false)
}

function modPow(x, y, m) {
    console.log(x, y, m)

    const xBigInt = BigInteger(asHex(x), 16)
    const yBigInt = BigInteger(asHex(y), 16)
    const mBigInt = BigInteger(asHex(m), 16)

    console.log(xBigInt, yBigInt, mBigInt)

    let res = fromBigInteger(xBigInt.modPow(yBigInt, mBigInt))

    if (res.length > 256) {
        res = res.splice(res.length - 256)
    } else if (res.length < 256) {
        return res.unshift(0)
    }

    return res
}

const Bytes = {
    compare,
    xor,
    xorBuffer,
    xorA,
    asUint8Buffer: asUint8Buffer,
    asUint8Array,
    asBase64,
    fromHex,
    asHex: asHex,
    fromArrayBuffer: fromArrayBuffer,
    fromBigInteger: fromBigInteger,
    toBigInteger: toBigInteger,
    addPadding: addPadding,
    concat,
    fromWords,
    toWords,
    concatBuffer: concatBuffer,
    uInt8ArrayToString: uInt8ArrayToString,
    modPow: modPow
}

export default Bytes
