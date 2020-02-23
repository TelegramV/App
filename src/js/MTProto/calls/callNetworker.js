class BufferWriter extends DataView {
    offset = 0

    storeInt32(v) {
        this.setInt32(this.offset, v)
        this.offset += 4
    }

    storeBytes(v) {
        for(let i = 0; i < v.length; i++) {
            this.setUint8(this.offset, v[i])
        }
        this.offset += v.length
    }
}
export class CallNetworker {
    options = {
        protocolVersion: 9,
        minProtocolVersion: 3,
        protocolName: 0x50567247, // "GrVP" in little endian (reversed here)
    }

    constructor(maxLayer: number) {
        this.options.maxLayer = maxLayer
    }

    sendInit() {
        const flags = 0

        const arr = new Uint8Array(1024)
        const dv = new BufferWriter(arr)

        dv.storeInt32(this.options.protocolVersion)
        dv.storeInt32(this.options.minProtocolVersion)
        dv.storeInt32(flags)

        dv.storeBytes([2, 1, 0, 0, 0])
        // OPUS
        dv.storeInt32(1398100047)
        dv.storeBytes([0, 0])

        return arr
    }

    writePacketHeader(bytes) {

    }
}