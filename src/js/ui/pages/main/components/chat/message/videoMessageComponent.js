import MessageWrapperComponent from "./messageWrapperComponent";
import TextWrapperComponent from "./textWrapperComponent";
import {VideoComponent} from "../../basic/videoComponent";

const VideoMessageComponent = ({message}) => {
    return (
        <MessageWrapperComponent message={message} noPad>
            <VideoComponent video={message.media.document}/>
            <TextWrapperComponent message={message}/>
        </MessageWrapperComponent>
    )
}
export default VideoMessageComponent