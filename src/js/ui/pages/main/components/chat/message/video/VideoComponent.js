import { VComponent } from "../../../../../../v/vrdom/component/VComponent"
import { VideoFigureFragment, VideoPreviewFragment } from "./VideoFigureFragment"

export const MessageVideoFigureFragment = ({ message, clickLoader, autoplay = false, loop = false, controls = true }) => {

}

class VideoComponent extends VComponent {

    init() {
        this.message = this.props.message;
        if (this.props.autodownload) {
            this.message.fetchFullVideo()
        }

        this.figureRef = undefined;
    }

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("videoDownloaded", this.onVideoDownloaded)
            .on("thumbDownloaded", this.onThumbnailDownloaded)
    }

    h() {
        if (this.message.videoUrl) {
            return (
                <VideoFigureFragment id={`msg-video-figure-${this.message.id}`}
                                 ref={this.figureRef}
                                 type={this.props.type || "video"}
                                 round={this.props.round}
                                 srcUrl={this.message.videoUrl}
                                 width={this.message.videoInfo.w}
                                 height={this.message.videoInfo.h}
                                 maxHeight={526}
                                 maxWidth={480}
                                 loop={this.props.loop}
                                 autoplay={this.props.autoplay}
                                 controls={this.props.controls}
                                 muted={this.props.muted}
                                 click={this.props.click}
                                 />
            )
        } else {
            return (
                <VideoPreviewFragment id={`msg-video-figure-${this.message.id}`}
                                     ref={this.figureRef}
                                     type={this.props.type || "video"}
                                     round={this.props.round}
                                     thumbSrc={this.message.thumbnail ? this.message.thumbnail : this.message.smallThumb}
                                     width={this.message.videoInfo.w}
                                     height={this.message.videoInfo.h}
                                     maxHeight={526}
                                     maxWidth={480}
                                     clickLoader={this.toggleLoading}
                                     loading={this.message.loading}
                                     loaded={this.message.loaded}
                                    />
            )
        }
    }

    onVideoDownloaded = event => {
        this.__patch();
        this.message.fire("videoAppended")
    }

    onThumbnailDownloaded = event => {
        this.__patch();
    }

    toggleLoading = () => {
        if (this.message.loading) {
            this.message.loading = false
            this.message.interrupted = true
        } else {
            this.message.loading = true
            this.message.interrupted = false
            this.message.fetchFullVideo()
        }

        this.__patch();
    }
}

export default VideoComponent