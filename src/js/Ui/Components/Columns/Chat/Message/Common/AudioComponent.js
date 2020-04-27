import MessageWrapperFragment from "./MessageWrapperFragment"
import TextWrapperComponent from "./TextWrapperComponent";
import GeneralMessageComponent from "./GeneralMessageComponent"
import { FileAPI } from "../../../../../../Api/Files/FileAPI"
import { formatAudioTime } from "../../../../../Utils/utils"
import AudioManager from "../../../../../Managers/AudioManager"

class AudioComponent extends GeneralMessageComponent {
    /*
        General component for voice and audio messages

        audio can be obtained from downloadAndPlay

        Required for child components:
        getControls()
        async getMeta()
        setTimerElement(el)
        setProgressElement(el)

        Events:
        controlsMounted()

        You can access other functions to handle your events
    */
    constructor(props) {
        super(props);
        this.message = this.props.message;

        let attrs = this.message.raw.media.document.attributes;
        this.duration = 0;
        for (const attr of attrs) {
            if (attr._ == "documentAttributeAudio") {
                this.duration = attr.duration
            }
        }

        this.playing = false;
    }

    render() {
        return (
            <MessageWrapperFragment message={this.message} showUsername={false} bubbleRef={this.bubbleRef}>
                <div class="audio">
                    <progress class="progress-circular"/>
                    <div class="play tgico tgico-play rp rps rp-white" onMouseDown={this._playButtonClick.bind(this)}/>
                    <div class="audio-wrapper">
                        {this.getControls()}
                    </div>
                </div>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }

    componentDidMount() {
        this.loadProgress = this.$el.querySelector(".progress-circular");
        this.playButton = this.$el.querySelector(".play");
        this.controlsMounted();
    }

    controlsMounted() {
        //override me
    }

    /*Don't forget to super to this method!*/
    componentWillUnmount() {
        this.progressEl.removeEventListener("mousemove", this._handleMove.bind(this));
        if (this.audio) {
            this.audio.removeEventListener("timeupdate", this._audioTimeUpdate.bind(this));
            this.audio.removeEventListener("ended", this._playButtonClick.bind(this));
        }
    }

    async play() {
        this._setButtonIcon("pause")
        if (!this.audio) {
            return this.downloadAndPlay();
        } else {
            this.playing = true;
            return this.audio.play();
        }
    }

    pause() {
        this._setButtonIcon("play")
        this.audio.pause();
        this.playing = false;
    }

    async download() {
        if (this.isLoading()) return;
        this.setLoading(true);
        this._setButtonIcon("close");
        return FileAPI.getFile(this.message.raw.media.document).then(url => {
            this.audio = new Audio(url);
            this.audio.addEventListener("timeupdate", this._audioTimeUpdate.bind(this));
            this.audio.addEventListener("ended", this._playButtonClick.bind(this));
            this.setLoading(false);
            this._onDownload();
            this._setButtonIcon("play");
            return this.audio;
        })
    }

    downloadAndPlay() {
        this.download().then(q => {
            AudioManager.set(this);
            AudioManager.play();
        })
    }

    setLoading(val) {
        this.loading = !!val;
        if (this.loading) {
            this.loadProgress.classList.add("visible")
        } else {
            this.loadProgress.classList.remove("visible")
        }
    }

    isLoading() {
        return this.loading;
    }

    isPlaying() {
        return this.playing;
    }

    async getMeta() {
        return {};
    }

    setTimerElement(elem) {
        this.timer = elem;
    }

    setProgressElement(elem) {
        this.progressEl = elem;
    }

    updatePercent(percent) {
        //nothing, override me
    }

    _onDownload() {
        //override
    }

    _setButtonIcon(icon) {
        let classes = this.playButton.classList;
        classes.remove("tgico-pause");
        classes.remove("tgico-play");
        classes.remove("tgico-close");

        classes.add("tgico-" + icon);
    }

    _audioTimeUpdate() {
        this.timer.textContent = formatAudioTime(this.audio.currentTime);
        this.updatePercent(this.audio.currentTime / this.audio.duration);
    }

    _handleEnter(e) {
        this.progressEl.addEventListener("mousemove", this._handleMove.bind(this));
    }

    _handleLeave(e) {
        this.progressEl.removeEventListener("mousemove", this._handleMove.bind(this));
    }

    _handleMove(e) {
        if (!this.audio) return;
        if (e.buttons === undefined ?
            e.which === 1 :
            e.buttons === 1) {
            let box = this.progressEl.getBoundingClientRect();
            let percent = (e.pageX - box.x) / box.width;
            this.updatePercent(percent);
            this.audio.currentTime = this.audio.duration * percent;
        }
    }

    _playButtonClick(e) {
        if (this.loading) return; //add cancel
        if (!this.audio) {
            this.download().then(audio => {
                AudioManager.set(this);
                AudioManager.play()
            });
        } else {
            AudioManager.set(this);
            if (this.playing) {
                AudioManager.pause();
            } else {
                AudioManager.play();
            }
        }
    }

}

export default AudioComponent