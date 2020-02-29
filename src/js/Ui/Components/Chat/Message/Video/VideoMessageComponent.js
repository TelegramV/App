import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import VideoComponent from "./VideoComponent"

class VideoMessageComponent extends GeneralMessageComponent {

    render() {
        const text = (this.message.text.length > 0) ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <VideoComponent message={this.message}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

}

export default VideoMessageComponent;