import Component from "./v/vrdom/component";

export let PinManager

export class PinnedComponent extends Component {
    constructor(props) {
        super(props);

        PinManager = this;
    }

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
                <div className="pin pinned-message">
                    <div className="title">Pinned message</div>
                    <div className="description">See you tomorrow at 18:00 at the park</div>
                </div>
            )
        } else {
            return <div className="pin"/>;
        }
    }
}
