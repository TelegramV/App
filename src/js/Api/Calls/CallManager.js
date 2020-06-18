import MTProto from "../../MTProto/External";
import Bytes from "../../MTProto/Utils/Bytes";
import {bytesAsHex, bytesConcatBuffer} from "../../Utils/byte";
import AppEvents from "../EventBus/AppEvents";
import {ReactiveObject} from "../../V/Reactive/ReactiveObject";
import {PCMPlayer} from "../../Utils/PCMPlayer"
import UpdatesManager from "../Updates/UpdatesManager";
import CallNetworker from "./CallNetworker";
import Opus from "./Opus";
import PeersManager from "../Peers/PeersManager";
import FileManager from "../Files/FileManager";
import PeersStore from "../Store/PeersStore";
import keval from "../../Keval/keval";
import VUI from "../../Ui/VUI";
import Hint from "../../Ui/Components/SidebarsNeo/Fragments/Hint";
import VButton from "../../Ui/Elements/Button/VButton";
import {ModalHeaderFragment} from "../../Ui/Components/Modals/ModalHeaderFragment";

export const CallState = {
    CallStarted: -1,
    Ringing: 0,
    Busy: 1,
    FailedToConnect: 2,
    Waiting: 3,
    HangingUp: 4,
    IncomingCall: 5,
    Connecting: 6,
    Requesting: 7,
    ExchangingEncryption: 8,
    FailedToConnectToBridge: 9,
}

class CallManager extends ReactiveObject {
    eventBus = AppEvents.Calls
    eventObjectName = "calls"
    currentPhoneCall = null
    crypto = null
    connections = null
    opus = new Opus({})

    constructor(props) {
        super(props);
        // this.opus.init().then(l => {
        //     this.opus.printVersion()
        //     this.opus.createDecoder()
        //     this.opus.createEncoder()
        //
        // })
    }

    initOpus() {
        console.log(this.opus.initialized)
        if(this.opus.initialized) {
            return Promise.resolve()
        }
       return this.opus.init().then(l => {
            this.opus.printVersion()
            this.opus.createDecoder()
            this.opus.createEncoder()
        })
    }

    // TODO move elsewhere
    get dhConfig() {
        return MTProto.invokeMethod("messages.getDhConfig")
    }

    // roflan = []
    //
    // test() {
    //     navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
    //
    //         const audioContext = new AudioContext({
    //             sampleRate: 48000,
    //         })
    //
    //         const mediaRecorder = new MediaRecorder(stream, {
    //             mimeType: "audio/webm;codecs=opus"
    //         })
    //         mediaRecorder.onstop = l => this.stop(l)
    //         mediaRecorder.ondataavailable = async l => {
    //             const data = await l.data.arrayBuffer()
    //             this.roflan.push(data)
    //             console.log(data.byteLength)
    //             console.log( bytesAsHex(new Uint8Array(data)))
    //         }
    //         mediaRecorder.start(50)
    //         setTimeout(l=>{
    //             console.log(this.roflan)
    //
    //             FileManager.saveOnPc(this.roflan, "data.webm")
    //         }, 2000)
    //     })
    // }

    get inputPhoneCall() {
        return {
            _: "inputPhoneCall",
            id: this.currentPhoneCall.id,
            access_hash: this.currentPhoneCall.access_hash
        }
    }

    get phoneCallProtocol() {
        return {
            _: "phoneCallProtocol",
            udp_p2p: false,
            udp_reflector: true,
            min_layer: 92,
            max_layer: 92,
            library_versions: []
        }
    }

    phoneCallRequested(phoneCall) {
        console.log("requested", phoneCall)
        const peer = PeersStore.get("user", phoneCall.admin_id)
        this.currentPhoneCall = phoneCall

        this.fire("incomingCall", {
            peer
        })

    }

    async phoneCallAccepted(phoneCall) {
        console.log("phoneCallAccepted")

            this.fire("changeState", {
                state: CallState.ExchangingEncryption
            })


            const {authKey, fingerprint} = await MTProto.getAuthKey(phoneCall.g_b, this.crypto.random, this.crypto.p)
            // const authKey = Bytes.modPow(phoneCall.g_b, this.crypto.random, this.crypto.p)
            // const fingerprint = sha1(authKey)

            this.crypto.authKey = authKey

            const response = await MTProto.invokeMethod("phone.confirmCall", {
                peer: this.inputPhoneCall,
                g_a: this.crypto.gA,
                key_fingerprint: fingerprint.slice(fingerprint.length - 8, fingerprint.length),
                protocol: this.phoneCallProtocol
            })

            this.handleUpdate(response)
    }

    phoneCallWaiting(phoneCall) {
        console.log("phoneCallWaiting")

        // this.fire("changeState", {
        //     state: CallState.Waiting
        // })
    }

