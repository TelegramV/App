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

import crypto from "crypto";
import BigInteger from "big-integer"

function substr(bytes: Uint8Array, start: number, length: number): Uint8Array {
    return bytes.slice(start, start + length);
}

function concat(...uint8Arrays: Uint8Array[]): Uint8Array {
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

function random(length: number): Uint8Array {
    return new Uint8Array(crypto.randomBytes(length));
}

function compare(a: Uint8Array, b: Uint8Array): boolean {
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

function fromHex(hex: string): Uint8Array {
    const bytes = [];
    let start = 0;

    if (hex.length % 2) {
        bytes.push(parseInt(hex.charAt(0), 16));
        start++;
    }

    for (let i = start; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return new Uint8Array(bytes);
}

function toHex(bytes: Uint8Array): string {
    const arr = [];

    for (let i = 0; i < bytes.length; i++) {
        arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
    }

    return arr.join("");
}

function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
    const c = new Uint8Array(a.length);

    for (let i = 0; i < a.length; ++i) {
        c[i] = a[i] ^ b[i];
    }

    return c;
}

function fromBigInteger(bigInt: BigInteger): Uint8Array {
    return new Uint8Array(bigInt.toArray(256).value);
}

function toBigInteger(bytes: Uint8Array): BigInteger {
    return BigInteger.fromArray(Array.isArray(bytes) ? bytes : Array.from(bytes), 256, false);
}

function modPow(x: Uint8Array, y: Uint8Array, m: Uint8Array) {
    const xBigInt = BigInteger(toHex(x), 16);
    const yBigInt = BigInteger(toHex(y), 16);
    const mBigInt = BigInteger(toHex(m), 16)

    let result = fromBigInteger(xBigInt.modPow(yBigInt, mBigInt));

    // why?
    if (result.length > 256) {
        result = result.splice(result.length - 256);
    } else if (result.length < 256) {
        const newResult = new Uint8Array(result.length + 1);
        newResult.set([0], 0);
        newResult.set(result, 1);
        return newResult;
    }

    return result;
}

function fromBits(byteArr, endian = true) {
    if (!endian) {
        let copy = new Uint8Array(byteArr.length);
        copy.set(byteArr, 0);
        byteArr = this.endian(copy);
    }
    /*const bytes = []

    for (let i = 0; i < byteArr.length; i++) {
        bytes.push((byteArr[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)
    }

    return bytes*/
    return Array.from(byteArr);
}

function endian(bytes) { //changes endian to opposite
    let len = bytes.length;
    let holder;

    for (let i = 0; i < len; i += 4) {
        holder = bytes[i];
        bytes[i] = bytes[i + 3];
        bytes[i + 3] = holder;
        holder = bytes[i + 1];
        bytes[i + 1] = bytes[i + 2];
        bytes[i + 2] = holder;
    }
    return bytes; //idk why return, buffer already changed, maybe clone?
}

function toBits(byteArr, endian = true) {
    if (byteArr instanceof ArrayBuffer) {
        byteArr = new Uint8Array(bytes)
    }

    const len = byteArr.length
    const words = []

    for (let i = 0; i < len; i++) {
        words[i >>> 2] |= byteArr[i] << (24 - (i % 4) * 8)
    }

    let bytes = new Uint8Array(new Int32Array(words).buffer);
    if (!endian) return bytes;
    return this.endian(bytes);
}

function fromString(string, endian = true) {
    let bytes = new TextEncoder().encode(string);
    if (endian) return bytes; //TextEncoder already encodes with endian
    return this.endian(bytes);
}

const Uint8 = {
    substr: substr,
    concat: concat,
    random: random,
    compare: compare,
    fromHex: fromHex,
    toHex: toHex,
    xor: xor,
    fromBigInteger: fromBigInteger,
    toBigInteger: toBigInteger,
    modPow: modPow,
    toBits: toBits,
    endian: endian,
    fromBits: fromBits,
    fromString: fromString,
};

export default Uint8;