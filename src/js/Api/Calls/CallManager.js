import {MTProto} from "../../MTProto/external";
import Bytes from "../../MTProto/utils/bytes";
import {bytesAsHex, bytesConcatBuffer} from "../../Utils/byte";
import {SHA1, SHA256} from "../../MTProto/crypto/sha";
import VBigInt from "../../MTProto/bigint/VBigInt";
import {convertToByteArray, createRandomBuffer, longToBytes} from "../../MTProto/utils/bin";
import AppEvents from "../EventBus/AppEvents";
import {ReactiveObject} from "../../V/Reactive/ReactiveObject";
import AppConfiguration from "../../Config/AppConfiguration";
import TELEGRAM_CRYPTO, {substr} from "../../MTProto/crypto/TELEGRAM_CRYPTO";
import OpusToPCM from 'opus-to-pcm';
import {PCMPlayer} from "../../Utils/PCMPlayer"
import PeersManager from "../Peers/Objects/PeersManager";
import UpdatesManager from "../Updates/UpdatesManager";
import {computeEmojiFingerprint} from "../../Ui/Utils/replaceEmoji";
import CallNetworker from "./CallNetworker";

class CallManager extends ReactiveObject {
    eventBus = AppEvents.Calls
    eventObjectName = "calls"
    currentPhoneCall = null
    crypto = null
    connections = null

    // TODO move elsewhere
    get dhConfig() {
        return MTProto.invokeMethod("messages.getDhConfig")
    }

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
            pFlags: {
                udp_p2p: false,
                udp_reflector: true
            },
            min_layer: 92,
            max_layer: 92
        }
    }

    phoneCallRequested(phoneCall) {
        const peer = Peers.get("user", phoneCall.admin_id)
        this.currentPhoneCall = phoneCall

        this.fire("incomingCall", {
            peer
        })

    }

    async phoneCallAccepted(phoneCall) {
        const authKey = Bytes.modPow(phoneCall.g_b, this.crypto.random, this.crypto.p)
        const fingerprint = SHA1(authKey)

        this.crypto.authKey = authKey

        const response = await MTProto.invokeMethod("phone.confirmCall", {
            peer:  this.inputPhoneCall,
            g_a: this.crypto.gA,
            key_fingerprint: fingerprint.slice(fingerprint.length - 8, fingerprint.length),
            protocol: this.phoneCallProtocol
        })

        this.handleUpdate(response)
    }

    phoneCallWaiting(phoneCall) {

    }

    phoneCallDiscarded(phoneCall) {
        this.fire("declinedCall", {})
        this.stopAudio()

        this.currentPhoneCall = null
        this.crypto = null
        if(this.networker) {
            this.networker.close()
            this.networker = null
        }
            // this.websockets.forEach(l => l.close(3000, "phoneCallDiscarded"))
            // this.initSent = false
    }

    phoneCall(phoneCall) {
        if(!this.crypto.authKey) {
            this.crypto.authKey = Bytes.modPow(phoneCall.g_a_or_b, this.crypto.random, this.crypto.p)
            this.crypto.gA = phoneCall.g_a_or_b
            this.crypto.isOutgoing = false
        } else {
            this.crypto.isOutgoing = true
        }
        const hash = SHA256(bytesConcatBuffer(new Uint8Array(this.crypto.authKey), new Uint8Array(this.crypto.gA)))
        const emojis = computeEmojiFingerprint(hash)

        this.fire("fingerprintCreated", {
            fingerprint: emojis
        })

        this.initAudio().then(_ => {
            // console.log("Sucess got audio!")
            this.openConnections(phoneCall.connections)
        }).catch(_ => this.hangUp())

        // const connection = phoneCall.connections[0]
        //
        // this.authKey = authKey
        // this.isOutgoing = false
        // this.openConnections(phoneCall.connections)
    }

    async startCall(peer) {
        const dhConfig = await this.dhConfig
        const gA = VBigInt.create(dhConfig.g).modPow(dhConfig.random, dhConfig.p).toByteArray()
        const response = await MTProto.invokeMethod("phone.requestCall", {
            g_a_hash: SHA256(gA),
            user_id: {
                _: "inputUser",
                user_id: peer.id,
                access_hash: peer.raw.access_hash
            },
            random_id: +new Date,
            protocol: this.phoneCallProtocol
        })
        this.currentPhoneCall = response.phone_call

        this.crypto = {
            gA: gA,
            g: dhConfig.g,
            random: dhConfig.random,
            p: dhConfig.p
        }
        this.fire("startedCall", {
            peer: peer
        })
        this.handleUpdate(response)
    }

    async acceptCall(peer) {
        const dhConfig = await this.dhConfig
        const g = dhConfig.g
        const p = dhConfig.p

        // TODO generate own random
        const b = dhConfig.random
        const gB = VBigInt.create(g).modPow(b, p)

        const response = await MTProto.invokeMethod("phone.acceptCall", {
            g_b: gB.toByteArray(),
            peer: this.inputPhoneCall,
            protocol: this.phoneCallProtocol
        })

        this.crypto = {
            gAHash: this.currentPhoneCall.g_a_hash,
            g: g,
            random: b,
            p: p
        }

        this.handleUpdate(response)
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
        if(this.audio) {
            return Promise.resolve()
        }
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus"
            })
            mediaRecorder.onstop = l => this.stop(l)
            mediaRecorder.ondataavailable = l => this.dataavailable(l)
            mediaRecorder.start(60)

            this.audio = {
                stream: stream,
                mediaRecorder: mediaRecorder
            }
        })
    }

    stopAudio() {
        if(!this.audio) {
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
        })
    }

    stop(ev) {
        console.log("stop", ev)
    }

    async dataavailable(ev) {
        if(!this.networker) return
        const data = new Uint8Array(await ev.data.arrayBuffer())
        // console.log(String.fromCharCode(...data))
        this.networker.sendStreamData(data)
            // bytesAsHex(convertToByteArray(arrayBuffer))
        // console.log("dataavaliable", ev)
    }

    onDecode(pcmData) {
        // console.log(this.decoder.getSampleRate())
        // this.PCMPlayer.feed(pcmData)
    }
}

export const CallsManager = new CallManager()