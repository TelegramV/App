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

import {BigInteger} from "../../../../vendor/jsbn"
import Bytes from "../utils/bytes"
import AppConfiguration from "../../Config/AppConfiguration"

/**
 * Native BigInt wrapper
 */
class VBigInt {

    // /**
    //  * @type {BigInteger|BigInt}
    //  */
    // value = undefined
    //
    // isNative = false

    constructor(value, native = false) {
        this.value = value

        this.isNative = native || typeof value === "bigint"
    }

    /**
     * @param {string|number|BigInt|BigInteger} a
     * @param b
     * @return {VBigInt}
     */
    static create(a, b = 10) {
        if (AppConfiguration.useNativeBigInt) {

            if (typeof a === "bigint") {
                return new VBigInt(a, true)
            } else if (b === 16 && typeof a === "string" && !a.startsWith("0x")) {
                return new VBigInt(BigInt("0x" + a), true)
            } else if (a instanceof Array || a instanceof ArrayBuffer || a instanceof Uint8Array) {
                return new VBigInt(BigInt(`0x${Bytes.asHex(a)}`), true)
            }

            return new VBigInt(BigInt(a), true)

        } else {
            if (a instanceof BigInteger) {
                return new VBigInt(a)
            } else {
                if (typeof a === "string") {
                    if (a.startsWith("0x")) {
                        a = a.substring(2)
                        return new VBigInt(new BigInteger(a, 16))
                    } else {
                        return new VBigInt(new BigInteger(a, b))
                    }
                } else if (a instanceof Array || a instanceof ArrayBuffer || a instanceof Uint8Array) {
                    return new VBigInt(new BigInteger(a))
                } else {
                    return new VBigInt(new BigInteger(a.toString(16), 16))
                }
            }
        }
    }

    /**
     * @param le
     * @return {[]}
     */
    toByteArray(le = false) {
        if (this.isNative) {

            const result = []
            let value = this.value

            while (value > BigInt(0)) {
                result.push(Number(value % BigInt(256)))
                value /= BigInt(256);
            }
            if (result.length === 0) {
                result.push(0)
            }

            return le ? result : result.reverse()

        } else {
            return this.value.toByteArray()
        }
    }

    // fallback for jsbn
    getBytes(length, le) {
        if (this.isNative) {
            let bytes = Bytes.fromHex(this.toString(16))
            bytes = new Uint8Array(bytes)

            console.warn("b", bytes)

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
        } else {
            let bytes = new Uint8Array(this.value.toByteArray())

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
    }

    /**
     * @param {VBigInt|number|string} b
     * @param {VBigInt|number|string} n
     * @return {VBigInt}
     */
    modPow(b, n) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        if (!(n instanceof VBigInt)) {
            n = VBigInt.create(n)
        }

        if (this.isNative) {
            let a = this.value
            b = b.value
            n = n.value

            a %= n;
            let result = BigInt(1)
            let x = a
            let big1 = BigInt(1)
            let big2 = BigInt(2)

            while (b > 0) {
                const leastSignificantBit = b % big2
                b /= big2

                if (leastSignificantBit === big1) {
                    result *= x
                    result %= n
                }

                x *= x
                x %= n
            }
            return VBigInt.create(result)
        } else {
            return VBigInt.create(this.value.modPow(b.value, n.value))
        }
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    gcd(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        if (this.isNative) {
            let a = this.value
            b = b.value

            while (b) {
                const tmp = a
                a = b
                b = tmp % b
            }

            return VBigInt.create(a)
        } else {
            return VBigInt.create(this.value.gcd(b.value))
        }
    }

    /**
     * @param radix
     * @return {string}
     */
    toString(radix) {
        return this.value.toString(radix)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    add(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value + b.value : this.value.add(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    subtract(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value - b.value : this.value.subtract(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    multiply(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value * b.value : this.value.multiply(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    divide(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value / b.value : this.value.divide(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    remainder(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value % b.value : this.value.remainder(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    exponentiate(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value ** b.value : this.value.pow(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    pow(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.exponentiate(b)
    }

    /**
     * @return {VBigInt}
     */
    unaryMinus() {
        return VBigInt.create(this.isNative ? -this.value : this.value.negate())
    }

    /**
     * @return {VBigInt}
     */
    bitwiseNot() {
        return VBigInt.create(this.isNative ? ~this.value : this.value.not())
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt[]}
     */
    divideAndRemainder(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        if (this.isNative) {
            const remainder = VBigInt.create(this.value % b.value)
            const quotient = VBigInt.create((this.value - remainder.value) / b.value)

            return [quotient, remainder]
        } else {
            const r = this.value.divideAndRemainder(b.value)
            return [VBigInt.create(r[0]), VBigInt.create(r[1])]
        }

    }

    toNumber() {
        return this.isNative ? Number(this.value) : this.value.intValue()
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    leftShift(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value << b.value : this.value.shiftLeft(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    signedRightShift(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value >> b.value : this.value.shiftRight(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseAnd(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value & b.value : this.value.and(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseOr(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value | b.value : this.value.or(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseXor(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value ^ b.value : this.value.xor(b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    equal(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value === b.value : this.value.equals(b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    notEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value !== b.value : !this.value.equals(b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    lessThan(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value < b.value : this.value.compareTo(b.value) < 0
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    lessThanOrEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value <= b.value : this.value.compareTo(b.value) <= 0
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    greaterThan(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value > b.value : this.value.compareTo(b.value) > 0
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    greaterThanOrEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value >= b.value : this.value.compareTo(b.value) >= 0
    }
}

export default VBigInt