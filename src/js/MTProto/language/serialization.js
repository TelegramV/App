import {intToUint} from "../utils/bin"
import {schema} from "./schema";
import VBigInt from "../bigint/VBigInt"

// (c) webogram

// todo: rewrite from scratch
export class TLSerialization {
    constructor(options = {
        startMaxLength: 2048,
        schema: schema
    }) {
        this.maxLength = options.startMaxLength || 2048 // 2Kb
        this.offset = 0 // in bytes

        this.schema = options.schema || schema

        this.createBuffer()
    }

    createBuffer() {
        this.buffer = new ArrayBuffer(this.maxLength)
        this.intView = new Int32Array(this.buffer)
        this.byteView = new Uint8Array(this.buffer)
    }

    /**
     * @return {Int32Array}
     */
    getArray() {
        const resultBuffer = new ArrayBuffer(this.offset)
        const resultArray = new Int32Array(resultBuffer)

        resultArray.set(this.intView.subarray(0, this.offset / 4))

        return resultArray
    }

    /**
     * @return {ArrayBufferLike}
     */
    getBuffer() {
        return this.getArray().buffer
    }

    /**
     * @param typed
     * @return {Array|Uint8Array}
     */
    getBytes(typed) {
        if (typed) {
            const resultBuffer = new ArrayBuffer(this.offset)
            const resultArray = new Uint8Array(resultBuffer)

            resultArray.set(this.byteView.subarray(0, this.offset))

            return resultArray
        }

        const bytes = []

        for (let i = 0; i < this.offset; i++) {
            bytes.push(this.byteView[i])
        }

        return bytes
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

    /**
     * @param {number} value
     * @param field
     */
    writeInt(value, field = "") {
        this.checkLength(4)
        this.intView[this.offset / 4] = value
        this.offset += 4
    }

    /**
     * @param {number} value
     * @param field
     */
    storeInt(value, field = "") {
        this.writeInt(value, field + ":int")
    }

    /**
     * @param {number} value
     * @param {number} size
     * @param field
     */
    storeIntSize(value, size, field = "") {
        this.writeInt(value, field + ":int" + size)
    }

    /**
     * @param {boolean} value
     * @param field
     */
    storeBool(value, field = "") {
        if (value) {
            this.writeInt(0x997275b5, field + ":bool")
        } else {
            this.writeInt(0xbc799737, field + ":bool")
        }
    }

    /**
     * @param {number} iHigh
     * @param {number} iLow
     * @param field
     */
    storeLongP(iHigh, iLow, field = "") {
        this.writeInt(iLow, field + ":long[low]")
        this.writeInt(iHigh, field + ":long[high]")
    }

    /**
     * @param {number|string|Array} sLong
     * @param field
     */
    storeLong(sLong, field = "") {
        if (sLong instanceof Array) {
            if (sLong.length === 2) {
                return this.storeLongP(sLong[0], sLong[1], field)
            } else {
                return this.storeIntBytes(sLong, 64, field)
            }
        }

        if (typeof sLong != "string") {
            sLong = sLong ? sLong.toString() : "0"
        }

        const divRem = VBigInt.create(sLong).divideAndRemainder(VBigInt.create(0x100000000))

        this.writeInt(intToUint(divRem[1].toNumber()), field + ":long[low]")
        this.writeInt(intToUint(divRem[0].toNumber()), field + ":long[high]")
    }

    /**
     * @param {number} f
     * @param field
     */
    storeDouble(f, field = "") {
        const buffer = new ArrayBuffer(8)
        const intView = new Int32Array(buffer)
        const doubleView = new Float64Array(buffer)

        doubleView[0] = f

        this.writeInt(intView[0], field + ":double[low]")
        this.writeInt(intView[1], field + ":double[high]")
    }

    /**
     * @param {string} s
     * @param field
     */
    storeString(s, field = "") {
        // Logger.debug(">>>", s, field + ":string")

        if (s === undefined) {
            s = ""
        }

        const sUTF8 = unescape(encodeURIComponent(s))

        this.checkLength(sUTF8.length + 8)

        const len = sUTF8.length
        if (len <= 253) {
            this.byteView[this.offset++] = len
        } else {
            this.byteView[this.offset++] = 254
            this.byteView[this.offset++] = len & 0xFF
            this.byteView[this.offset++] = (len & 0xFF00) >> 8
            this.byteView[this.offset++] = (len & 0xFF0000) >> 16
        }
        for (let i = 0; i < len; i++) {
            this.byteView[this.offset++] = sUTF8.charCodeAt(i)
        }

        // Padding
        while (this.offset % 4) {
            this.byteView[this.offset++] = 0
        }
    }

    /**
     * @param {Array|ArrayBuffer|Uint8Array|Uint16Array|Uint32Array} bytes
     * @param field
     */
    storeBytes(bytes, field = "") {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes)
        } else if (Number.isInteger(bytes)) {
            bytes = [bytes]
        } else if (bytes === undefined) {
            bytes = []
        }

