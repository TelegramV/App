let encoder
let mainReadyResolve
const mainReady = new Promise(function (resolve) {
    mainReadyResolve = resolve;
})

self.addEventListener("message", event => {
    mainReady.then(function () {
        switch (e['data']['command']) {

            case 'encode':
                if (encoder) {
                    encoder.encode(e['data']['buffers']);
                }
                break;

            case 'getHeaderPages':
                if (encoder) {
                    encoder.generateIdPage();
                    encoder.generateCommentPage();
                }
                break;

            case 'done':
                if (encoder) {
                    encoder.encodeFinalFrame();
                    postMessage({message: 'done'});
                }
                break;

            case 'close':
                close();
                break;

            case 'flush':
                if (encoder) {
                    encoder.flush();
                }
                break;

            case 'init':
                if (encoder) {
                    encoder.destroy();
                }
                encoder = new OggOpusEncoder(e['data'], Module);
                postMessage({message: 'ready'});
                break;

            default:
            // Ignore any unknown commands and continue recieving commands
        }
    });
});

const OggOpusEncoder = function (config, Module) {

    if (!Module) {
        throw new Error('Module with exports required to initialize an encoder instance');
    }

    this.config = Object.assign({
        bufferLength: 4096, // Define size of incoming buffer
        encoderApplication: 2049, // 2048 = Voice (Lower fidelity)
                                  // 2049 = Full Band Audio (Highest fidelity)
                                  // 2051 = Restricted Low Delay (Lowest latency)
        encoderFrameSize: 20, // Specified in ms.
        encoderSampleRate: 48000, // Desired encoding sample rate. Audio will be resampled
        maxFramesPerPage: 40, // Tradeoff latency with overhead
        numberOfChannels: 1,
        originalSampleRate: 44100,
        resampleQuality: 3, // Value between 0 and 10 inclusive. 10 being highest quality.
        serial: Math.floor(Math.random() * 4294967296)
    }, config);

    this._opus_encoder_create = Module._opus_encoder_create;
    this._opus_encoder_destroy = Module._opus_encoder_destroy;
    this._opus_encoder_ctl = Module._opus_encoder_ctl;
    this._speex_resampler_process_interleaved_float = Module._speex_resampler_process_interleaved_float;
    this._speex_resampler_init = Module._speex_resampler_init;
    this._speex_resampler_destroy = Module._speex_resampler_destroy;
    this._opus_encode_float = Module._opus_encode_float;
    this._free = Module._free;
    this._malloc = Module._malloc;
    this.HEAPU8 = Module.HEAPU8;
    this.HEAP32 = Module.HEAP32;
    this.HEAPF32 = Module.HEAPF32;

    this.pageIndex = 0;
    this.granulePosition = 0;
    this.segmentData = new Uint8Array(65025); // Maximum length of oggOpus data
    this.segmentDataIndex = 0;
    this.segmentTable = new Uint8Array(255); // Maximum data segments
    this.segmentTableIndex = 0;
    this.framesInPage = 0;

    this.initChecksumTable();
    this.initCodec();
    this.initResampler();

    if (this.config.numberOfChannels === 1) {
        this.interleave = function (buffers) {
            return buffers[0];
        };
    } else {
        this.interleavedBuffers = new Float32Array(this.config.bufferLength * this.config.numberOfChannels);
    }

}


OggOpusEncoder.prototype.encode = function (buffers) {
    var samples = this.interleave(buffers);
    var sampleIndex = 0;

    while (sampleIndex < samples.length) {

        var lengthToCopy = Math.min(this.resampleBufferLength - this.resampleBufferIndex, samples.length - sampleIndex);
        this.resampleBuffer.set(samples.subarray(sampleIndex, sampleIndex + lengthToCopy), this.resampleBufferIndex);
        sampleIndex += lengthToCopy;
        this.resampleBufferIndex += lengthToCopy;

        if (this.resampleBufferIndex === this.resampleBufferLength) {
            this._speex_resampler_process_interleaved_float(this.resampler, this.resampleBufferPointer, this.resampleSamplesPerChannelPointer, this.encoderBufferPointer, this.encoderSamplesPerChannelPointer);
            var packetLength = this._opus_encode_float(this.encoder, this.encoderBufferPointer, this.encoderSamplesPerChannel, this.encoderOutputPointer, this.encoderOutputMaxLength);
            this.segmentPacket(packetLength);
            this.resampleBufferIndex = 0;

            this.framesInPage++;
            if (this.framesInPage >= this.config.maxFramesPerPage) {
                this.generatePage();
            }
        }
    }
};

OggOpusEncoder.prototype.destroy = function () {
    if (this.encoder) {
        this._free(this.encoderSamplesPerChannelPointer);
        delete this.encoderSamplesPerChannelPointer;
        this._free(this.encoderBufferPointer);
        delete this.encoderBufferPointer;
        this._free(this.encoderOutputPointer);
        delete this.encoderOutputPointer;
        this._free(this.resampleSamplesPerChannelPointer);
        delete this.resampleSamplesPerChannelPointer;
        this._free(this.resampleBufferPointer);
        delete this.resampleBufferPointer;
        this._speex_resampler_destroy(this.resampler);
        delete this.resampler;
        this._opus_encoder_destroy(this.encoder);
        delete this.encoder;
    }
};

