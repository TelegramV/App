import AppEvents from "../api/eventBus/AppEvents";
import UIEvents from "./eventBus/UIEvents";
import {MessageParser} from "../api/messages/MessageParser";
import {VComponent} from "./v/vrdom/component/VComponent";
import AppSelectedPeer from "./reactive/SelectedPeer";

export class PinnedComponent extends VComponent {

    state = {
        audio: undefined,
        voice: undefined,
        message: undefined,
    }

    pinAudio(audio) {
        this.state.audio = audio;
    }

    pinVoice(voice) {
        this.state.voice = voice;
    }

    pinMessage(message) {
        this.state.message = message;
    }

    unpinMedia() {
        this.state.audio = null;
        this.state.voice = null;
    }

    getDisplayedPin() {
        if (this.audio || this.voice) {
            return this.audio || this.voice;
        } else return this.message;
    }

    h() {
        if (this.state.audio || this.state.voice) {
            return (
                <div className="pin active-audio">
                    <div className="play">
                        <i class="tgico tgico-play"/>
                    </div>
                    <div className="audio-info">
                        <div className="title">Title</div>
                        <div className="description">Musician</div>
                    </div>
                </div>
            )
        } else if (this.state.message) {
            return (
                <div className="pin pinned-message" onClick={l => UIEvents.Bubbles.fire("showMessage", this.state.message)}>
                    <div className="title">Pinned message</div>
                    <div className="description">{MessageParser.getPrefixNoSender(this.state.message)}</div>
                </div>
            )
        } else {
            return <div className="pin"/>;
        }
    }

    init() {
        this.callbacks = {
            peer: AppSelectedPeer.Reactive.FireOnly
        }
    }

    callbackChanged(key: string, value) {
        if (key === "peer" && value) {
            this.state.message = value._pinnedMessage
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("pinnedMessageFound", this.onPinnedMessageFound)
    }

    onPinnedMessageFound = event => {
        if (event.message && AppSelectedPeer.check(event.message.to)) {
            this.state.message = event.message
        } else {
            this.state.message = undefined
        }
    }
}
