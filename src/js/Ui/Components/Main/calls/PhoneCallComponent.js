import VComponent from "../../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../../Api/EventBus/AppEvents";
import type {AE} from "../../../../V/VRDOM/component/appEvents";
import AvatarFragment from "../basic/AvatarFragment";
import AvatarComponent from "../basic/AvatarComponent";
import {CallsManager} from "../../../../Api/Calls/CallManager";
import AudioManager from "../../../Fuck/audioManager";

export class PhoneCallComponent extends VComponent {
    init() {
        super.init();
        this.state = {
            hidden: true,
            peer: null
        }
    }

    render() {
        const classes = {"phone-call-wrapper": true, "hidden": this.state.hidden}
        return <div className={classes}>
            <div className="phone-call">
                {this.state.peer ? <AvatarComponent peer={this.state.peer || null}/> : ""}
                <div className="fingerprint">{this.state.fingerprint || ""}</div>
                <div className="name">{this.state.peer && this.state.peer.name}</div>
                <div className="call-status">ringing...</div>
                <div className="phone-call-button hang-up-button rp rps" onClick={this.hangUp}><i className="tgico tgico-phone"/></div>
                <div className="phone-call-button accept-button rp rps" onClick={this.acceptCall}><i className="tgico tgico-phone"/></div>
                <div className="phone-call-button microphone-button rp rps"><i className="tgico tgico-microphone"/>
                </div>
            </div>
        </div>
    }

    appEvents(E: AE) {
        E.bus(AppEvents.Calls)
            .on("incomingCall", this.incomingCall)
            .on("startedCall", this.startedCall)
            .on("declinedCall", this.declinedCall)
            .on("fingerprintCreated", this.fingerprintCreated)
    }

    incomingCall = event => {
        AudioManager.playNotification("call_incoming", true)
        const peer = event.peer
        this.setState({
            hidden: false,
            incoming: true,
            peer: peer
        })
    }

    startedCall = event => {
        AudioManager.playNotification("call_outgoing", true)
        const peer = event.peer
        this.setState({
            hidden: false,
            incoming: false,
            peer: peer
        })
    }

    declinedCall = event => {
        this.setState({
            hidden: true,
            peer: null,
            fingerprint: null
        })
    }

    hangUp = event => {
        AudioManager.playNotification("call_end")
        CallsManager.hangUp(this.state.peer)
    }

    acceptCall = event => {
        AudioManager.playNotification("call_connect")
        CallsManager.acceptCall(this.state.peer)
    }

    fingerprintCreated = event => {
        this.setState({fingerprint: event.fingerprint.join("")})
    }
}