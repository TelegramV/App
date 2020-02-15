import {Zlib} from "../vendor/zlib"
import crypto from "crypto"
import Bytes from "./bytes"
import VBigInt from "../bigint/VBigInt"

export function createRandomBuffer(bytesLength) {
    return new Buffer(crypto.randomBytes(bytesLength));
}

export function createNonce(bytesLength) {
    return createRandomBuffer(bytesLength);
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

export function longToInts(sLong) {
    const divRem = VBigInt.create(sLong).divideAndRemainder(VBigInt.create(0x100000000))

    return [divRem[0].toNumber(), divRem[1].toNumber()]
}

export function longToBytes(sLong) {
    return Bytes.fromWords({words: longToInts(sLong), sigBytes: 8}).reverse()
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

export function gzipUncompress(bytes) {
    return (new Zlib.Gunzip(bytes)).decompress()
}