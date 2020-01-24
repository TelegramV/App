import MessageWrapperComponent from "./messageWrapperComponent";
import TextWrapperComponent from "./textWrapperComponent";
import {VideoComponent} from "../../basic/videoComponent";

const VideoMessageComponent = ({message}) => {
    let videoSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message}>
            <div class="message no-pad">
                <VideoComponent video={message.media.document}/>
                {/*<div class="media-wrapper">*/}
                {/*    <video controls src={videoSrc} type={message.media.document.mime_type}/>*/}
                {/*</div>*/}
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
    )
}
export default VideoMessageComponent