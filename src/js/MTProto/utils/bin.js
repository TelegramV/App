import CryptoJS from "../../../../vendor/CryptoJS"
import crypto from "crypto"
import Bytes from "./bytes"
import VBigInt from "../bigint/VBigInt"

export function createRandomBuffer(bytesLength) {
    return new Buffer(crypto.randomBytes(bytesLength));
}

export function createNonce(bytesLength) {
    return createRandomBuffer(bytesLength);
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

export function longToInts(sLong) {
    const divRem = VBigInt.create(sLong).divideAndRemainder(VBigInt.create(0x100000000))

    return [divRem[0].toNumber(), divRem[1].toNumber()]
}

export function longToBytes(sLong) {
    return bytesFromWords({words: longToInts(sLong), sigBytes: 8}).reverse()
}

export function longFromInts(high, low) {
    return VBigInt.create(high).leftShift(32).add(low).toString(10)
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