        // Logger.debug(_ => _(">>>", Bytes.asHex(bytes), field + ":bytes"))

        const len = bytes.byteLength || bytes.length
        this.checkLength(len + 8)
        if (len <= 253) {
            this.byteView[this.offset++] = len
        } else {
            this.byteView[this.offset++] = 254
            this.byteView[this.offset++] = len & 0xFF
            this.byteView[this.offset++] = (len & 0xFF00) >> 8
            this.byteView[this.offset++] = (len & 0xFF0000) >> 16
        }

        this.byteView.set(bytes, this.offset)
        this.offset += len

        // Padding
        while (this.offset % 4) {
            this.byteView[this.offset++] = 0
        }
    }

    /**
     * @param {Array|ArrayBuffer|Uint8Array|Uint16Array|Uint32Array} bytes
     * @param bits
     * @param field
     */
    storeIntBytes(bytes, bits, field = "") {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes)
        } else if (Number.isInteger(bytes)) {
            bytes = [bytes]
        }

        const len = bytes.length

        if ((bits % 32) || (len * 8) != bits) {
            throw new Error("Invalid bits: " + bits + ", " + len)
        }

        // Logger.debug(_ => _(">>>", Bytes.asHex(bytes), field + ":int" + bits))

        this.checkLength(len)

        this.byteView.set(bytes, this.offset)
        this.offset += len
    }

    /**
     * @param {Array|ArrayBuffer|Uint8Array|Uint16Array|Uint32Array} bytes
     * @param field
     */
    storeRawBytes(bytes, field = "") {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes)
        } else if (Number.isInteger(bytes)) {
            bytes = [bytes]
        }
        const len = bytes.length

        // Logger.debug(_ => _(">>>", Bytes.asHex(bytes), field))

        this.checkLength(len)

        this.byteView.set(bytes, this.offset)
        this.offset += len
    }

    /**
     * @param methodName
     * @param params
     * @return {*}
     */
    storeMethod(methodName, params) {
        let methodData = false

        for (let i = 0; i < this.schema.methods.length; i++) {
            if (String(this.schema.methods[i].method) === String(methodName)) {
                methodData = this.schema.methods[i]
                break
            }
        }

        if (!methodData) {
            throw new Error("No method " + methodName + " found")
        }

        this.storeInt(intToUint(methodData.id), methodName + "[id]")

        let param, type
        let i, condType
        let fieldBit
        let len = methodData.params.length
        for (i = 0; i < len; i++) {
            param = methodData.params[i]
            type = param.type
            if (type.indexOf("?") !== -1) {
                condType = type.split("?")
                fieldBit = condType[0].split(".")
                if (!(params[fieldBit[0]] & (1 << fieldBit[1]))) {
                    if (params.pFlags && params.pFlags[param.name]) {
                        params[fieldBit[0]] |= 1 << fieldBit[1]
                        params[param.name] = params.pFlags[param.name]
                    }
                }
            }
        }

        for (i = 0; i < len; i++) {
            param = methodData.params[i]
            type = param.type
            if (type.indexOf("?") !== -1) {
                condType = type.split("?")
                fieldBit = condType[0].split(".")
                if (!(params[fieldBit[0]] & (1 << fieldBit[1]))) {
                    continue
                }
                type = condType[1]
            }

            // console.log(param.name, params[param.name])

            this.storeObject(params[param.name], type, methodName + "[" + param.name + "]")
        }

        return methodData.type
    }

    /**
     * @param obj
     * @param type
     * @param field
     * @return {boolean|void|*}
     */
    storeObject(obj, type, field) {
        switch (type) {
            case "#":
            case "int":
                return this.storeInt(obj, field)
            case "long":
                return this.storeLong(obj, field)
            case "int128":
                return this.storeIntBytes(obj, 128, field)
            case "int256":
                return this.storeIntBytes(obj, 256, field)
            case "int512":
                return this.storeIntBytes(obj, 512, field)
            case "string":
                return this.storeString(obj, field)
            case "bytes":
                return this.storeBytes(obj, field)
            case "double":
                return this.storeDouble(obj, field)
            case "Bool":
                return this.storeBool(obj, field)
            case "true":
                return
        }

        if (obj instanceof Array) {
            // Logger.debug(type)

            if (type.substr(0, 6) === "Vector") {
                this.writeInt(0x1cb5c415, field + "[id]")
            } else if (type.substr(0, 6) !== "vector") {
                throw new Error("Invalid vector type " + type)
            }

            const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
            /*switch(itemType) {
                case "bytes":
                    this.storeBytes(obj,field);
                    break;
                default:*/
            this.writeInt(obj.length, field + "[count]")
            for (let i = 0; i < obj.length; i++) {
                this.storeObject(obj[i], itemType, field + "[" + i + "]")
            }
            //}
            return true
        } else if (type.substr(0, 6).toLowerCase() === "vector") {
            throw new Error("Invalid vector object")
        }

        if (!(obj instanceof Object)) {
            throw new Error("Invalid object for type " + type + ": " + obj)
        }

        const predicate = obj["_"]
        let isBare = type.charAt(0) === "%"
        let constructorData = false

        if (isBare) {
            type = type.substr(1)
        }

        for (let i = 0; i < this.schema.constructors.length; i++) {
            if (String(this.schema.constructors[i].predicate) === String(predicate)) {
                constructorData = this.schema.constructors[i]
                break
            }
        }

        if (!constructorData) {
            throw new Error("No predicate " + predicate + " found: " + type)
        }

        if (String(predicate) === String(type)) {
            isBare = true
        }

        if (!isBare) {
            this.writeInt(intToUint(constructorData.id), field + "[" + predicate + "][id]")
        }

        let param
        let condType
        let fieldBit
        let len = constructorData.params.length
        for (let i = 0; i < len; i++) {
            param = constructorData.params[i]

            type = param.type
            if (type.indexOf("?") !== -1) {
                condType = type.split("?")
                fieldBit = condType[0].split(".")
                if (!(obj[fieldBit[0]] & (1 << fieldBit[1]))) {
                    if (obj.pFlags && obj.pFlags[param.name]) {
                        obj[fieldBit[0]] |= 1 << fieldBit[1]
                        obj[param.name] = obj.pFlags[param.name]
                    }
                }
            }
        }

        for (let i = 0; i < len; i++) {
            param = constructorData.params[i]

            type = param.type
            if (type.indexOf("?") !== -1) {
                condType = type.split("?")
                fieldBit = condType[0].split(".")
                if (!(obj[fieldBit[0]] & (1 << fieldBit[1]))) {
                    // console.log("Fail!", type, param)

                    continue
                }
                type = condType[1]
            }

            // console.log(param.name, params[param.name])
            // console.log("store ", param.name, type, obj[param.name])
            this.storeObject(obj[param.name], type, field + "[" + predicate + "][" + param.name + "]")
        }

        return constructorData.type
    }
}
