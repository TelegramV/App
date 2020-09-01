import DecoderWorker from 'worker-loader!opus-recorder/dist/decoderWorker.min';
import WaveWorker from 'worker-loader!opus-recorder/dist/waveWorker.min';

const SAMPLE_RATE = 10000;
const BIT_DEPTH = 16;

export async function oggToWav(opusData) {
    const arrayBuffer = await new Response(opusData).arrayBuffer();
    return new Promise((resolve) => {
        const typedArray = new Uint8Array(arrayBuffer);
        const decoderWorker = new DecoderWorker();
        const waveWorker = new WaveWorker();

        decoderWorker.onmessage = (e) => {
            // null returned when finished
            if (e.data === null) {
                wavWorker.postMessage({ command: 'done' });
            } else {
                wavWorker.postMessage({
	                    command: 'encode',
	                    buffers: e.data,
	                },
                	e.data.map(data => data.buffer),
                );
            }
        };

        waveWorker.onmessage = (e) => {
            if (e.data.message === 'page') {
                resolve(new Blob([e.data.page], { type: 'audio/wav' }));
            }
        };

        waveWorker.postMessage({
            command: 'init',
            wavBitDepth: BIT_DEPTH,
            wavSampleRate: SAMPLE_RATE,
        });

        decoderWorker.postMessage({
            command: 'init',
            decoderSampleRate: SAMPLE_RATE,
            outputBufferSampleRate: SAMPLE_RATE,
        });

        decoderWorker.postMessage({
            command: 'decode',
            pages: typedArray,
        }, [typedArray.buffer]);
    });
}