OggOpusEncoder.prototype.flush = function () {
    if (this.framesInPage) {
        this.generatePage();
    }
    // discard any pending data in resample buffer (only a few ms worth)
    this.resampleBufferIndex = 0;
    postMessage({message: 'flushed'});
};

OggOpusEncoder.prototype.encodeFinalFrame = function () {
    if (this.resampleBufferIndex > 0) {
        var finalFrameBuffers = [];
        for (var i = 0; i < this.config.numberOfChannels; ++i) {
            finalFrameBuffers.push(new Float32Array(this.config.bufferLength - (this.resampleBufferIndex / this.config.numberOfChannels)));
        }
        this.encode(finalFrameBuffers);
    }
    this.headerType += 4;
    this.generatePage();
};

OggOpusEncoder.prototype.getChecksum = function (data) {
    var checksum = 0;
    for (var i = 0; i < data.length; i++) {
        checksum = (checksum << 8) ^ this.checksumTable[((checksum >>> 24) & 0xff) ^ data[i]];
    }
    return checksum >>> 0;
};

OggOpusEncoder.prototype.generateCommentPage = function () {
    var segmentDataView = new DataView(this.segmentData.buffer);
    segmentDataView.setUint32(0, 1937076303, true) // Magic Signature 'Opus'
    segmentDataView.setUint32(4, 1936154964, true) // Magic Signature 'Tags'
    segmentDataView.setUint32(8, 10, true); // Vendor Length
    segmentDataView.setUint32(12, 1868784978, true); // Vendor name 'Reco'
    segmentDataView.setUint32(16, 1919247474, true); // Vendor name 'rder'
    segmentDataView.setUint16(20, 21322, true); // Vendor name 'JS'
    segmentDataView.setUint32(22, 0, true); // User Comment List Length
    this.segmentTableIndex = 1;
    this.segmentDataIndex = this.segmentTable[0] = 26;
    this.headerType = 0;
    this.generatePage();
};

OggOpusEncoder.prototype.generateIdPage = function () {
    var segmentDataView = new DataView(this.segmentData.buffer);
    segmentDataView.setUint32(0, 1937076303, true) // Magic Signature 'Opus'
    segmentDataView.setUint32(4, 1684104520, true) // Magic Signature 'Head'
    segmentDataView.setUint8(8, 1, true); // Version
    segmentDataView.setUint8(9, this.config.numberOfChannels, true); // Channel count
    segmentDataView.setUint16(10, 3840, true); // pre-skip (80ms)
    segmentDataView.setUint32(12, this.config.originalSampleRateOverride || this.config.originalSampleRate, true); // original sample rate
    segmentDataView.setUint16(16, 0, true); // output gain
    segmentDataView.setUint8(18, 0, true); // channel map 0 = mono or stereo
    this.segmentTableIndex = 1;
    this.segmentDataIndex = this.segmentTable[0] = 19;
    this.headerType = 2;
    this.generatePage();
};

OggOpusEncoder.prototype.generatePage = function () {
    var granulePosition = (this.lastPositiveGranulePosition === this.granulePosition) ? -1 : this.granulePosition;
    var pageBuffer = new ArrayBuffer(27 + this.segmentTableIndex + this.segmentDataIndex);
    var pageBufferView = new DataView(pageBuffer);
    var page = new Uint8Array(pageBuffer);

    pageBufferView.setUint32(0, 1399285583, true); // Capture Pattern starts all page headers 'OggS'
    pageBufferView.setUint8(4, 0, true); // Version
    pageBufferView.setUint8(5, this.headerType, true); // 1 = continuation, 2 = beginning of stream, 4 = end of stream

    // Number of samples upto and including this page at 48000Hz, into signed 64 bit Little Endian integer
    // Javascript Number maximum value is 53 bits or 2^53 - 1
    pageBufferView.setUint32(6, granulePosition, true);
    if (granulePosition < 0) {
        pageBufferView.setInt32(10, Math.ceil(granulePosition / 4294967297) - 1, true);
    } else {
        pageBufferView.setInt32(10, Math.floor(granulePosition / 4294967296), true);
    }

    pageBufferView.setUint32(14, this.config.serial, true); // Bitstream serial number
    pageBufferView.setUint32(18, this.pageIndex++, true); // Page sequence number
    pageBufferView.setUint8(26, this.segmentTableIndex, true); // Number of segments in page.
    page.set(this.segmentTable.subarray(0, this.segmentTableIndex), 27); // Segment Table
    page.set(this.segmentData.subarray(0, this.segmentDataIndex), 27 + this.segmentTableIndex); // Segment Data
    pageBufferView.setUint32(22, this.getChecksum(page), true); // Checksum

    postMessage({message: 'page', page: page, samplePosition: this.granulePosition}, [page.buffer]);
    this.segmentTableIndex = 0;
    this.segmentDataIndex = 0;
    this.framesInPage = 0;
    if (granulePosition > 0) {
        this.lastPositiveGranulePosition = granulePosition;
    }
};

