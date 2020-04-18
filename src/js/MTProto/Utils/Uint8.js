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

import crypto from "crypto";
import BigInteger from "big-integer"

function substr(bytes: Uint8Array, start: number, length: number): Uint8Array {
    return bytes.slice(start, start + length);
}

function concat(...uint8Arrays: Uint8Array[]): Uint8Array {
    let length = 0;

    for (let i = 0; i < uint8Arrays.length; i++) {
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
        return result.unshift(0);
    }

    return result;
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
};

export default Uint8;