import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import {formatAudioTime} from "../../../../Utils/utils"
import DocumentParser from "../../../../../Api/Files/DocumentParser"

/**
 * @param {number} progress
 * @param {SVGElement} $el
 */
function ProgressCircle({progress}) {
    const radius = 190 / 2;
    const circumference = 2 * Math.PI * radius;

    const style = {
        "stroke-dasharray": `${circumference} ${circumference}`,
        "stroke-dashoffset": circumference - progress / 103 * circumference,
    }

    return (
        <svg className="progress-ring">
            <circle style={style} className="progress-ring__circle"/>
        </svg>
    );
}

class RoundVideoMessageComponent extends GeneralMessageComponent {

    init() {
        this.muted = true;
    }

    state = {
        isMuted: true,
    }

    videoComponentRef: { component: BetterVideoComponent } = VComponent.createComponentRef();

    render({message}, {progress, isMuted}) {
        const document = message.raw.media.document;
        const video = DocumentParser.attributeVideo(document);

        return (
            <MessageWrapperFragment message={message}
                                    transparent={true}
                                    noPad
                                    showUsername={false}
                                    bubbleRef={this.bubbleRef}>

                <BetterVideoComponent isRound
                                      ref={this.videoComponentRef}
                                      document={document}
                                      round
                                      autoDownload
                                      autoPlay
                                      muted={isMuted}
                                      onClick={(event: MouseEvent) => {
                                          const $video = event.currentTarget.querySelector("video")

                                          if ($video.paused) {
                                              this.setState({
                                                  isMuted: false,
                                              });

                                              $video.volume = 1;
                                              $video.play();
                                          } else {
                                              $video.volume = isMuted ? 1 : 0;

                                              this.setState({
                                                  isMuted: !isMuted,
                                              });
                                          }
                                      }}
                                      onTimeUpdate={() => this.forceUpdate()}
                                      infoContainer={({currentTime}) => {
                                          return (
                                              <div className="round-overlay">
                                                  <ProgressCircle progress={currentTime / video.duration * 100}/>
                                              </div>
                                          )
                                      }}/>

                <div className="playback">
                    <span style={{
                        "display": !isMuted && "none"
                    }} className="pl-time tgico nosound"/>
                    {this.videoComponentRef.component?.state.currentTime && formatAudioTime(this.videoComponentRef.component?.state.currentTime)}
                </div>


                <MessageTimeComponent message={this.props.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }

    // reactive(R) {
    //     super.reactive(R)
    //
    //     R.object(this.props.message)
    //         .on("videoAppended", this.videoReady)
    // }

    // videoReady = () => {
    //     this.video = this.$el.querySelector("video");
    //     this.video.addEventListener("ended", this._onLoopEnd);
    //     this.video.addEventListener("timeupdate", this._onTimeUpdate);
    //
    //     this.progressRef.component.$el.classList.add("hidden");
    //
    //     this.playback = this.$el.querySelector(".playback");
    //     this.playbackTime = this.playback.querySelector(".pl-time");
    //     this.playbackTime.textContent = formatAudioTime(this.props.message.videoInfo.duration);
    // }
    //
    // _onTimeUpdate = (ev) => {
    //     if (!this.muted) {
    //         this.playbackTime.textContent = formatAudioTime(this.video.currentTime);
    //         this.progressRef.component.setProgress(this.video.currentTime / this.video.duration);
    //     }
    // }
    //
    // _onLoopEnd = (ev) => {
    //     this.video.volume = 0;
    //     this.setMuted(true)
    //     this.playbackTime.textContent = formatAudioTime(this.props.message.videoInfo.duration);
    //     this.toggleProgress(this.muted);
    //     this.video.play();
    // }
    //
    // play = () => {
    //     this.setMuted(false)
    //     this.video.pause();
    //     this.video.currentTime = 0;
    //     this.video.play().then(_ => {
    //         this.video.volume = 1;
    //     });
    // }
    //
    // mute = () => {
    //     this.setMuted(true)
    //     this.video.volume = 0;
    // }
    //
    // setMuted(val = true) {
    //     this.muted = val;
    //     this.playback.querySelector(".tgico").classList.toggle("nosound", this.muted);
    // }
    //
    // toggleProgress = (val) => {
    //     let el = this.progressRef.component.$el;
    //     el.classList.toggle("hidden", val);
    // }
    //
    // _click = (ev) => {
    //     this.toggleProgress(!this.muted);
    //     if (!this.muted) {
    //         this.mute();
    //     } else {
    //         this.play();
    //     }
    // }
}

export default RoundVideoMessageComponent