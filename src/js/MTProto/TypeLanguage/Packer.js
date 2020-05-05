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

import {intToUint} from "../Utils/Bin"
import {getConstructorByPredicate, getMethodByName} from "./schema"
import BigInteger from "big-integer"

// in the future will be replaced with https://github.com/TelegramV/TypeLanguage
class Packer {

    maxLength: number
    buffer: ArrayBuffer
    int32Array: Int32Array
    uInt8Array: Uint8Array
    offset: number

    constructor(options = {
        maxLength: 2048
    }) {
        this.maxLength = options.maxLength || 2048
        this.offset = 0

        this.createBuffer()
    }

    createBuffer() {
        this.buffer = new ArrayBuffer(this.maxLength)
        this.int32Array = new Int32Array(this.buffer)
        this.uInt8Array = new Uint8Array(this.buffer)
    }

    checkLength(needBytes) {
        if (this.offset + needBytes < this.maxLength) {
            return
        }

        console.trace("Increase buffer", this.offset, needBytes, this.maxLength)
        this.maxLength = Math.ceil(Math.max(this.maxLength * 2, this.offset + needBytes + 16) / 4) * 4
        const previousBuffer = this.buffer
        const previousArray = new Int32Array(previousBuffer)

        this.createBuffer()

        new Int32Array(this.buffer).set(previousArray)
    }

    toInt32Array() {
        const resultBuffer = new ArrayBuffer(this.offset)
        const resultArray = new Int32Array(resultBuffer)

        resultArray.set(this.int32Array.subarray(0, this.offset / 4))

        return resultArray
    }

    toUint8Array() {
        const resultBuffer = new ArrayBuffer(this.offset)
        const resultArray = new Uint8Array(resultBuffer)

        resultArray.set(this.uInt8Array.subarray(0, this.offset))

        return resultArray
    }

    toArray() {
        const bytes = []

        for (let i = 0; i < this.offset; i++) {
            bytes.push(this.uInt8Array[i])
        }

        return bytes
    }

    toBuffer() {
        return this.toInt32Array().buffer
    }

    int(value: number) {
        this.checkLength(4)
        this.int32Array[this.offset / 4] = value
        this.offset += 4
    }

    bool(value: boolean) {
        if (value) {
            this.int(0x997275b5)
        } else {
            this.int(0xbc799737)
        }
    }

    long(value: string | Array) {
        if (value instanceof Array || value instanceof Uint8Array) {
            if (value.length === 2) {
                this.int(value[1])
                this.int(value[0])
                return
            } else {
                return this.integer(value, 64)
            }
        }

        if (typeof value != "string") {
            value = value ? value.toString() : "0"
        }

        const divRem = BigInteger(value).divmod(0x100000000)

        this.int(intToUint(divRem.remainder.toJSNumber()))
        this.int(intToUint(divRem.quotient.toJSNumber()))
    }

    double(value: number) {
        const buffer = new ArrayBuffer(8)
        const int32 = new Int32Array(buffer)
        const float64 = new Float64Array(buffer)

        float64[0] = value

        this.int(int32[0])
        this.int(int32[1])
    }

    string(value: string) {
        if (value == null) {
            value = ""
        }

        const string = unescape(encodeURIComponent(value))

        this.checkLength(string.length + 8)

        const length = string.length

        if (length <= 253) {
            this.uInt8Array[this.offset++] = length
        } else {
            this.uInt8Array[this.offset++] = 254
            this.uInt8Array[this.offset++] = length & 0xFF
            this.uInt8Array[this.offset++] = (length & 0xFF00) >> 8
            this.uInt8Array[this.offset++] = (length & 0xFF0000) >> 16
        }

        for (let i = 0; i < length; i++) {
            this.uInt8Array[this.offset++] = string.charCodeAt(i)
        }

        this.addPadd()
    }

