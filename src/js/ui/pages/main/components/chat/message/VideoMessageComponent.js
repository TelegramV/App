import MessageWrapperComponent from "./common/MessageWrapperComponent";
import TextWrapperComponent from "./common/TextWrapperComponent";
import {VideoComponent} from "../../basic/videoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class VideoMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperComponent message={this.message} noPad>
                <VideoComponent video={this.message.raw.media.document}/>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }
}

export default VideoMessageComponent