OggOpusEncoder.prototype.initChecksumTable = function () {
    this.checksumTable = [];
    for (var i = 0; i < 256; i++) {
        var r = i << 24;
        for (var j = 0; j < 8; j++) {
            r = ((r & 0x80000000) != 0) ? ((r << 1) ^ 0x04c11db7) : (r << 1);
        }
        this.checksumTable[i] = (r & 0xffffffff);
    }
};

OggOpusEncoder.prototype.setOpusControl = function (control, value) {
    var location = this._malloc(4);
    this.HEAP32[location >> 2] = value;
    this._opus_encoder_ctl(this.encoder, control, location);
    this._free(location);
};

OggOpusEncoder.prototype.initCodec = function () {
    var errLocation = this._malloc(4);
    this.encoder = this._opus_encoder_create(this.config.encoderSampleRate, this.config.numberOfChannels, this.config.encoderApplication, errLocation);
    this._free(errLocation);

    if (this.config.encoderBitRate) {
        this.setOpusControl(4002, this.config.encoderBitRate);
    }

    if (this.config.encoderComplexity) {
        this.setOpusControl(4010, this.config.encoderComplexity);
    }

    this.encoderSamplesPerChannel = this.config.encoderSampleRate * this.config.encoderFrameSize / 1000;
    this.encoderSamplesPerChannelPointer = this._malloc(4);
    this.HEAP32[this.encoderSamplesPerChannelPointer >> 2] = this.encoderSamplesPerChannel;

    this.encoderBufferLength = this.encoderSamplesPerChannel * this.config.numberOfChannels;
    this.encoderBufferPointer = this._malloc(this.encoderBufferLength * 4); // 4 bytes per sample
    this.encoderBuffer = this.HEAPF32.subarray(this.encoderBufferPointer >> 2, (this.encoderBufferPointer >> 2) + this.encoderBufferLength);

    this.encoderOutputMaxLength = 4000;
    this.encoderOutputPointer = this._malloc(this.encoderOutputMaxLength);
    this.encoderOutputBuffer = this.HEAPU8.subarray(this.encoderOutputPointer, this.encoderOutputPointer + this.encoderOutputMaxLength);
};

OggOpusEncoder.prototype.initResampler = function () {
    var errLocation = this._malloc(4);
    this.resampler = this._speex_resampler_init(this.config.numberOfChannels, this.config.originalSampleRate, this.config.encoderSampleRate, this.config.resampleQuality, errLocation);
    this._free(errLocation);

    this.resampleBufferIndex = 0;
    this.resampleSamplesPerChannel = this.config.originalSampleRate * this.config.encoderFrameSize / 1000;
    this.resampleSamplesPerChannelPointer = this._malloc(4);
    this.HEAP32[this.resampleSamplesPerChannelPointer >> 2] = this.resampleSamplesPerChannel;

    this.resampleBufferLength = this.resampleSamplesPerChannel * this.config.numberOfChannels;
    this.resampleBufferPointer = this._malloc(this.resampleBufferLength * 4); // 4 bytes per sample
    this.resampleBuffer = this.HEAPF32.subarray(this.resampleBufferPointer >> 2, (this.resampleBufferPointer >> 2) + this.resampleBufferLength);
};

OggOpusEncoder.prototype.interleave = function (buffers) {
    for (var i = 0; i < this.config.bufferLength; i++) {
        for (var channel = 0; channel < this.config.numberOfChannels; channel++) {
            this.interleavedBuffers[i * this.config.numberOfChannels + channel] = buffers[channel][i];
        }
    }

    return this.interleavedBuffers;
};

OggOpusEncoder.prototype.segmentPacket = function (packetLength) {
    var packetIndex = 0;

    while (packetLength >= 0) {

        if (this.segmentTableIndex === 255) {
            this.generatePage();
            this.headerType = 1;
        }

        var segmentLength = Math.min(packetLength, 255);
        this.segmentTable[this.segmentTableIndex++] = segmentLength;
        this.segmentData.set(this.encoderOutputBuffer.subarray(packetIndex, packetIndex + segmentLength), this.segmentDataIndex);
        this.segmentDataIndex += segmentLength;
        packetIndex += segmentLength;
        packetLength -= 255;
    }

    this.granulePosition += (48 * this.config.encoderFrameSize);
    if (this.segmentTableIndex === 255) {
        this.generatePage();
        this.headerType = 0;
    }
};


// if (!Module) {
//   Module = {};
// }
//
// Module['mainReady'] = mainReady;
// Module['OggOpusEncoder'] = OggOpusEncoder;
// Module['onRuntimeInitialized'] = mainReadyResolve;
//
// module.exports = Module;