    phoneCallDiscarded(phoneCall) {
        console.log("phoneCallDiscarded")

        this.fire("declinedCall", {})
        this.stopAudio()

        this.currentPhoneCall = null
        this.crypto = null
        if (this.networker) {
            this.networker.close()
            this.networker = null
        }
        // this.websockets.forEach(l => l.close(3000, "phoneCallDiscarded"))
        // this.initSent = false
    }

    async phoneCall(phoneCall) {
        console.log("phoneCall")
        if (!this.crypto.authKey) {
            const {authKey, fingerprint} = await MTProto.getAuthKey(phoneCall.g_a_or_b, this.crypto.random, this.crypto.p)
            this.crypto.authKey = authKey
            this.crypto.gA = phoneCall.g_a_or_b
            this.crypto.isOutgoing = false
        } else {
            this.crypto.isOutgoing = true
        }
        // const hash = sha256(bytesConcatBuffer(new Uint8Array(this.crypto.authKey), new Uint8Array(this.crypto.gA)))
        const emojis = await MTProto.generateEmojiFingerprint(this.crypto.authKey, this.crypto.gA)

        this.fire("fingerprintCreated", {
            fingerprint: emojis
        })
        this.fire("changeState", {
            state: CallState.Connecting
        })

        console.log("wow, initializng audio")

        this.initAudio().then(_ => {
            console.log("Sucess got audio!")
            this.openConnections(phoneCall.connections)
        }).catch(_ => this.hangUp())

        // const connection = phoneCall.connections[0]
        //
        // this.authKey = authKey
        // this.isOutgoing = false
        // this.openConnections(phoneCall.connections)
    }

    async startCall(peer) {
        if(!await this.showWarning(_ => this.startCall(peer))) return

        console.log("startCall")
        await this.initOpus()
        this.crypto = await MTProto.startCall(await this.dhConfig)

        this.fire("startedCall", {
            peer: peer
        })

        console.log(this.crypto)
        console.log({
            g_a_hash: this.crypto.gAHash,
            user_id: {
                _: "inputUser",
                user_id: peer.id,
                access_hash: peer.raw.access_hash
            },
            random_id: +new Date,
            protocol: this.phoneCallProtocol
        })
        const response = await MTProto.invokeMethod("phone.requestCall", {
            g_a_hash: this.crypto.gAHash,
            user_id: {
                _: "inputUser",
                user_id: peer.id,
                access_hash: peer.raw.access_hash
            },
            random_id: +new Date,
            protocol: this.phoneCallProtocol
        })
        console.log("aoaoao")
        this.currentPhoneCall = response.phone_call


        this.fire("changeState", {
            state: CallState.Ringing
        })
        this.handleUpdate(response)

        // const dhConfig = await this.dhConfig
        // const gA = BigInteger(dhConfig.g).modPow(dhConfig.random, dhConfig.p).toArray()
        //
        // this.fire("startedCall", {
        //     peer: peer
        // })
        //
        // const response = await MTProto.invokeMethod("phone.requestCall", {
        //     g_a_hash: sha256(gA),
        //     user_id: {
        //         _: "inputUser",
        //         user_id: peer.id,
        //         access_hash: peer.raw.access_hash
        //     },
        //     random_id: +new Date,
        //     protocol: this.phoneCallProtocol
        // })
        //
        // this.crypto = {
        //     gA: gA,
        //     g: dhConfig.g,
        //     random: dhConfig.random,
        //     p: dhConfig.p
        // }
        // this.fire("changeState", {
        //     state: CallState.Ringing
        // })
        // this.handleUpdate(response)
    }

    async showWarning(action) {
        const phoneCallsWarningAccepted = await keval.getItem("phoneCallsWarning")
        if(!phoneCallsWarningAccepted) {
            const phoneCallsBridge = await keval.getItem("phoneCallsBridge")

            VUI.Modal.open(<div>
                <ModalHeaderFragment title="Warning!" close actionText="I'm cool with it" action={_ => {
                    keval.setItem("phoneCallsWarning", true)
                    action()
                    VUI.Modal.close()
                }}/>
                <div className="padded">

                Due to limitations of the web, all the data will be transferred through bridge {phoneCallsBridge}.<br/>
                Don't worry though, data is encrypted at the client side, so no one can see anything but random data.
                </div>
            </div>)
            return false
        }
        return true
    }

    async acceptCall(peer) {
        if(!await this.showWarning(_ => this.acceptCall(peer))) return
        console.log("acceptCall")
        this.initOpus().then(async _ => {


            this.fire("changeState", {
                state: CallState.ExchangingEncryption
            })

            const dhConfig = await this.dhConfig
            const crypto = await MTProto.startCall(dhConfig)

            const response = await MTProto.invokeMethod("phone.acceptCall", {
                g_b: crypto.gA,
                peer: this.inputPhoneCall,
                protocol: this.phoneCallProtocol
            })

            this.crypto = {
                gAHash: this.currentPhoneCall.g_a_hash,
                g: dhConfig.g,
                random: dhConfig.random,
                p: dhConfig.p
            }

            this.handleUpdate(response)
        })
    }