    bytes(data: Uint8Array | ArrayBuffer | Array) {
        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data)
        } else if (Number.isInteger(data)) {
            data = [data]
        } else if (data === undefined) {
            data = []
        }

        const length = data.byteLength || data.length
        this.checkLength(length + 8)

        if (length <= 253) {
            this.uInt8Array[this.offset++] = length
        } else {
            this.uInt8Array[this.offset++] = 254
            this.uInt8Array[this.offset++] = length & 0xFF
            this.uInt8Array[this.offset++] = (length & 0xFF00) >> 8
            this.uInt8Array[this.offset++] = (length & 0xFF0000) >> 16
        }

        this.uInt8Array.set(data, this.offset)
        this.offset += length

        this.addPadd()
    }

    integer(data: Uint8Array, bitLen: number) {
        if (!(data instanceof Uint8Array)) {
            data = new Uint8Array(data)
        } else if (Number.isInteger(data)) {
            data = new Uint8Array([data])
        }

        const length = data.byteLength

        if ((bitLen % 32) || (length * 8) !== bitLen) {
            console.error(data)
            throw new Error("Invalid bits: " + bitLen + ", " + length)
        }

        this.checkLength(length)

        this.uInt8Array.set(data, this.offset)
        this.offset += length
    }

    rawBytes(data: Uint8Array) {
        if (!(data instanceof Uint8Array)) {
            data = new Uint8Array(data)
        } else if (Number.isInteger(data)) {
            data = new Uint8Array([data])
        }

        const length = data.byteLength

        this.checkLength(length)

        this.uInt8Array.set(data, this.offset)
        this.offset += length
    }

    method(name, params) {
        const method = getMethodByName(name)

        if (!method) {
            throw new Error("No method " + name + " found")
        }

        this.int(intToUint(method.id))

        for (let i = 0; i < method.params.length; i++) {
            let {name, type} = method.params[i]

            if (type === "#") {
                const hashParams = method.params.filter(param => param.type.substr(0, name.length + 1) === `${name}.`)

                for (const param of hashParams) {
                    const [cond] = param.type.split("?")
                    const [field, bit] = cond.split(".")
                    if (!(params[field] & (1 << bit)) && params[param.name] != null && params[param.name] !== false) { // todo check only for null
                        params[field] |= 1 << bit
                    }
                }
            }

            if (type.indexOf("?") !== -1) {
                const [cond, condType] = type.split("?")
                const [field, bit] = cond.split(".")
                if (!(params[field] & (1 << bit))) {
                    continue
                }
                type = condType
            }

            this.object(params[name], type)
        }
    }

    object(constructor, type) {
        switch (type) {
            case "#":
            case "int":
                return this.int(constructor)
            case "long":
                return this.long(constructor)
            case "int128":
                return this.integer(constructor, 128)
            case "int256":
                return this.integer(constructor, 256)
            case "int512":
                return this.integer(constructor, 512)
            case "string":
                return this.string(constructor)
            case "bytes":
                return this.bytes(constructor)
            case "double":
                return this.double(constructor)
            case "Bool":
                return this.bool(constructor)
            case "true":
                return
        }

        if (constructor instanceof Array) {
            if (type.substr(0, 6) === "Vector") {
                this.int(0x1cb5c415)
            } else if (type.substr(0, 6) !== "vector") {
                throw new Error("Invalid vector type " + type)
            }

            const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
            this.int(constructor.length)

            for (let i = 0; i < constructor.length; i++) {
                this.object(constructor[i], itemType)
            }

            return true
        } else if (type.substr(0, 6).toLowerCase() === "vector") {
            throw new Error("Invalid vector object")
        }

        const predicate = constructor._
        let isBare = type.charAt(0) === "%"
        const schemaConstructor = getConstructorByPredicate(predicate)

        if (isBare) {
            type = type.substr(1)
        }

        if (!schemaConstructor) {
            throw new Error("No predicate " + predicate + " found: " + type)
        }

        if (predicate === type) {
            isBare = true
        }

        if (!isBare) {
            this.int(intToUint(schemaConstructor.id))
        }

        for (let i = 0; i < schemaConstructor.params.length; i++) {
            let {name, type} = schemaConstructor.params[i]

            if (type === "#") {
                const hashParams = schemaConstructor.params.filter(param => param.type.substr(0, name.length + 1) === `${name}.`)

                for (const param of hashParams) {
                    const [cond, condType] = param.type.split("?")
                    const [field, bit] = cond.split(".")
                    if (!(constructor[field] & (1 << bit)) && constructor[param.name] != null && constructor[param.name] !== false) { // todo: check only on null
                        constructor[field] |= 1 << bit
                    }
                }
            }

            if (type.indexOf("?") !== -1) {
                const [cond] = type.split("?")
                const [field, bit] = cond.split(".")
                if (!(constructor[field] & (1 << bit))) {
                    continue
                }
                type = type.split("?")[1]
            }

            this.object(constructor[name], type)
        }

        return schemaConstructor.type
    }

    addPadd() {
        while (this.offset % 4) {
            this.uInt8Array[this.offset++] = 0
        }
    }
}

export default Packer