import MessageWrapperFragment from "./common/MessageWrapperFragment";
import TextWrapperComponent from "./common/TextWrapperComponent";
import {VideoComponent} from "../../basic/videoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class VideoMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperFragment message={this.message} noPad>
                <VideoComponent video={this.message.raw.media.document}/>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperFragment>
        )
    }
}

export default VideoMessageComponent