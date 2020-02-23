export class BufferWriter {
    buffer: ArrayBuffer
    dv: DataView

    constructor(options = {
        startMaxLength: 2048
    }) {
        this.maxLength = options.startMaxLength || 2048
        this.offset = 0
        this.createBuffer()
    }

    getBytes(typed) {
        if (typed) {
            const resultBuffer = new ArrayBuffer(this.offset)
            const resultArray = new Uint8Array(resultBuffer)

            resultArray.set(new Uint8Array(this.buffer).subarray(0, this.offset))

            return resultArray
        }

        const bytes = []

        for (let i = 0; i < this.offset; i++) {
            bytes.push(this.dv.getUint8(i))
        }

        return bytes
    }

    createBuffer() {
        this.buffer = new ArrayBuffer(this.maxLength)
        this.dv = new DataView(this.buffer)
    }

    storeInt(value: number) {
        this.dv.setInt32(this.offset, value, true)
        this.offset += 4
    }

    storeUint(value: number) {
        this.dv.setUint32(this.offset, value, true)
        this.offset += 4
    }

    storeLong(value: bigint) {
        this.dv.setBigInt64(this.offset, value, true)
        this.offset += 8
    }

    storeUlong(value: bigint) {
        this.dv.setBigUint64(this.offset, value, true)
        this.offset += 8
    }

    storeShort(value: number) {
        this.dv.setInt16(this.offset, value, true)
        this.offset += 2
    }

    storeUshort(value: number) {
        this.dv.setUint16(this.offset, value, true)
        this.offset += 2
    }

    storeByte(value: number) {
        this.dv.setUint8(this.offset, value)
        this.offset += 1
    }

    storeBytes(value: Array<number>) {
        value.forEach(l => {
            this.storeByte(l)
        })
    }
}

export class BufferReader {
    buffer: ArrayBuffer
    dv: DataView

    constructor(buffer) {
        this.buffer = buffer
        this.dv = new DataView(buffer)
        this.offset = 0
    }

    getInt() {
        const r = this.dv.getInt32(this.offset, true)
        this.offset += 4
        return r
    }

    getUint() {
        const r = this.dv.getUint32(this.offset, true)
        this.offset += 4
        return r
    }

    getLong() {
        const r = this.dv.getBigInt64(this.offset, true)
        this.offset += 8
        return r
    }

    getUlong() {
        const r = this.dv.getBigUint64(this.offset, true)
        this.offset += 8
        return r
    }

    getShort() {
        const r = this.dv.getInt16(this.offset, true)
        this.offset += 2
        return r
    }

    getUshort() {
        const r = this.dv.getUint16(this.offset, true)
        this.offset += 2
        return r
    }

    getByte() {
        const r = this.dv.getUint8(this.offset)
        this.offset += 1
        return r
    }

    getBytes(length: number): Uint8Array {
        const r = new Uint8Array(length)
        for(let i = 0; i < length; i++) {
            r[i] = this.getByte()
        }
        return r
    }
}