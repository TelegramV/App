/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import AppEvents from "../../../Api/EventBus/AppEvents";
import type {AE} from "../../../V/VRDOM/component/__component_registerAppEvents";
import AvatarComponent from "../Basic/AvatarComponent";
import {CallsManager, CallState} from "../../../Api/Calls/CallManager";
import AudioManager from "../../Managers/AudioManager";
import {formatAudioTime} from "../../Utils/utils";
import SingletonComponent from "../../../V/VRDOM/component/SingletonComponent"

export class PhoneCallComponent extends SingletonComponent {
    init() {
        super.init();
        this.state = {
            hidden: true,
            peer: null,
            acceptedCall: false,
            callState: CallState.Waiting
        }
    }

    render() {
        const classes = {"phone-call-wrapper": true, "hidden": this.state.hidden}
        const classesInner = {"phone-call": true, "accepted-call": this.state.acceptedCall}
        return <div className={classes}>
            <div className={classesInner}>
                {this.state.peer ? <AvatarComponent peer={this.state.peer || null}/> : ""}
                <div className={{
                    fingerprint: true,
                    shown: !!this.state.fingerprint
                }}>{this.state.fingerprint || ""}</div>
                <div className="name">{this.state.peer && this.state.peer.name}</div>
                <div className="call-status">{this.callState}</div>
                <div className="phone-call-button hang-up-button rp rps" onClick={this.hangUp}><i
                    className="tgico tgico-phone"/></div>
                <div className="phone-call-button accept-button rp rps" onClick={this.acceptCall}><i
                    className="tgico tgico-phone"/></div>
                <div className="phone-call-button microphone-button rp rps" onClick={this.mute}><i
                    className="tgico tgico-microphone"/>
                </div>
            </div>
        </div>
    }

    get callState() {
        // console.log("get state", this.state.callState)
        switch (this.state.callState) {
            case CallState.Ringing:
                return "ringing..."
            case CallState.Busy:
                return "line busy"
            case CallState.Connecting:
                return "connecting..."
            case CallState.Waiting:
                return "waiting..."
            case CallState.FailedToConnect:
                return "failed to connect"
            case CallState.HangingUp:
                return "hanging up..."
            case CallState.ExchangingEncryption:
                return "exchanging encryption keys..."
            case CallState.IncomingCall:
                return "is calling you"
            case CallState.Requesting:
                return "requesting..."
            default:
                return formatAudioTime(this.state.seconds)
        }
    }

    appEvents(E: AE) {
        E.bus(AppEvents.Calls)
            .on("incomingCall", this.incomingCall)
            .on("startedCall", this.startedCall)
            .on("declinedCall", this.declinedCall)
            .on("fingerprintCreated", this.fingerprintCreated)
            .on("changeState", this.changeState)
    }

    incomingCall = event => {
        AudioManager.playNotification("call_incoming", true)
        const peer = event.peer
        this.setState({
            hidden: false,
            incoming: true,
            peer: peer,
            acceptedCall: false,
            fingerprint: null,
            callState: CallState.IncomingCall
        })
    }

    startedCall = event => {
        AudioManager.playNotification("call_outgoing", true)
        const peer = event.peer
        this.setState({
            hidden: false,
            incoming: false,
            peer: peer,
            acceptedCall: true,
            fingerprint: null,
            callState: CallState.Requesting
        })
    }

    declinedCall = event => {
        this.setState({
            hidden: true,
            // peer: null,
            // fingerprint: null
        })
    }

    changeState = event => {
        this.setState({
            callState: event.state,
            seconds: event.seconds
        })
    }

    hangUp = event => {
        AudioManager.playNotification("call_end")
        CallsManager.hangUp(this.state.peer)
        this.setState({
            callState: CallState.HangingUp
        })
    }

    acceptCall = event => {
        AudioManager.playNotification("call_connect")
        CallsManager.acceptCall(this.state.peer)
        this.setState({
            acceptedCall: true
        })
    }

    mute = event => {
        this.setState({
            muted: !this.state.muted
        })
    }

    fingerprintCreated = event => {
        this.setState({fingerprint: event.fingerprint.join("")})
    }
}