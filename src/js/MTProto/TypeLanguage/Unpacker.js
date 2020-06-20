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

import {getConstructorById, getConstructorByPredicate, schema} from "./schema"
import BigInteger from "big-integer"
import gzip_uncompress from "../GZip/gzip_uncompress"

function isGzipped(constructor: number) {
    return constructor === 0x3072cfa1 || constructor.predicate === "gzip_packed"
}

export type Result = {
    $type: string;
    [string]: any;
}

const utf8TextDecoder = new TextDecoder("utf-8")

// in the future will be replaced with https://github.com/TelegramV/TypeLanguage
class Unpacker {

    buffer: ArrayBuffer
    uInt8Array: Uint8Array
    uInt32Array: Uint32Array

    overriders: Map<string, function>

    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer

        this.uInt8Array = new Uint8Array(this.buffer)
        this.uInt32Array = new Uint32Array(this.buffer)

        this.offset = 0
        this.overriders = new Map()
    }

    int(): number {
        if (this.offset >= this.uInt32Array.length * 4) {
            throw new Error("Nothing to fetch")
        }

        const int = this.uInt32Array[this.offset / 4]

        this.offset += 4

        return int
    }

    long(): string {
        const low = this.int()
        const high = this.int()

        return BigInteger(high).shiftLeft(32).add(low).toString()
    }

    double(): number {
        const buffer = new ArrayBuffer(8)
        const int32 = new Int32Array(buffer)
        const float64 = new Float64Array(buffer)

        int32[0] = this.int()
        int32[1] = this.int()

        return float64[0]
    }

    bool(): boolean | any {
        const i = this.int()

        if (i === 0x997275b5) {
            return true
        } else if (i === 0xbc799737) {
            return false
        }

        this.offset -= 4

        return this.object("Object")
    }

    string(): string {
        let len = this.uInt8Array[this.offset++]

        if (len === 254) {
            len = this.uInt8Array[this.offset++] |
                (this.uInt8Array[this.offset++] << 8) |
                (this.uInt8Array[this.offset++] << 16)
        }

        const string = utf8TextDecoder.decode(this.uInt8Array.slice(this.offset, this.offset + len))

        this.offset += len

        this.skipPad()

        return string
    }

    vector(paramType: string): Array {
        if (paramType.charAt(0) === "V") {
            const constructor = this.int()

            if (isGzipped(constructor)) {
                return this.unpackGzipped(paramType)
            }

            if (constructor !== 0x1cb5c415) {
                throw new Error("Invalid vector constructor " + constructor)
            }
        }

        const vectorSize = this.int()

        let result = []

        if (vectorSize > 0) {
            const vectorType = paramType.substr(7, paramType.length - 8)

            for (let i = 0; i < vectorSize; i++) {
                result.push(this.object(vectorType))
            }
        }

        return result
    }

    bytes(): Uint8Array {
        let len = this.uInt8Array[this.offset++]

        if (len === 254) {
            len = this.uInt8Array[this.offset++] |
                (this.uInt8Array[this.offset++] << 8) |
                (this.uInt8Array[this.offset++] << 16)
        }


        let bytes = this.uInt8Array.slice(this.offset, this.offset + len)

        this.offset += len

        this.skipPad()

        return bytes
    }


    rawBytes(len): Uint8Array {
        if (len === false) {
            len = this.int()

            if (len > this.uInt8Array.byteLength) {
                throw new Error("Invalid raw bytes length: " + len + ", buffer len: " + this.uInt8Array.byteLength)
            }
        }

        const bytes = new Uint8Array(len)
        bytes.set(this.uInt8Array.slice(this.offset, this.offset + len))

        this.offset += len

        return bytes
    }

    integer(bitLen = 32): Uint8Array {
        if (bitLen % 32) {
            throw new Error("Invalid bitLen: " + bitLen)
        }

        bitLen /= 8

        const bytes = this.uInt8Array.slice(this.offset, this.offset + bitLen)

        this.offset += bitLen

        return bytes
    }

    object(type = "Object"): any {
        switch (type) {
            case "#":
            case "int":
                return this.int()
            case "long":
                return this.long()
            case "int128":
                return this.integer(128)
            case "int256":
                return this.integer(256)
            case "int512":
                return this.integer(512)
            case "string":
                return this.string()
            case "bytes":
                return this.bytes()
            case "double":
                return this.double()
            case "Bool":
                return this.bool()
            case "true":
                return true
        }


        if (type === "vector") {
            return this.vector("vector<T>")
        }

        if (type.slice(0, 6) === "Vector" ||
            type.slice(0, 6) === "vector") {

            return this.vector(type)
        }

        let constructor = undefined

        if (type.charAt(0) === "%") {
            constructor = schema.constructors.find(constructor => constructor.type === type.substr(1))

            if (!constructor) {
                throw new Error("Constructor not found for type: " + type)
            }
        } else if (type.charAt(0) >= 97 && type.charAt(0) <= 122) {
            constructor = getConstructorByPredicate(type)

            if (!constructor) {
                throw new Error("Constructor not found for predicate: " + type)
            }
        } else {
            const int = this.int()

            if (isGzipped(int)) {
                return this.unpackGzipped(type)
            }

            constructor = getConstructorById(int)
        }


        if (!constructor) {
            throw new Error("Constructor not found: " + type)
        }

        const predicate = constructor.predicate

        // HACK!
        // For some reason it finds vector in constructors
        // I check if predicate of the constructor is "vector" and decrease 4 from offset
        // cause this.vector needs to check the constructor of the vector too
        if (predicate === "vector") {
            this.offset -= 4
            return this.vector("Vector<T>");
        }

        const result = Object.create(null)
        result._ = predicate

        if (this.overriders.has(type)) {
            return this.overriders.get(type).apply(this, [result, this])
        }

        try {
            for (let i = 0; i < constructor.params.length; i++) {
                let {name, type} = constructor.params[i]

                if (type.indexOf("?") !== -1) {
                    const conditional = this.conditional(result, name, type)

                    if (conditional !== undefined) {
                        result[name] = conditional
                    }
                } else {
                    result[name] = this.object(type)
                }
            }
        } catch (e) {
            console.error("result = ", result)
            throw e
        }

        return result
    }

    override(type, overrider: (Result, Unpacker) => any) {
        return this.overriders.set(type, overrider)
    }

    conditional(result, name, type) {
        const [cond, condType] = type.split("?")
        const [field, bit] = cond.split(".") // ["field", 0]

        if (!(result[field] & (1 << bit))) {
            return undefined
        }

        return this.object(condType)
    }

    skipPad() {
        while (this.offset % 4) {
            this.offset++
        }
    }

    unpackGzipped(type: string) {
        const compressed = this.bytes()
        const uncompressed = gzip_uncompress(compressed)
        const unpack = new Unpacker(uncompressed.buffer)

        return unpack.object(type)
    }
}

export default Unpacker