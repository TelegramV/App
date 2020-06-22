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

var WavePCM = function (config) {

    var config = Object.assign({
        wavBitDepth: 16
    }, config);

    if (!config['wavSampleRate']) {
        throw new Error("wavSampleRate value is required to record. NOTE: Audio is not resampled!");
    }

    if ([8, 16, 24, 32].indexOf(config['wavBitDepth']) === -1) {
        throw new Error("Only 8, 16, 24 and 32 bits per sample are supported");
    }

    this.bitDepth = config['wavBitDepth'];
    this.sampleRate = config['wavSampleRate'];
    this.recordedBuffers = [];
    this.bytesPerSample = this.bitDepth / 8;
};

WavePCM.prototype.record = function (buffers) {
    this.numberOfChannels = this.numberOfChannels || buffers.length;
    var bufferLength = buffers[0].length;
    var reducedData = new Uint8Array(bufferLength * this.numberOfChannels * this.bytesPerSample);

    // Interleave
    for (var i = 0; i < bufferLength; i++) {
        for (var channel = 0; channel < this.numberOfChannels; channel++) {

            var outputIndex = (i * this.numberOfChannels + channel) * this.bytesPerSample;

            // clip the signal if it exceeds [-1, 1]
            var sample = Math.max(-1, Math.min(1, buffers[channel][i]));

            // bit reduce and convert to integer
            switch (this.bytesPerSample) {
                case 4: // 32 bits signed
                    sample = sample * 2147483647.5 - 0.5;
                    reducedData[outputIndex] = sample;
                    reducedData[outputIndex + 1] = sample >> 8;
                    reducedData[outputIndex + 2] = sample >> 16;
                    reducedData[outputIndex + 3] = sample >> 24;
                    break;

                case 3: // 24 bits signed
                    sample = sample * 8388607.5 - 0.5;
                    reducedData[outputIndex] = sample;
                    reducedData[outputIndex + 1] = sample >> 8;
                    reducedData[outputIndex + 2] = sample >> 16;
                    break;

                case 2: // 16 bits signed
                    sample = sample * 32767.5 - 0.5;
                    reducedData[outputIndex] = sample;
                    reducedData[outputIndex + 1] = sample >> 8;
                    break;

                case 1: // 8 bits unsigned
                    reducedData[outputIndex] = (sample + 1) * 127.5;
                    break;

                default:
                    throw new Error("Only 8, 16, 24 and 32 bits per sample are supported");
            }
        }
    }

    this.recordedBuffers.push(reducedData);
};

WavePCM.prototype.requestData = function () {
    var bufferLength = this.recordedBuffers[0].length;
    var dataLength = this.recordedBuffers.length * bufferLength;
    var headerLength = 44;
    var wav = new Uint8Array(headerLength + dataLength);
    var view = new DataView(wav.buffer);

    view.setUint32(0, 1380533830, false); // RIFF identifier 'RIFF'
    view.setUint32(4, 36 + dataLength, true); // file length minus RIFF identifier length and file description length
    view.setUint32(8, 1463899717, false); // RIFF type 'WAVE'
    view.setUint32(12, 1718449184, false); // format chunk identifier 'fmt '
    view.setUint32(16, 16, true); // format chunk length
    view.setUint16(20, 1, true); // sample format (raw)
    view.setUint16(22, this.numberOfChannels, true); // channel count
    view.setUint32(24, this.sampleRate, true); // sample rate
    view.setUint32(28, this.sampleRate * this.bytesPerSample * this.numberOfChannels, true); // byte rate (sample rate * block align)
    view.setUint16(32, this.bytesPerSample * this.numberOfChannels, true); // block align (channel count * bytes per sample)
    view.setUint16(34, this.bitDepth, true); // bits per sample
    view.setUint32(36, 1684108385, false); // data chunk identifier 'data'
    view.setUint32(40, dataLength, true); // data chunk length

    for (var i = 0; i < this.recordedBuffers.length; i++) {
        wav.set(this.recordedBuffers[i], i * bufferLength + headerLength);
    }

    global['postMessage']({message: 'page', page: wav}, [wav.buffer]);
    global['postMessage']({message: 'done'});
};
