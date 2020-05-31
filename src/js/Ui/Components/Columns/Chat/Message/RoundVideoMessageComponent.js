import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import VideoComponent from "./Video/VideoComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import ProgressLoaderComponent from "../../../Loading/ProgressLoaderComponent"
import {formatAudioTime} from "../../../../Utils/utils"
import VComponent from "../../../../../V/VRDOM/component/VComponent"

class RoundVideoMessageComponent extends GeneralMessageComponent {

    init() {
        super.init();
        this.videoRef = VComponent.createComponentRef();
        this.progressRef = VComponent.createComponentRef();

        this.muted = true;
    }

    render() {
        return (
            <MessageWrapperFragment message={this.props.message} transparent={true} noPad showUsername={false}
                                    bubbleRef={this.bubbleRef}>
                <VideoComponent ref={this.videoRef} message={this.props.message} controls={false} round autodownload autoplay
                                muted={this.muted}>
                    <div class="round-overlay" onClick={this._click}>
                        <ProgressLoaderComponent ref={this.progressRef}/>
                    </div>
                </VideoComponent>
                <div class="playback"><span class="pl-time tgico nosound"></span></div>
                <MessageTimeComponent message={this.props.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }

    reactive(R) {
        super.reactive(R)

        R.object(this.props.message)
            .on("videoAppended", this.videoReady)
    }

    videoReady = () => {
        this.video = this.$el.querySelector("video");
        this.video.addEventListener("ended", this._onLoopEnd);
        this.video.addEventListener("timeupdate", this._onTimeUpdate);

        this.progressRef.component.$el.classList.add("hidden");

        this.playback = this.$el.querySelector(".playback");
        this.playbackTime = this.playback.querySelector(".pl-time");
        this.playbackTime.textContent = formatAudioTime(this.props.message.videoInfo.duration);
    }

    _onTimeUpdate = (ev) => {
        if (!this.muted) {
            this.playbackTime.textContent = formatAudioTime(this.video.currentTime);
            this.progressRef.component.setProgress(this.video.currentTime / this.video.duration);
        }
    }

    _onLoopEnd = (ev) => {
        this.video.volume = 0;
        this.setMuted(true)
        this.playbackTime.textContent = formatAudioTime(this.props.message.videoInfo.duration);
        this.toggleProgress(this.muted);
        this.video.play();
    }

    play = () => {
        this.setMuted(false)
        this.video.pause();
        this.video.currentTime = 0;
        this.video.play().then(_ => {
            this.video.volume = 1;
        });
    }

    mute = () => {
        this.setMuted(true)
        this.video.volume = 0;
    }

    setMuted(val = true) {
        this.muted = val;
        this.playback.querySelector(".tgico").classList.toggle("nosound", this.muted);
    }

    toggleProgress = (val) => {
        let el = this.progressRef.component.$el;
        el.classList.toggle("hidden", val);
    }

    _click = (ev) => {
        this.toggleProgress(!this.muted);
        if (!this.muted) {
            this.mute();
        } else {
            this.play();
        }
    }
}

export default RoundVideoMessageComponent