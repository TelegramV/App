import {CallsManager} from "../../Api/Calls/CallManager";

export class OggOpus {
    async init() {
        this.opus = CallsManager.opus

        await CallsManager.initOpus()

        this.pageIndex = 0
        this.granulePosition = 0

        this.segmentData = new Uint8Array(65025)
        this.segmentDataIndex = 0
        this.segmentTable = new Uint8Array( 255 )
        this.segmentTableIndex = 0
        this.framesInPage = 0

        this.encoderFrameSize = 60

        this.checksumTable = []

        this.buffer = new Uint8Array(5760)
        this.currentOffset = 0

        this.serial = Math.floor(Math.random() * 4294967296)

        this.resampleBufferLength = 48000 * this.encoderFrameSize / 1000

        this.pages = []
        this.totalLength = 0

        this.initChecksumTable()

        this.generateIdPage()
        this.generateCommentPage()

        await this.createAudio()

        this.startedAt = +new Date()
    }

    createAudio() {
        // Copy paste from CallsMgr but who cares /shrug
        return navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {

            const audioContext = new AudioContext({
                sampleRate: 48000,
            })
            const input = audioContext.createMediaStreamSource(stream)
            // TODO buffer size should be analysisFrameSize
            // unfortunately createScriptProcessor only supports 2^n buffer sizes
            // so some hacks with temp buffers and setTimeouts should be done
            // to both keep up with the sample rate AND to send correct data
            // ffs js!
            const captureNode = audioContext.createScriptProcessor(256, 1, 1)

            captureNode.addEventListener('audioprocess', this.dataavailable)
            input.connect(captureNode)
            captureNode.connect(audioContext.destination)


            this.audio = {
                stream: stream,
                audioContext,
                input,
                captureNode,
            }
        })
    }

    stop() {
        this.encodeFinalFrame()
            this.audio.stream.getTracks().forEach((track) => {
                track.stop();
                // this.$el.querySelector(".voice-circle").style.transform = `scale(1)`
            });
            // this.microphone = null
            // this.recorder = null
            this.audio.audioContext.close()
        var outputData = new Uint8Array( this.totalLength );
        this.pages.reduce( function( offset, page ){
            console.log(offset, page)
            outputData.set( new Uint8Array(page), offset );
            return offset + page.byteLength;
        }, 0);
        return {bytes: outputData, duration: +new Date() - this.startedAt}
    }

    dataavailable = (ev) => {
        const pcm = ev.inputBuffer.getChannelData(0)
        this.encode(pcm)
    }

    encodeFinalFrame() {
        // if ( this.resampleBufferIndex > 0 ) {
        //     var finalFrameBuffers = [];
        //     for ( var i = 0; i < this.config.numberOfChannels; ++i ) {
        //         finalFrameBuffers.push( new Float32Array( this.config.bufferLength - (this.resampleBufferIndex / this.config.numberOfChannels) ));
        //     }
        //     this.encode( finalFrameBuffers );
        // }
        this.headerType += 4;
        this.generatePage();
    }

    encode( samples ) {
        // var samples = buffers[0];
        var sampleIndex = 0;


        let data = new Int16Array(samples.length)
        for(let i = 0; i < samples.length; i++) {
            data[i] = samples[i] * 256 * 256 / 2
        }
        data = new Uint8Array(data.buffer)
        const oldOffset = this.currentOffset
        this.currentOffset += data.length
        if(this.currentOffset >= this.buffer.length) {

            this.currentOffset -= this.buffer.length
            this.buffer.set(new Uint8Array(data.buffer, 0, this.buffer.length - oldOffset), oldOffset)
            // TODO!!!
            // this.networker.sendStreamData(this.opus.encodeUint8(new Uint8Array(this.buffer)))
            const encoded = this.opus.encodeUint8(new Uint8Array(this.buffer))
            console.log(encoded)
            this.segmentPacket(encoded)
            this.framesInPage++
            if ( this.framesInPage >= 40 ) { // maxFramesPerPage
                this.generatePage()
            }
            this.buffer.fill(0, 0, this.buffer.length)

            this.buffer.set(new Uint8Array(data.buffer, this.buffer.length - oldOffset, data.length - (this.buffer.length - oldOffset)), 0)
            this.currentOffset = data.length - (this.buffer.length - oldOffset)

            return
        }
        this.buffer.set(data, oldOffset)

        // while ( sampleIndex < samples.length ) {
        //
        //     var lengthToCopy = Math.min( this.resampleBufferLength - this.resampleBufferIndex, samples.length - sampleIndex );
        //     this.resampleBuffer.set( samples.subarray( sampleIndex, sampleIndex+lengthToCopy ), this.resampleBufferIndex );
        //     sampleIndex += lengthToCopy;
        //     this.resampleBufferIndex += lengthToCopy;
        //
        //     if ( this.resampleBufferIndex === this.resampleBufferLength ) {
        //         this._speex_resampler_process_interleaved_float( this.resampler, this.resampleBufferPointer, this.resampleSamplesPerChannelPointer, this.encoderBufferPointer, this.encoderSamplesPerChannelPointer );
        //         var packetLength = this._opus_encode_float( this.encoder, this.encoderBufferPointer, this.encoderSamplesPerChannel, this.encoderOutputPointer, this.encoderOutputMaxLength );
        //         this.segmentPacket( packetLength );
        //         this.resampleBufferIndex = 0;
        //
        //         this.framesInPage++;
        //         if ( this.framesInPage >= this.config.maxFramesPerPage ) {
        //             this.generatePage();
        //         }
        //     }
        // }
    }

    segmentPacket( packet ) {
        var packetIndex = 0;
        let packetLength = packet.length

        while ( packetLength >= 0 ) {

            if ( this.segmentTableIndex === 255 ) {
                this.generatePage();
                this.headerType = 1;
            }

            var segmentLength = Math.min( packetLength, 255 );
            this.segmentTable[ this.segmentTableIndex++ ] = segmentLength;
            // TODO!!!
            this.segmentData.set( packet.subarray( packetIndex, packetIndex + segmentLength ), this.segmentDataIndex );
            this.segmentDataIndex += segmentLength;
            packetIndex += segmentLength;
            packetLength -= 255;
        }

        this.granulePosition += ( 48 * this.encoderFrameSize );
        if ( this.segmentTableIndex === 255 ) {
            this.generatePage();
            this.headerType = 0;
        }
    }

    initChecksumTable = function(){
        this.checksumTable = [];
        for (let i = 0; i < 256; i++ ) {
            let r = i << 24;
            for (let j = 0; j < 8; j++ ) {
                r = (r & 0x80000000) !== 0 ? r << 1 ^ 0x04c11db7 : r << 1;
            }
            this.checksumTable[i] = r & 0xffffffff;
        }
    }

    getChecksum( data ){
        var checksum = 0;
        for ( var i = 0; i < data.length; i++ ) {
            checksum = (checksum << 8) ^ this.checksumTable[ ((checksum>>>24) & 0xff) ^ data[i] ];
        }
        return checksum >>> 0;
    }

    generateIdPage(){
        var segmentDataView = new DataView( this.segmentData.buffer );
        segmentDataView.setUint32( 0, 1937076303, true ) // Magic Signature 'Opus'
        segmentDataView.setUint32( 4, 1684104520, true ) // Magic Signature 'Head'
        segmentDataView.setUint8( 8, 1, true ); // Version
        segmentDataView.setUint8( 9, 1, true ); // Channel count
        segmentDataView.setUint16( 10, 3840, true ); // pre-skip (80ms)
        segmentDataView.setUint32( 12, 48000, true ); // original sample rate
        segmentDataView.setUint16( 16, 0, true ); // output gain
        segmentDataView.setUint8( 18, 0, true ); // channel map 0 = mono or stereo
        this.segmentTableIndex = 1;
        this.segmentDataIndex = this.segmentTable[0] = 19;
        this.headerType = 2;
        this.generatePage();
    }

    generateCommentPage() {
        const segmentDataView = new DataView(this.segmentData.buffer);
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
    }

    generatePage(){
        const granulePosition = this.lastPositiveGranulePosition === this.granulePosition ? -1 : this.granulePosition;
        const pageBuffer = new ArrayBuffer(27 + this.segmentTableIndex + this.segmentDataIndex);
        const pageBufferView = new DataView(pageBuffer);
        const page = new Uint8Array(pageBuffer);

        pageBufferView.setUint32( 0, 1399285583, true); // Capture Pattern starts all page headers 'OggS'
        pageBufferView.setUint8( 4, 0, true ); // Version
        pageBufferView.setUint8( 5, this.headerType, true ); // 1 = continuation, 2 = beginning of stream, 4 = end of stream

        // Number of samples upto and including this page at 48000Hz, into signed 64 bit Little Endian integer
        // Javascript Number maximum value is 53 bits or 2^53 - 1
        pageBufferView.setUint32( 6, granulePosition, true );
        if (granulePosition < 0) {
            pageBufferView.setInt32( 10, Math.ceil(granulePosition/4294967297) - 1, true );
        }
        else {
            pageBufferView.setInt32( 10, Math.floor(granulePosition/4294967296), true );
        }

        pageBufferView.setUint32( 14, this.serial, true ); // Bitstream serial number
        pageBufferView.setUint32( 18, this.pageIndex++, true ); // Page sequence number
        pageBufferView.setUint8( 26, this.segmentTableIndex, true ); // Number of segments in page.
        page.set( this.segmentTable.subarray(0, this.segmentTableIndex), 27 ); // Segment Table
        page.set( this.segmentData.subarray(0, this.segmentDataIndex), 27 + this.segmentTableIndex ); // Segment Data
        pageBufferView.setUint32( 22, this.getChecksum( page ), true ); // Checksum

        // console.log(page.buffer)
        this.pages.push(page.buffer)
        this.totalLength += page.buffer.byteLength;

        // global['postMessage']( {message: 'page', page: page, samplePosition: this.granulePosition}, [page.buffer] );
        this.segmentTableIndex = 0;
        this.segmentDataIndex = 0;
        this.framesInPage = 0;
        if ( granulePosition > 0 ) {
            this.lastPositiveGranulePosition = granulePosition;
        }
    }

}