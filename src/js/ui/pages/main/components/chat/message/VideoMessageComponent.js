import MessageWrapperFragment from "./common/MessageWrapperFragment";
import TextWrapperComponent from "./common/TextWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent";
import {VideoComponent} from "../../basic/videoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class VideoMessageComponent extends GeneralMessageComponent {

    h() {
        const text = this.message.text.length > 0 ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""}  bubbleRef={this.bubbleRef}>
                <VideoComponent video={this.message.raw.media.document}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }
}

export default VideoMessageComponent