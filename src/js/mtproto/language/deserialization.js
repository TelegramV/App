import {bigint, bytesToArrayBuffer, bytesToHex, gzipUncompress, uintToInt} from "../utils/bin"
import {createLogger} from "../../common/logger"

const Logger = createLogger("TLDeserialization", {
    level: "log"
})

export class TLDeserialization {
    constructor(buffer, options = {
        schema: require("./schema_combine")
    }) {
        this.offset = 0 // in bytes
        this.override = options.override || {}

        this.schema = options.schema || require("./schema_combine")

        this.buffer = buffer
        this.intView = new Uint32Array(this.buffer)
        this.byteView = new Uint8Array(this.buffer)

        this.mtproto = options.mtproto || false
    }

    readInt(field = "") {
        if (this.offset >= this.intView.length * 4) {
            throw new Error("Nothing to fetch: " + field)
        }

        const i = this.intView[this.offset / 4]

        Logger.debug("<<<", i.toString(16), i, field)

        this.offset += 4

        return i
    }

    fetchInt(field = "") {
        return this.readInt(field + ":int")
    }

    fetchDouble(field = "") {
        const buffer = new ArrayBuffer(8)
        const intView = new Int32Array(buffer)
        const doubleView = new Float64Array(buffer)

        intView[0] = this.readInt(field + ":double[low]"),
            intView[1] = this.readInt(field + ":double[high]")

        return doubleView[0]
    }

    fetchLong(field) {
        const iLow = this.readInt(field + ":long[low]")
        const iHigh = this.readInt(field + ":long[high]")

        const longDec = bigint(iHigh).shiftLeft(32).add(bigint(iLow)).toString()

        return longDec
    }

    fetchBool(field) {
        const i = this.readInt(field + ":bool")
        if (i === 0x997275b5) {
            return true
        } else if (i === 0xbc799737) {
            return false
        }

        this.offset -= 4
        return this.fetchObject("Object", field)
    }

    fetchString(field) {
        let len = this.byteView[this.offset++]

        if (len === 254) {
            len = this.byteView[this.offset++] |
                (this.byteView[this.offset++] << 8) |
                (this.byteView[this.offset++] << 16)
        }

        let sUTF8 = ""
        for (let i = 0; i < len; i++) {
            sUTF8 += String.fromCharCode(this.byteView[this.offset++])
        }

        // Padding
        while (this.offset % 4) {
            this.offset++
        }

        let s = sUTF8;
        try {
            s = decodeURIComponent(escape(sUTF8))
        } catch (e) {
            s = sUTF8
        }

        //Logger.debug("<<<", s, field + ":string")

        return s
    }

    fetchBytes(field) {
        let len = this.byteView[this.offset++]

        if (len === 254) {
            len = this.byteView[this.offset++] |
                (this.byteView[this.offset++] << 8) |
                (this.byteView[this.offset++] << 16)
        }

        const bytes = this.byteView.subarray(this.offset, this.offset + len)
        this.offset += len

        // Padding
        while (this.offset % 4) {
            this.offset++
        }

        Logger.debug("<<<", bytesToHex(bytes), field + ":bytes")

        return bytes
    }

    fetchIntBytes(bits, typed, field) {
        if (bits % 32) {
            throw new Error("Invalid bits: " + bits)
        }

        const len = bits / 8
        if (typed) {
            const result = this.byteView.subarray(this.offset, this.offset + len)
            this.offset += len
            return result
        }

        const bytes = []
        for (let i = 0; i < len; i++) {
            bytes.push(this.byteView[this.offset++])
        }

        Logger.debug("<<<", bytesToHex(bytes), field + ":int" + bits)

        return bytes
    }

    fetchRawBytes(len, typed, field) {
        if (len === false) {
            len = this.readInt(field + "_length")
            if (len > this.byteView.byteLength) {
                throw new Error("Invalid raw bytes length: " + len + ", buffer len: " + this.byteView.byteLength)
            }
        }

        if (typed) {
            const bytes = new Uint8Array(len)
            bytes.set(this.byteView.subarray(this.offset, this.offset + len))
            this.offset += len
            return bytes
        }

        const bytes = []
        for (let i = 0; i < len; i++) {
            bytes.push(this.byteView[this.offset++])
        }

        Logger.debug("<<<", bytesToHex(bytes), field)

        return bytes
    }

