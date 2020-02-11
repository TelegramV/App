import Component from "./v/vrdom/Component";
import AppEvents from "../api/eventBus/AppEvents";
import UIEvents from "./eventBus/UIEvents";
import {MessageParser} from "../api/messages/MessageParser";
import {VComponent} from "./v/vrdom/component/VComponent";
import AppSelectedPeer from "./reactive/SelectedPeer";

export class PinnedComponent extends VComponent {
    pinAudio(audio) {
        this.audio = audio;
        this.updatePin();
    }

    pinVoice(voice) {
        this.voice = voice;
        this.updatePin();
    }

    pinMessage(message) {
        this.message = message;
        this.updatePin();
    }

    unpinMedia() {
        this.audio = null;
        this.voice = null;
        this.updatePin();
    }

    getDisplayedPin() {
        if (this.audio || this.voice) {
            return this.audio || this.voice;
        } else return this.message;
    }

    updatePin() {
        this.__patch();
    }

    h() {
        if (this.audio || this.voice) {
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
        } else if(this.message) {
            return (
                <div className="pin pinned-message" onClick={l => UIEvents.Bubbles.fire("showMessage", this.message)}>
                    <div className="title">Pinned message</div>
                    <div className="description">{MessageParser.getPrefixNoSender(this.message)}</div>
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
        if (key === "peer") {
            this.message = value._pinnedMessage
            this.updatePin()
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("pinnedMessageFound", this.onPinnedMessageFound)
    }

    onPinnedMessageFound = event => {
        this.pinMessage(event.message)
    }
}
