// /*
//  * Telegram V
//  * Copyright (C) 2020 original authors
//  *
//  * This program is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
//  *
//  */
//
// import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
// import Recorder from "../../../Utils/Recorder/Recorder"
//
// class Voicerecorder extends StatefulComponent {
//     render() {
//         return (
//             <div>
//                 <h1>Wave Recorder example</h1>
//                 <p>Before you enable monitoring, make sure to either plug in headphones or turn the volume down.</p>
//
//                 <h2>Options</h2>
//
//                 <div>
//                     <label>monitorGain</label>
//                     <input id="monitorGain" type="number" value="0"/>
//                 </div>
//
//                 <div>
//                     <label>recordingGain</label>
//                     <input id="recordingGain" type="number" value="1"/>
//                 </div>
//
//                 <div>
//                     <label>numberOfChannels</label>
//                     <input id="numberOfChannels" type="number" value="1"/>
//                 </div>
//
//                 <div>
//                     <label>bitDepth</label>
//                     <input id="bitDepth" type="number" value="16"/>
//                 </div>
//
//                 <div>
//                     <button id="init">init recorder with options</button>
//                 </div>
//
//                 <h2>Recorder Commands</h2>
//                 <button id="start" disabled>start</button>
//                 <button id="pause" disabled>pause</button>
//                 <button id="resume" disabled>resume</button>
//                 <button id="stopButton" disabled>stop</button>
//
//                 <h2>Recordings</h2>
//                 <ul id="recordingslist"></ul>
//
//                 <h2>Log</h2>
//                 <pre id="log"></pre>
//             </div>
//         )
//     }
//
//     componentDidMount() {
//
//         function screenLogger(text, data) {
//             log.innerHTML += "\n" + text + " " + (data || '');
//         }
//
//         const init = document.getElementById("init")
//         const start = document.getElementById("start")
//         const monitorGain = document.getElementById("monitorGain")
//         const recordingGain = document.getElementById("recordingGain")
//         const numberOfChannels = document.getElementById("numberOfChannels")
//         const bitDepth = document.getElementById("bitDepth")
//         const pause = document.getElementById("pause")
//         const resume = document.getElementById("resume")
//         const stopButton = document.getElementById("stopButton")
//
//         if (!Recorder.isRecordingSupported()) {
//             screenLogger("Recording features are not supported in your browser.");
//         } else {
//             init.addEventListener("click", function () {
//                 init.disabled = true;
//                 start.disabled = false;
//                 monitorGain.disabled = true;
//                 recordingGain.disabled = true;
//                 numberOfChannels.disabled = true;
//                 bitDepth.disabled = true;
//
//                 var recorder = new Recorder({
//                     monitorGain: parseInt(monitorGain.value, 10),
//                     recordingGain: parseInt(recordingGain.value, 10),
//                     numberOfChannels: parseInt(numberOfChannels.value, 10),
//                     wavBitDepth: parseInt(bitDepth.value, 10),
//                     encoderPath: "../dist/waveWorker.min.js"
//                 });
//
//                 pause.addEventListener("click", function () {
//                     recorder.pause();
//                 });
//                 resume.addEventListener("click", function () {
//                     recorder.resume();
//                 });
//                 stopButton.addEventListener("click", function () {
//                     recorder.stop();
//                 });
//                 start.addEventListener("click", function () {
//                     recorder.start().catch(function (e) {
//                         screenLogger('Error encountered:', e.message);
//                     });
//                 });
//
//                 recorder.onstart = function () {
//                     screenLogger('Recorder is started');
//                     start.disabled = resume.disabled = true;
//                     pause.disabled = stopButton.disabled = false;
//                 };
//
//                 recorder.onstop = function () {
//                     screenLogger('Recorder is stopped');
//                     start.disabled = false;
//                     pause.disabled = resume.disabled = stopButton.disabled = true;
//                 };
//
//                 recorder.onpause = function () {
//                     screenLogger('Recorder is paused');
//                     pause.disabled = start.disabled = true;
//                     resume.disabled = stopButton.disabled = false;
//                 };
//
//                 recorder.onresume = function () {
//                     screenLogger('Recorder is resuming');
//                     start.disabled = resume.disabled = true;
//                     pause.disabled = stopButton.disabled = false;
//                 };
//
//                 recorder.onstreamerror = function (e) {
//                     screenLogger('Error encountered: ' + e.message);
//                 };
//
//                 recorder.ondataavailable = function (typedArray) {
//                     var dataBlob = new Blob([typedArray], {type: 'audio/wav'});
//                     var fileName = new Date().toISOString() + ".wav";
//                     var url = URL.createObjectURL(dataBlob);
//
//                     var audio = document.createElement('audio');
//                     audio.controls = true;
//                     audio.src = url;
//
//                     var link = document.createElement('a');
//                     link.href = url;
//                     link.download = fileName;
//                     link.innerHTML = link.download;
//
//                     var li = document.createElement('li');
//                     li.appendChild(link);
//                     li.appendChild(audio);
//
//                     recordingslist.appendChild(li);
//                 };
//             });
//         }
//     }
// }
//
// class Decoder extends StatefulComponent {
//     render() {
//         return (
//             <div>
//                 <h1>Decoder Example</h1>
//                 <p>Choose either a file from disk, or a file from a server.</p>
//                 <p>File is decoded to pcm buffers and then played back as Riff</p>
//
//                 <h2>Options</h2>
//
//                 <div>
//                     <label>Decoder output sample rate</label>
//                     <input id="sampleRate" type="number" value="8000"/>
//                 </div>
//
//                 <div>
//                     <label>Wave file bit depth</label>
//                     <input id="bitDepth" type="number" value="16"/>
//                 </div>
//
//                 <h2>Commands</h2>
//                 <input type="file" id="fileInput"/>
//                 <button type="button" id="remoteButton">Load using XMLHttpRequest</button>
//
//                 <h2>Recordings</h2>
//                 <ul id="recordingslist"></ul>
//             </div>
//         )
//     }
//
//     componentDidMount() {
//         const sampleRate = document.getElementById("sampleRate")
//         const bitDepth = document.getElementById("bitDepth")
//         const fileInput = document.getElementById("fileInput")
//         const remoteButton = document.getElementById("remoteButton")
//         const recordingslist = document.getElementById("recordingslist")
//
//         function decodeOgg(arrayBuffer) {
//
//             var typedArray = new Uint8Array(arrayBuffer);
//             var decoderWorker = new Worker('/decoderWorker.min.js');
//             var wavWorker = new Worker('/waveWorker.min.js');
//             var desiredSampleRate = parseInt(sampleRate.value, 10);
//
//             decoderWorker.postMessage({
//                 command: 'init',
//                 decoderSampleRate: desiredSampleRate,
//                 outputBufferSampleRate: desiredSampleRate
//             });
//
//             wavWorker.postMessage({
//                 command: 'init',
//                 wavBitDepth: parseInt(bitDepth.value, 10),
//                 wavSampleRate: desiredSampleRate
//             });
//
//             decoderWorker.onmessage = function (e) {
//
//                 // null means decoder is finished
//                 if (e.data === null) {
//                     wavWorker.postMessage({command: 'done'});
//                 }
//
//                 // e.data contains decoded buffers as float32 values
//                 else {
//                     wavWorker.postMessage({
//                         command: 'encode',
//                         buffers: e.data
//                     }, e.data.map(function (typedArray) {
//                         return typedArray.buffer;
//                     }));
//                 }
//             };
//
//             wavWorker.onmessage = function (e) {
//
//                 if (e.data.message === "page") {
//                     var fileName = new Date().toISOString() + ".wav";
//                     var dataBlob = new Blob([e.data.page], {type: "audio/wav"});
//                     var url = URL.createObjectURL(dataBlob);
//
//                     var audio = document.createElement('audio');
//                     audio.controls = true;
//                     audio.src = URL.createObjectURL(dataBlob);
//
//                     var link = document.createElement('a');
//                     link.href = url;
//                     link.download = fileName;
//                     link.innerHTML = link.download;
//
//                     var li = document.createElement('li');
//                     li.appendChild(link);
//                     li.appendChild(audio);
//
//                     recordingslist.appendChild(li);
//                 }
//             };
//
//             decoderWorker.postMessage({
//                 command: 'decode',
//                 pages: typedArray
//             }, [typedArray.buffer]);
//         };
//
//         fileInput.onchange = function (e) {
//             var fileReader = new FileReader();
//
//             fileReader.onload = function () {
//                 decodeOgg(this.result);
//             };
//
//             fileReader.readAsArrayBuffer(e.target.files[0]);
//         };
//     }
// }
//
// function voicefuck() {
//     return (
//         <div>
//             {/*<Voicerecorder/>*/}
//             <Decoder/>
//         </div>
//     )
// }
//
// export default voicefuck;