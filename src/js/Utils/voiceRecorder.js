import encoderPath from 'file-loader!opus-recorder/dist/encoderWorker.min';

const MIN_RECORDING_TIME = 1000;
const RECORDER_OPTIONS = {reuseWorker: true, encoderPath};
const BLOB_PARAMETERS = {type: 'audio/ogg'};

let opusRecorderPromise;
let OpusRecorder;

async function fetchOpusRecorder() {
    if (!opusRecorderPromise) {
        opusRecorderPromise = import('opus-recorder');
        OpusRecorder = (await opusRecorderPromise).default;
    }

    return opusRecorderPromise;
}

/**
	@returns {blob, duration, waveform}
*/
export async function start(analyzerCallback: Function) {
    const chunks = [];
    const waveform = [];
    let startedAt = Date.now();

    const { stream, release: releaseStream } = await requestStream();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    const releaseAnalyzer = subscribeToAnalyzer(audioCtx, source, (volume) => {
        waveform.push((volume - 128) * 2);
        analyzerCallback(volume);
    });

    async function releaseAll() {
        releaseAnalyzer();
        await audioCtx.close();
        releaseStream();
    }

    let mediaRecorder;
    try {
        mediaRecorder = await startMediaRecorder(source);
        startedAt = Date.now();
    } catch (err) {
        await releaseAll();

        throw err;
    }

    mediaRecorder.ondataavailable = (typedArray) => {
        chunks.push(typedArray);
    };

    return () => new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
            resolve({
                blob: new Blob(chunks, BLOB_PARAMETERS),
                duration: Math.floor((Date.now() - startedAt) / 1000),
                waveform,
            });
        };
        mediaRecorder.onerror = reject;

        const delayStop = Math.max(0, startedAt + MIN_RECORDING_TIME - Date.now());
        setTimeout(
            async () => {
                    mediaRecorder.stop();

                    await releaseAll();
                },
                delayStop,
        );
    });
}

async function requestStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const release = () => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    };

    return { stream, release };
}

async function startMediaRecorder(source: MediaStreamAudioSourceNode) {
    await fetchOpusRecorder();

    const mediaRecorder = new OpusRecorder(RECORDER_OPTIONS);
    await mediaRecorder.start(source);
    return mediaRecorder;
}

function subscribeToAnalyzer(audioCtx: AudioContext, source: MediaStreamAudioSourceNode, cb: Function) {
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);

    let isDestroyed = false;

    function tick() {
        if (isDestroyed) {
            return;
        }

        analyser.getByteTimeDomainData(dataArray);
        cb(Math.max(...dataArray));
        requestAnimationFrame(tick);
    }

    tick();

    return () => {
        isDestroyed = true;
    };
}