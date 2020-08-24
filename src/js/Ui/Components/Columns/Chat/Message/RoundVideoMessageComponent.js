import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent";
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"
import { formatTime } from "../../../../../Utils/date"
import DocumentParser from "../../../../../Api/Files/DocumentParser"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

const ProgressLoaderFragment = ({ progress = 0, radius = 0, hidden=false, strokeWidth=4}) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    const classes = {
      "progress-ring": true,
      hidden
    }

    return (
        <svg className={classes}>
                <circle
                css-stroke-dashoffset={offset}
                css-stroke-dasharray={`${circumference} ${circumference}`}
                css-stroke-width={`${strokeWidth}px`}
                cx={radius} cy={radius} r={radius-strokeWidth}/>
            </svg>
    )
}

class RoundVideoMessageComponent extends GeneralMessageComponent {

    init() {
        this.muted = true;
    }

    state = {
        ...super.state,
        isMuted: true,
    }

    videoComponentRef: { component: BetterVideoComponent } = StatelessComponent.createComponentRef();

    render({ message, showDate }, { progress, isMuted }) {
        const document = message.raw.media.document;
        const video = DocumentParser.attributeVideo(document);

        return (
            <MessageWrapperFragment message={message}
                                    transparent={true}
                                    noPad
                                    showUsername={false}
                                    bubbleRef={this.bubbleRef}
                                    showDate={showDate}>

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
                                      onEnded={() => {this.setState({isMuted: true})}}
                                      infoContainer={({currentTime}) => {
                                          return (
                                              <div className="round-overlay">
                                                  <ProgressLoaderFragment radius={95} 
                                                                          progress={currentTime / video.duration} 
                                                                          hidden={this.state.isMuted}
                                                  />
                                              </div>
                                          )
                                      }}/>

                <div className="playback">
                    <span style={{
                        "display": !isMuted && "none"
                    }} className="pl-time tgico nosound"/>
                    {this.videoComponentRef.component?.state.currentTime && formatTime(this.videoComponentRef.component?.state.currentTime)}
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