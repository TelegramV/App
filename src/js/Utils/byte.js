/**
 * @param {Array|ArrayLike|ArrayBufferLike} bytes
 * @return {string}
 */
export function bytesAsHex(bytes) {
    const arr = []

    for (let i = 0; i < bytes.length; i++) {
        arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16))
    }

    return arr.join("")
}

/**
 * @param {string} hex
 * @return {Array}
 */
export function bytesFromHex(hex) {
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
 *
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @returns {Uint8Array}
 */
export function bytesConcat(a, b) {
    const l1 = a.byteLength || a.length
    const l2 = b.byteLength || b.length
    const tmp = new Uint8Array(l1 + l2)

    tmp.set(a instanceof ArrayBuffer ? new Uint8Array(a) : a, 0)
    tmp.set(b instanceof ArrayBuffer ? new Uint8Array(b) : b, l1)

    return tmp
}

export function concatUint8(...uint8Arrays: Uint8Array[]): Uint8Array {
    let length = 0;

    for (let i = 0; i < uint8Arrays.length; i++) {
        if (uint8Arrays[i] instanceof ArrayBuffer) {
            uint8Arrays[i] = new Uint8Array(uint8Arrays[i])
        }
        length += uint8Arrays[i].length;
    }

    const uint8Array = new Uint8Array(length);

    let offset = 0;

    for (let i = 0; i < uint8Arrays.length; i++) {
        uint8Array.set(uint8Arrays[i], offset);
        offset += uint8Arrays[i].length;
    }

    return uint8Array;
}

/**
 *
 * @param {Array|ArrayLike|ArrayBufferLike} a
 * @param {Array|ArrayLike|ArrayBufferLike} b
 * @returns {ArrayBufferLike}
 */
export function bytesConcatBuffer(a, b) {
    return bytesConcat(a, b).buffer
}