import {BigInteger, SecureRandom} from "../vendor/jsbn/jsbn"
import CryptoJS from "../vendor/crypto"
import crypto from "crypto"
import {Zlib} from "../vendor/zlib/gunzip.min"
// import {str2bigInt} from "BigInt"

// Mod Pow
export function modPow(x, e, m) {
    var logger = console;
    var bigX = (typeof x === 'number') ? new BigInteger(x + '', 10) : new BigInteger(x.toString('hex'), 16);
    var bigE = (typeof e === 'number') ? new BigInteger(e + '', 10) : new BigInteger(e.toString('hex'), 16);
    var bigM = (typeof m === 'number') ? new BigInteger(m + '', 10) : new BigInteger(m.toString('hex'), 16);
    var bigResult = bigX.modPow(bigE, bigM);

    logger.debug('X = %s, E = %s, M = %s, result = %s', bigX, bigE, bigM, bigResult);

    var result = new Buffer(bigResult.toByteArray());
    if (result.length > 256) {
        result = result.slice(result.length - 256);
    }
    return result;
}

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

export function addPadding(bytes, blockSize, zeroes) {
    blockSize = blockSize || 16
    const len = bytes.byteLength || bytes.length
    const needPadding = blockSize - (len % blockSize)

    if (needPadding > 0 && needPadding < blockSize) {
        const padding = new Array(needPadding)

        if (zeroes) {
            for (let i = 0; i < needPadding; i++) {
                padding[i] = 0
            }
        } else {
            secureRandom().nextBytes(padding)
        }

        if (bytes instanceof ArrayBuffer) {
            bytes = bufferConcat(bytes, padding)
        } else {
            bytes = bytes.concat(padding)
        }
    }

    return bytes
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

export function bytesToHex(bytes = []) {
    const arr = []

    for (let i = 0; i < bytes.length; i++) {
        arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16))
    }

    return arr.join('')
}

export function bytesFromHex(hexString) {
    const len = hexString.length
    const bytes = []
    let start = 0

    if (hexString.length % 2) {
        bytes.push(parseInt(hexString.charAt(0), 16))
        start++
    }

    for (let i = start; i < len; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16))
    }

    return bytes
}

export function bytesToBase64(bytes) {
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

export function bytesCmp(bytes1, bytes2) {
    const len = bytes1.length

    if (len !== bytes2.length) {
        return false
    }

    for (let i = 0; i < len; i++) {
        if (bytes1[i] !== bytes2[i]) {
            return false
        }
    }

    return true
}

export function bytesXor(bytes1, bytes2) {
    const len = bytes1.length
    const bytes = []

    for (let i = 0; i < len; ++i) {
        bytes[i] = bytes1[i] ^ bytes2[i]
    }

    return bytes
}

export function bytesFromBigInt(bigInt, len) {
    let bytes = new Uint8Array(bigInt.toByteArray())

    if (len && bytes.length < len) {
        const padding = []
        for (let i = 0, needPadding = len - bytes.length; i < needPadding; i++) {
            padding[i] = 0
        }
        if (bytes instanceof ArrayBuffer) {
            bytes = bufferConcat(padding, bytes)
        } else {
            bytes = padding.concat(bytes)
        }
    } else {
        while (!bytes[0] && (!len || bytes.length > len)) {
            bytes = bytes.slice(1)
        }
    }

    return bytes
}

export function bytesFromLeemonBigInt(bigInt, len) {
    const str = bigInt2str(bigInt, 16)
    return bytesFromHex(str)
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
    return bytesToArrayBuffer(bytes)
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

    bytes = convertToUint8Array(bytes)

    const newBytes = []

    for (let i = 0, len = bytes.length; i < len; i++) {
        newBytes.push(bytes[i])
    }

    return newBytes
}

export function bytesFromArrayBuffer(buffer) {
    const len = buffer.byteLength
    const byteView = new Uint8Array(buffer)
    const bytes = []

    for (let i = 0; i < len; ++i) {
        bytes[i] = byteView[i]
    }

    return bytes
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
    return bytesFromArrayBuffer(arr.buffer)
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
    // console.log('Gzip uncompress start')
    const result = (new Zlib.Gunzip(bytes)).decompress()
    // console.log('Gzip uncompress finish')
    return result
}

export function nextRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue)
}

export function pqPrimeFactorization(pqBytes) {
    const what = new BigInteger(pqBytes)
    let result = false

    // console.log(dT(), 'PQ start', pqBytes, what.toString(16), what.bitLength())

    try {
        result = pqPrimeLeemon(str2bigInt(what.toString(16), 16, Math.ceil(64 / bpe) + 1))
    } catch (e) {
        console.error('Pq leemon Exception', e)
    }

    if (result === false && what.bitLength() <= 64) {
        // console.timeManager('PQ long')
        try {
            result = pqPrimeLong(goog.math.Long.fromString(what.toString(16), 16))
        } catch (e) {
            console.error('Pq long Exception', e)
        }
        // console.timeEnd('PQ long')
    }
    // console.log(result)

    if (result === false) {
        // console.timeManager('pq BigInt')
        result = pqPrimeBigInteger(what)
        // console.timeEnd('pq BigInt')
    }

    // console.log(dT(), 'PQ finish')

    return result
}

