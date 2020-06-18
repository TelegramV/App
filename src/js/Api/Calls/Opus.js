// TODO decoding should probably be done in worker?
// Further testing is required
export default class Opus {
    constructor({
                    native = false,
                    samplingRate = 48000,
                    channels = 1,
                    codingMode = 2048, // OPUS_APPLICATION_VOIP
                    frameSize = 60
                }) {
        this.native = native && this.isNativeSupported
        this.initialized = false
        this.samplingRate = samplingRate
        this.channels = channels
        this.codingMode = codingMode
        this.frameSize = frameSize
    }

    init() {
        if (this.initialized) {
            return Promise.resolve()
        }


        if (!this.native) {
            return this.loadLibOpus().then(_ => {
                this.memory = {
                    pcmDecode: this.libopus._malloc(4 * 2  * 120 * 48),
                    dataDecode: this.libopus._malloc(4096),
                    pcm: this.libopus._malloc(4096), // TODO change to actual analysisFrameSize
                    data: this.libopus._malloc(4096)
                }
                this.initialized = true
            })
        }
        this.initialized = true
        return Promise.resolve()
    }

    async loadLibOpus() {
        this.libopus = (await import("./libopus.js")).libopus()

        return new Promise(resolve => {
            this.libopus.onRuntimeInitialized = _ => {
                resolve()
            }
        })
    }

    createEncoder() {
        const size = this.libopus._opus_encoder_get_size(this.channels)

        this.enc = this.libopus._malloc(size);
        if (this.libopus._opus_encoder_init(this.enc, this.samplingRate, this.channels, this.codingMode) < 0) {
            throw new Error("Can't create encoder!")
        }
    }

    createDecoder() {
        const size = this.libopus._opus_decoder_get_size(this.channels)

        this.dec = this.libopus._malloc(size);
        if (this.libopus._opus_decoder_init(this.dec, this.samplingRate, this.channels) < 0) {
            throw new Error("Can't create decoder!")
        }
    }

    encodeFloat32(data: Float32Array) {
        const analysisFrameSize = this.samplingRate * this.frameSize / 1000

        this.libopus.HEAPF32.set(data, this.memory.pcm >> 2);
        // const dlennew = libopus._opus_encode_float(enc, p_pcm, kk * 4, p_data, data_len)

        const len = this.libopus._opus_encode_float(this.enc, this.memory.pcm, analysisFrameSize, this.memory.data, 4096)

        console.log("dlnew", len)
        return this.libopus.HEAPU8.subarray(this.memory.data, this.memory.data + len)
    }

    encodeUint8(data: Uint8Array) {
        const analysisFrameSize = this.samplingRate * this.frameSize / 1000

        // libopus.HEAPF32.set(data, p_pcm >> 2);
        // const dlennew = libopus._opus_encode_float(enc, p_pcm, kk * 4, p_data, data_len)

        this.libopus.HEAPU8.set(data, this.memory.pcm);
        const len = this.libopus._opus_encode(this.enc, this.memory.pcm, analysisFrameSize, this.memory.data, 4096)

        // console.log("dlnew", dlennew)
        return this.libopus.HEAPU8.subarray(this.memory.data, this.memory.data + len)
    }

    decode(data: Uint8Array) {
        this.libopus.HEAPU8.set(data, this.memory.dataDecode)
        var bps = 4
        var maxFrameSize = 4 * 2  * 120 * 48 / 1 / bps;
        const len = this.libopus._opus_decode_float(this.dec, this.memory.dataDecode, data.length, this.memory.pcmDecode, maxFrameSize, 0)
        return this.libopus.HEAPU8.slice(this.memory.pcmDecode, this.memory.pcmDecode + len * bps)
    }

    printVersion() {
        console.log("%c%s", "background-color: #FED85A; font-size: 2em;", this.version)
    }

    get version(): string {
        const addr = this.libopus._opus_get_version_string()
        let str = ""
        for (let i = 0; ; i++) {
            const c = this.libopus.HEAPU8[addr + i]
            if (c === 0) break
            str += String.fromCharCode(c)
        }
        return str
    }

    get isNativeSupported(): boolean {
        // TODO not implemented yet.
        return false // MediaSource.isTypeSupported("audio/webm; codecs=opus") && MediaRecorder.isTypeSupported("audio/webm; codecs=opus")
    }


}