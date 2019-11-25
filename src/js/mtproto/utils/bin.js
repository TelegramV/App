import {BigInteger, SecureRandom} from "jsbn"
import CryptoJS from "../vendor/crypto"
import crypto from "crypto"
import pako from "pako"
import Bytes from "./bytes"
// import {str2bigInt} from "BigInt"

// Create a random Buffer
export function createRandomBuffer(bytesLength) {
    return new Buffer(crypto.randomBytes(bytesLength));
}

// Create a new nonce
export function createNonce(bytesLength) {
    return createRandomBuffer(bytesLength);
}

export function bigint(num) {
    return new BigInteger(num.toString(16), 16)
}

export function bigStringInt(strNum) {
    return new BigInteger(strNum, 10)
}

export function bytesToWords(bytes) {
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

export function bytesFromWords(wordArray) {
    const words = wordArray.words
    const sigBytes = wordArray.sigBytes
    const bytes = []

    for (let i = 0; i < sigBytes; i++) {
        bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)
    }

    return bytes
}

export function uint6ToBase64(nUint6) {
    return nUint6 < 26
        ? nUint6 + 65
        : nUint6 < 52
            ? nUint6 + 71
            : nUint6 < 62
                ? nUint6 - 4
                : nUint6 === 62
                    ? 43
                    : nUint6 === 63
                        ? 47
                        : 65
}

export function base64ToBlob(base64str, mimeType) {
    const sliceSize = 1024
    const byteCharacters = atob(base64str)
    const bytesLength = byteCharacters.length
    const slicesCount = Math.ceil(bytesLength / sliceSize)
    const byteArrays = new Array(slicesCount)

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize
        const end = Math.min(begin + sliceSize, bytesLength)

        const bytes = new Array(end - begin)

        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0)
        }

        byteArrays[sliceIndex] = new Uint8Array(bytes)
    }

    return blobConstruct(byteArrays, mimeType)
}

export function dataUrlToBlob(url) {
    // var name = 'b64blob ' + url.length
    // console.timeManager(name)
    const urlParts = url.split(',')
    const base64str = urlParts[1]
    const mimeType = urlParts[0].split(':')[1].split(';')[0]
    const blob = base64ToBlob(base64str, mimeType)
    // console.timeEnd(name)
    return blob
}

export function blobConstruct(blobParts, mimeType) {
    const safeMimeType = blobSafeMimeType(mimeType)
    let blob

    try {
        blob = new Blob(blobParts, {type: safeMimeType})
    } catch (e) {
        const bb = new BlobBuilder()
        Array.forEach(blobParts, function (blobPart) {
            bb.append(blobPart)
        })
        blob = bb.getBlob(safeMimeType)
    }
    return blob
}

export function blobSafeMimeType(mimeType) {
    if ([
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'audio/ogg',
        'audio/mpeg',
        'audio/mp4',
    ].indexOf(mimeType) === -1) {
        return 'application/octet-stream'
    }
    return mimeType
}

export function bytesToArrayBuffer(b) {
    return (new Uint8Array(b)).buffer
}

export function convertToArrayBuffer(bytes) {
    // Be careful with converting subarrays!!
    if (bytes instanceof ArrayBuffer) {
        return bytes
    }
    if (bytes.buffer !== undefined &&
        bytes.buffer.byteLength === bytes.length * bytes.BYTES_PER_ELEMENT) {
        return bytes.buffer
    }
    return Bytes.asUint8Buffer(bytes)
}

export function convertToUint8Array(bytes) {
    if (bytes.buffer !== undefined) {
        return bytes
    }

    return new Uint8Array(bytes)
}

export function convertToByteArray(bytes) {
    if (Array.isArray(bytes)) {
        return bytes
    }

    bytes = Bytes.asUint8Array(bytes)

    const newBytes = []

    for (let i = 0, len = bytes.length; i < len; i++) {
        newBytes.push(bytes[i])
    }

    return newBytes
}

export function bufferConcat(buffer1, buffer2) {
    const l1 = buffer1.byteLength || buffer1.length
    const l2 = buffer2.byteLength || buffer2.length
    const tmp = new Uint8Array(l1 + l2)

    tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0)
    tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1)

    return tmp.buffer
}

export function longToInts(sLong) {
    const divRem = bigStringInt(sLong).divideAndRemainder(bigint(0x100000000))

    return [divRem[0].intValue(), divRem[1].intValue()]
}

export function longToBytes(sLong) {
    return bytesFromWords({words: longToInts(sLong), sigBytes: 8}).reverse()
}

export function longFromInts(high, low) {
    return bigint(high).shiftLeft(32).add(bigint(low)).toString(10)
}

export function intToBytes(int) {
    const arr = new Int8Array(1)
    arr[0] = int
    return Bytes.fromArrayBuffer(arr.buffer)
}

export function intToUint(val) {
    val = parseInt(val)
    if (val < 0) {
        val = val + 4294967296
    }
    return val
}

export function uintToInt(val) {
    if (val > 2147483647) {
        val = val - 4294967296
    }
    return val
}

export function gzipUncompress(bytes) {
    return pako.inflate(bytes)
}

export function dHexDump(bytes) {
    const arr = []

    for (let i = 0; i < bytes.length; i++) {
        if (i && !(i % 2)) {
            if (!(i % 16)) {
                arr.push('\n')
            } else if (!(i % 4)) {
                arr.push('  ')
            } else {
                arr.push(' ')
            }
        }
        arr.push((bytes[i] < 16 ? '0' : '') + bytes[i].toString(16))
    }

    console.log(arr.join(''))
}

export function secureRandom() {
    return new SecureRandom()
}
