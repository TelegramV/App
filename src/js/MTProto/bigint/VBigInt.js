// import Bytes from "../utils/bytes"
// import BigInteger from "big-integer"
//
// /**
//  * Native BigInt wrapper
//  *
//  * @deprecated use BigInteger from "big-integer"
//  */
// class VBigInt {
//     constructor(value) {
//         this.value = value
//     }
//
//     /**
//      * @param {string|number|BigInt|BigInteger} a
//      * @param b
//      * @return {VBigInt}
//      */
//     static create(a, b = 10) {
//         if (a instanceof BigInteger) {
//             return new VBigInt(a)
//         } else {
//             if (typeof a === "string") {
//                 if (a.startsWith("0x")) {
//                     a = a.substring(2)
//                     return new VBigInt(BigInteger(a, 16))
//                 } else {
//                     return new VBigInt(BigInteger(a, b))
//                 }
//             } else if (a instanceof Array || a instanceof ArrayBuffer || a instanceof Uint8Array) {
//                 return new VBigInt(BigInteger.fromArray(Array.from(a), 256, false))
//             } else {
//                 return new VBigInt(BigInteger(a.toString(16), 16))
//             }
//         }
//     }
//
//     /**
//      * @return {[]}
//      */
//     toByteArray() {
//         return new Uint8Array(this.value.toArray(256).value)
//     }
//
//     // fallback for jsbn
//     getBytes(length) {
//         let bytes = this.toByteArray()
//
//         if (length && bytes.length < length) {
//             const padding = []
//             for (let i = 0, needPadding = length - bytes.length; i < needPadding; i++) {
//                 padding[i] = 0
//             }
//             if (bytes instanceof ArrayBuffer) {
//                 bytes = Bytes.concatBuffer(padding, bytes)
//             } else {
//                 bytes = padding.concat(bytes)
//             }
//         } else {
//             while (!bytes[0] && (!length || bytes.length > length)) {
//                 bytes = bytes.slice(1)
//             }
//         }
//
//         return bytes
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @param {VBigInt|number|string} n
//      * @return {VBigInt}
//      */
//     modPow(b, n) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         if (!(n instanceof VBigInt)) {
//             n = VBigInt.create(n)
//         }
//
//         return VBigInt.create(this.value.modPow(b.value, n.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     gcd(b) {
//         return VBigInt.create(BigInteger.gcd(this.value, b.value))
//     }
//
//     /**
//      * @param radix
//      * @return {string}
//      */
//     toString(radix) {
//         return this.value.toString(radix)
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     add(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.add(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     subtract(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.subtract(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     multiply(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.multiply(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     divide(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.divide(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     remainder(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.divmod(b.value).remainder)
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     exponentiate(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.pow(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     pow(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.exponentiate(b)
//     }
//
//     /**
//      * @return {VBigInt}
//      */
//     not() {
//         return VBigInt.create(this.value.not())
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt[]}
//      */
//     divideAndRemainder(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         const {quotient, remainder} = this.value.divmod(b.value)
//         return {quotient: VBigInt.create(quotient), remainder: VBigInt.create(remainder)}
//     }
//
//     toNumber() {
//         return this.value.toJSNumber()
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     leftShift(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.shiftLeft(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     signedRightShift(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.shiftRight(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     and(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.and(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     or(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.or(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {VBigInt}
//      */
//     xor(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return VBigInt.create(this.value.xor(b.value))
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     equals(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.value.equals(b.value)
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     notEqual(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return !this.value.equals(b.value)
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     lessThan(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.value.compareTo(b.value) < 0
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     lessThanOrEqual(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.value.compareTo(b.value) <= 0
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     greaterThan(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.value.compareTo(b.value) > 0
//     }
//
//     /**
//      * @param {VBigInt|number|string} b
//      * @return {boolean}
//      */
//     greaterThanOrEqual(b) {
//         if (!(b instanceof VBigInt)) {
//             b = VBigInt.create(b)
//         }
//
//         return this.value.compareTo(b.value) >= 0
//     }
// }
//
// export default VBigInt