    fetchObject(type, field) {
        switch (type) {
            case "#":
            case "int":
                return this.fetchInt(field)
            case "long":
                return this.fetchLong(field)
            case "int128":
                return this.fetchIntBytes(128, false, field)
            case "int256":
                return this.fetchIntBytes(256, false, field)
            case "int512":
                return this.fetchIntBytes(512, false, field)
            case "string":
                return this.fetchString(field)
            case "bytes":
                return this.fetchBytes(field)
            case "double":
                return this.fetchDouble(field)
            case "Bool":
                return this.fetchBool(field)
            case "true":
                return true
        }

        field = field || type || "Object"

        if (type.substr(0, 6) === "Vector" || type.substr(0, 6) === "vector") {
            if (type.charAt(0) === "V") {
                const constructor = this.readInt(field + "[id]")
                const constructorCmp = uintToInt(constructor)

                if (constructorCmp === 0x3072cfa1) { // Gzip packed
                    const compressed = this.fetchBytes(field + "[packed_string]")
                    const uncompressed = gzipUncompress(compressed)
                    const buffer = bytesToArrayBuffer(uncompressed)
                    const newDeserializer = (new TLDeserialization(buffer))

                    return newDeserializer.fetchObject(type, field)
                }
                if (constructorCmp !== 0x1cb5c415) {
                    throw new Error("Invalid vector constructor " + constructor)
                }
            }
            const len = this.readInt(field + "[count]")
            let result = []
            if (len > 0) {
                const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
                for (let i = 0; i < len; i++) {
                    result.push(this.fetchObject(itemType, field + "[" + i + "]"))
                }
            }

            return result
        }

        let predicate = null
        let constructorData = false

        if (type.charAt(0) === "%") {
            let checkType = type.substr(1)
            for (let i = 0; i < this.schema.constructors.length; i++) {
                if (String(this.schema.constructors[i].type) === String(checkType)) {
                    constructorData = this.schema.constructors[i]
                    break
                }
            }
            if (!constructorData) {
                throw new Error("Constructor not found for type: " + type)
            }
        } else if (type.charAt(0) >= 97 && type.charAt(0) <= 122) {
            for (let i = 0; i < this.schema.constructors.length; i++) {
                if (String(this.schema.constructors[i].predicate) === String(type)) {
                    constructorData = this.schema.constructors[i]
                    break
                }
            }
            if (!constructorData) {
                throw new Error("Constructor not found for predicate: " + type)
            }
        } else {
            const constructor = this.readInt(field + "[id]")
            const constructorCmp = uintToInt(constructor)

            if (constructorCmp === 0x3072cfa1) { // Gzip packed
                const compressed = this.fetchBytes(field + "[packed_string]")
                const uncompressed = gzipUncompress(compressed)
                const buffer = bytesToArrayBuffer(uncompressed)
                const newDeserializer = (new TLDeserialization(buffer))

                return newDeserializer.fetchObject(type, field)
            }

            let index = this.schema.constructorsIndex
            if (!index) {
                this.schema.constructorsIndex = index = {}
                for (let i = 0; i < this.schema.constructors.length; i++) {
                    index[this.schema.constructors[i].id] = i
                }
            }
            let i = index[constructorCmp]
            if (i) {
                constructorData = this.schema.constructors[i]
            }

            let fallback = false
            if (!constructorData && this.mtproto) {
                let schemaFallback = this.schema
                for (i = 0; i < schemaFallback.constructors.length; i++) {
                    if (schemaFallback.constructors[i].id == constructorCmp) {
                        constructorData = schemaFallback.constructors[i]

                        delete this.mtproto
                        fallback = true
                        break
                    }
                }
            }
            if (!constructorData) {
                throw new Error("Constructor not found: " + constructorCmp + " " + this.fetchInt() + " " + this.fetchInt())
            }
        }

        predicate = constructorData.predicate

        let result = {"_": predicate}
        let overrideKey = (this.mtproto ? "mt_" : "") + predicate
        let self = this

        if (this.override[overrideKey]) {
            this.override[overrideKey].apply(this, [result, field + "[" + predicate + "]"])
        } else {
            let i, param
            let type, isCond
            let condType, fieldBit
            let value
            let len = constructorData.params.length
            for (i = 0; i < len; i++) {
                param = constructorData.params[i]
                type = param.type
                if (type === "#" && result.pFlags === undefined) {
                    result.pFlags = {}
                }
                isCond = type.indexOf("?") !== -1
                if (isCond) {
                    condType = type.split("?")
                    fieldBit = condType[0].split(".")
                    if (!(result[fieldBit[0]] & (1 << fieldBit[1]))) {
                        continue
                    }
                    type = condType[1]
                }

                value = self.fetchObject(type, field + "[" + predicate + "][" + param.name + "]")

                if (isCond && type === "true") {
                    result.pFlags[param.name] = value
                } else {
                    result[param.name] = value
                }
            }
        }

        return result
    }

    getOffset() {
        return this.offset
    }

    getLeftoverArray() {
        return this.byteView.slice(this.offset, this.byteView.byteLength - 1)
    }

    fetchEnd() {
        if (this.offset !== this.byteView.length) {
            throw new Error("Fetch end with non-empty buffer")
        }

        return true
    }
}