export function pqPrimeBigInteger(what) {
    let it = 0
    let g

    for (let i = 0; i < 3; i++) {
        let q = (nextRandomInt(128) & 15) + 17
        let x = bigint(nextRandomInt(1000000000) + 1)
        let y = x.clone()
        let lim = 1 << (i + 18)

        for (let j = 1; j < lim; j++) {
            ++it
            let a = x.clone()
            let b = x.clone()
            let c = bigint(q)

            while (!b.equals(BigInteger.ZERO)) {
                if (!b.and(BigInteger.ONE).equals(BigInteger.ZERO)) {
                    c = c.add(a)
                    if (c.compareTo(what) > 0) {
                        c = c.subtract(what)
                    }
                }
                a = a.add(a)
                if (a.compareTo(what) > 0) {
                    a = a.subtract(what)
                }
                b = b.shiftRight(1)
            }

            x = c.clone()
            let z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y)
            g = z.gcd(what)
            if (!g.equals(BigInteger.ONE)) {
                break
            }
            if ((j & (j - 1)) == 0) {
                y = x.clone()
            }
        }
        if (g.compareTo(BigInteger.ONE) > 0) {
            break
        }
    }

    let f = what.divide(g), P, Q

    if (g.compareTo(f) > 0) {
        P = f
        Q = g
    } else {
        P = g
        Q = f
    }

    return [bytesFromBigInt(P), bytesFromBigInt(Q), it]
}

export function gcdLong(a, b) {
    while (a.notEquals(goog.math.Long.ZERO) && b.notEquals(goog.math.Long.ZERO)) {
        while (b.and(goog.math.Long.ONE).equals(goog.math.Long.ZERO)) {
            b = b.shiftRight(1)
        }
        while (a.and(goog.math.Long.ONE).equals(goog.math.Long.ZERO)) {
            a = a.shiftRight(1)
        }
        if (a.compare(b) > 0) {
            a = a.subtract(b)
        } else {
            b = b.subtract(a)
        }
    }
    return b.equals(goog.math.Long.ZERO) ? a : b
}

export function pqPrimeLong(what) {
    let it = 0
    let g

    for (let i = 0; i < 3; i++) {
        let q = goog.math.Long.fromInt((nextRandomInt(128) & 15) + 17)
        let x = goog.math.Long.fromInt(nextRandomInt(1000000000) + 1)
        let y = x
        let lim = 1 << (i + 18)

        for (let j = 1; j < lim; j++) {
            ++it
            let a = x
            let b = x
            let c = q

            while (b.notEquals(goog.math.Long.ZERO)) {
                if (b.and(goog.math.Long.ONE).notEquals(goog.math.Long.ZERO)) {
                    c = c.add(a)
                    if (c.compare(what) > 0) {
                        c = c.subtract(what)
                    }
                }
                a = a.add(a)
                if (a.compare(what) > 0) {
                    a = a.subtract(what)
                }
                b = b.shiftRight(1)
            }

            x = c
            let z = x.compare(y) < 0 ? y.subtract(x) : x.subtract(y)
            g = gcdLong(z, what)
            if (g.notEquals(goog.math.Long.ONE)) {
                break
            }
            if ((j & (j - 1)) == 0) {
                y = x
            }
        }
        if (g.compare(goog.math.Long.ONE) > 0) {
            break
        }
    }

    const f = what.div(g)

    let P
    let Q

    if (g.compare(f) > 0) {
        P = f
        Q = g
    } else {
        P = g
        Q = f
    }

    return [bytesFromHex(P.toString(16)), bytesFromHex(Q.toString(16)), it]
}

export function pqPrimeLeemon(what) {
    let minBits = 64
    let minLen = Math.ceil(minBits / bpe) + 1
    let it = 0
    let q
    let j, lim
    let P
    let Q
    let a = new Array(minLen)
    let b = new Array(minLen)
    let c = new Array(minLen)
    let g = new Array(minLen)
    let z = new Array(minLen)
    let x = new Array(minLen)
    let y = new Array(minLen)

    for (let i = 0; i < 3; i++) {
        q = (nextRandomInt(128) & 15) + 17
        copyInt_(x, nextRandomInt(1000000000) + 1)
        copy_(y, x)
        lim = 1 << (i + 18)

        for (j = 1; j < lim; j++) {
            ++it
            copy_(a, x)
            copy_(b, x)
            copyInt_(c, q)

            while (!isZero(b)) {
                if (b[0] & 1) {
                    add_(c, a)
                    if (greater(c, what)) {
                        sub_(c, what)
                    }
                }
                add_(a, a)
                if (greater(a, what)) {
                    sub_(a, what)
                }
                rightShift_(b, 1)
            }

            copy_(x, c)
            if (greater(x, y)) {
                copy_(z, x)
                sub_(z, y)
            } else {
                copy_(z, y)
                sub_(z, x)
            }
            eGCD_(z, what, g, a, b)
            if (!equalsInt(g, 1)) {
                break
            }
            if ((j & (j - 1)) === 0) {
                copy_(y, x)
            }
        }
        if (greater(g, one)) {
            break
        }
    }

    divide_(what, g, x, y)

    if (greater(g, x)) {
        P = x
        Q = g
    } else {
        P = g
        Q = x
    }

    // console.log(dT(), 'done', bigInt2str(what, 10), bigInt2str(P, 10), bigInt2str(Q, 10))

    return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it]
}

export function bytesModPow(x, y, m) {
    try {
        const xBigInt = new BigInteger(bytesToHex(x), 16)
        const yBigInt = new BigInteger(bytesToHex(y), 16)
        const mBigInt = new BigInteger(bytesToHex(m), 16)
        const resBigInt = xBigInt.modPow(yBigInt, mBigInt)

        return resBigInt.toByteArray()
    } catch (e) {
        console.error('mod pow error', e)
    }

    return bytesFromBigInt(new BigInteger(x).modPow(new BigInteger(y), new BigInteger(m)), 256)
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