    async hangUp() {
        const response = await MTProto.invokeMethod("phone.discardCall", {
            peer: this.inputPhoneCall,
            duration: 30, // TODO return real duration
            reason: {
                _: "phoneCallDiscardReasonHangup" // phoneCallDiscardReasonMissed, phoneCallDiscardReasonDisconnect, phoneCallDiscardReasonBusy
            }
        })
        UpdatesManager.process(response)
    }

    initAudio() {
        if (this.audio) {
            return Promise.resolve()
        }
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

            /*const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus"
            })
            mediaRecorder.onstop = l => this.stop(l)
            mediaRecorder.ondataavailable = l => this.dataavailable(l)
            mediaRecorder.start(50)

            this.audio = {
                stream: stream,
                mediaRecorder: mediaRecorder,
                pcm: new PCMPlayer(1, 48000),
                opusDecoder: new OpusToPCM({
                    channels: 1
                })
            }
            this.audio.opusDecoder.on("decode", l => this.onDecode(l))*/
            this.audio = {
                stream: stream,
                audioContext,
                input,
                captureNode,
                started: false,
                pcm: new PCMPlayer(1, 48000),
                // opusDecoder: new OpusToPCM({
                //     channels: 1
                // })
            }
        })
    }

    stopAudio() {
        // console.log("stop", this.audioLoop)
        // clearInterval(this.audioLoop)

        if (!this.audio || !this.audio.mediaRecorder || !this.audio.stream) {
            return
        }
        this.audio.mediaRecorder.stop()
        this.audio.stream.getTracks().forEach(function (track) {
            track.stop()
        });
        this.audio = null
    }

    handleUpdate(update) {
        PeersManager.fillPeersFromUpdate(update)
        this[update.phone_call._](update.phone_call)
    }

    openConnections(connections) {
        this.networker = new CallNetworker(connections, this.crypto.authKey, this.crypto.isOutgoing)
        this.networker.start().then(l => {
            this.networker.init()
            this.callStartTime = +new Date()
            setTimeout(l => {
                this.audio.started = true
                // fetch("/static/test1.pcm").then(l => l.arrayBuffer()).then(l => {
                //     const data = new Uint8Array(l)
                //     let dataOffset = 0
                //     this.audioLoop = setInterval(_ => {
                //         const kk = 48000 * 60 / 1000
                //         const sizeof = 2
                //         const splitted = new Uint8Array(data.buffer.slice(dataOffset, Math.min(dataOffset + kk * sizeof, data.byteLength)))
                //         dataOffset += kk * sizeof
                //         if(dataOffset >= data.byteLength) {
                //             dataOffset = 0;
                //         }
                //
                //         const toSend = this.opus.encodeUint8(splitted)
                //         this.networker.sendStreamData(toSend)
                //
                //     }, 60)
                // })

                this.fire("changeState", {
                    state: CallState.CallStarted,
                    seconds: 0
                })
            }, 2000)
        }).catch(l => {
            this.fire("changeState", {
                state: CallState.FailedToConnectToBridge,
                seconds: 0
            })
            setTimeout(_ => {
                this.hangUp()
            }, 2000)
        })
    }

    stop(ev) {
        console.log("stop", ev)
    }


    buffer = new Uint8Array(5760)
    currentOffset = 0
    dataavailable = async (ev) => {
        if(!this.networker || !this.audio || !this.audio.started) return
        this.fire("changeState", {
            state: CallState.CallStarted,
            seconds: Math.floor((+new Date() - this.callStartTime)/1000)
        })
        const pcm = ev.inputBuffer.getChannelData(0)
        let data = new Int16Array(pcm.length)
        for(let i = 0; i < pcm.length; i++) {
            data[i] = pcm[i] * 256 * 256 / 2
        }
        data = new Uint8Array(data.buffer)
        const oldOffset = this.currentOffset
        this.currentOffset += data.length
        if(this.currentOffset >= this.buffer.length) {

            this.currentOffset -= this.buffer.length
            this.buffer.set(new Uint8Array(data.buffer, 0, this.buffer.length - oldOffset), oldOffset)
            this.networker.sendStreamData(this.opus.encodeUint8(new Uint8Array(this.buffer)))
            this.buffer.fill(0, 0, this.buffer.length)

            this.buffer.set(new Uint8Array(data.buffer, this.buffer.length - oldOffset, data.length - (this.buffer.length - oldOffset)), 0)
            this.currentOffset = data.length - (this.buffer.length - oldOffset)

            return
        }
        this.buffer.set(data, oldOffset)
    }

    decodeOpus(opusData) {
        // console.log("opusData", new Float32Array(this.opus.decode(opusData).buffer))
        this.audio.pcm.feed(new Float32Array(this.opus.decode(opusData).buffer))
    }
}

export const CallsManager = new CallManager()