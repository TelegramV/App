import JSBI from "jsbi"

/**
 * Native BigInt wrapper
 *
 * @author kohutd
 */
class VBigInt {

    /**
     * @type {JSBI|BigInt}
     */
    value = undefined

    canNative = window.BigInt

    isNative = false

    constructor(value) {
        this.value = value
        this.isNative = typeof value === "bigint"
    }

    static get ZERO() {
        return VBigInt.create(this.canNative ? window.BigInt(0) : JSBI.BigInt(0))
    }

    static get ONE() {
        return VBigInt.create(this.canNative ? window.BigInt(1) : JSBI.BigInt(1))
    }

    static get TWO() {
        return VBigInt.create(this.canNative ? window.BigInt(2) : JSBI.BigInt(2))
    }

    static get THREE() {
        return VBigInt.create(this.canNative ? window.BigInt(3) : JSBI.BigInt(3))
    }

    static get FOUR() {
        return VBigInt.create(this.canNative ? window.BigInt(4) : JSBI.BigInt(4))
    }

    static get FIVE() {
        return VBigInt.create(this.canNative ? window.BigInt(5) : JSBI.BigInt(5))
    }

    /**
     * @param {string|number} a
     * @return {VBigInt}
     */
    static create(a) {
        if (this.canNative) {
            return new VBigInt(window.BigInt(a))
        } else {
            if (a instanceof JSBI) {
                return new VBigInt(a)
            } else {
                return new VBigInt(JSBI.BigInt(a))
            }
        }
    }

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

        return VBigInt.create(this.isNative ? this.value + b.value : JSBI.add(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    subtract(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value - b.value : JSBI.subtract(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    multiply(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value * b.value : JSBI.multiply(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    divide(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value / b.value : JSBI.divide(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    remainder(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value % b.value : JSBI.remainder(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    exponentiate(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value ** b.value : JSBI.exponentiate(this.value, b.value))
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
        return VBigInt.create(this.isNative ? -this.value : JSBI.unaryMinus(this.value))
    }

    /**
     * @return {VBigInt}
     */
    bitwiseNot() {
        return VBigInt.create(this.isNative ? ~this.value : JSBI.bitwiseNot(this.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt[]}
     */
    divideAndRemainder(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        const remainder = this.isNative ?
            VBigInt.create(this.value % b.value) :
            this.remainder(b)

        const quotient = this.isNative ?
            VBigInt.create((this.value - remainder.value) / b.value) :
            this.subtract(remainder).divide(b)


        return [quotient, remainder]
    }

    toNumber() {
        return this.isNative ? Number(this.value) : JSBI.toNumber(this.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    leftShift(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value << b.value : JSBI.leftShift(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    signedRightShift(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value >> b.value : JSBI.signedRightShift(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseAnd(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value & b.value : JSBI.bitwiseAnd(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseOr(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value | b.value : JSBI.bitwiseOr(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {VBigInt}
     */
    bitwiseXor(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return VBigInt.create(this.isNative ? this.value ^ b.value : JSBI.bitwiseXor(this.value, b.value))
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    equal(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value === b.value : JSBI.equal(this.value, b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    notEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value !== b.value : JSBI.notEqual(this.value, b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    lessThan(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value < b.value : JSBI.lessThan(this.value, b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    lessThanOrEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value <= b.value : JSBI.lessThanOrEqual(this.value, b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    greaterThan(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value > b.value : JSBI.greaterThan(this.value, b.value)
    }

    /**
     * @param {VBigInt|number|string} b
     * @return {boolean}
     */
    greaterThanOrEqual(b) {
        if (!(b instanceof VBigInt)) {
            b = VBigInt.create(b)
        }

        return this.isNative ? this.value >= b.value : JSBI.greaterThanOrEqual(this.value, b.value)
    }
}

export default VBigInt