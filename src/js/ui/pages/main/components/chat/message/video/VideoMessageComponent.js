import MessageWrapperFragment from "../common/MessageWrapperFragment";
import TextWrapperComponent from "../common/TextWrapperComponent";
import MessageTimeComponent from "../common/MessageTimeComponent";
import GeneralMessageComponent from "../common/GeneralMessageComponent"
import {VComponent} from "../../../../../../v/vrdom/component/VComponent"
import {VideoFigureFragment, VideoPreviewFragment} from "./VideoFigureFragment"

const MessageVideoFigureFragment = ({message, clickLoader, autoplay= false, loop=false}) => {
    if(message.videoUrl) {
        return (
            <VideoFigureFragment id={`msg-video-figure-${message.id}`}
                                 srcUrl={message.videoUrl}
                                 width={message.videoInfo.w}
                                 height={message.videoInfo.h}
                                 maxHeight={526}
                                 maxWidth={480}
                                 loop={loop == false ? undefined : true}
                                 autoplay={autoplay}
                                 />
        )
    } else {
        return (
            <VideoPreviewFragment id={`msg-video-figure-${message.id}`}
                                     thumbSrc={message.thumbnail ? message.thumbnail : message.smallThumb}
                                     width={message.videoInfo.w}
                                     height={message.videoInfo.h}
                                     maxHeight={526}
                                     maxWidth={480}
                                     clickLoader={clickLoader}
                                     loading={message.loading}
                                     loaded={message.loaded}
                                    />
            )
    }
}

class VideoMessageComponent extends GeneralMessageComponent {

    init() {
        super.init();
        this.videoFigureRef = VComponent.createFragmentRef()
    }

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("videoDownloaded", this.onVideoDownloaded)
            .on("thumbDownloaded", this.onThumbnailDownloaded)
    }

    h() {
        const text = (this.message.text.length > 0) ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""} avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <MessageVideoFigureFragment ref={this.videoFigureRef}
                                            message={this.message}
                                            clickLoader={this.toggleLoading}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
            )
    }

    onVideoDownloaded = event => {
        console.log("Downloaded!")
        this.patchFigure()
    }

    onThumbnailDownloaded = event => {
        this.patchFigure();
    }

    patchFigure = () => {
        this.videoFigureRef.patch({
            message: this.message,
            clickLoader: this.toggleLoading
        })
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

        this.patchFigure()
    }

    destroy() {
        super.destroy()
        this.videoFigureRef.$el = null
        this.videoFigureRef.fragment = null
    }
}

export default VideoMessageComponent