import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import VideoComponent from "./VideoComponent"
import UIEvents from "../../../../../EventBus/UIEvents";

class VideoMessageComponent extends GeneralMessageComponent {

    render() {
        const text = (this.props.message.text.length > 0) ? <TextWrapperComponent message={this.props.message}/> : ""
        return (
            <MessageWrapperFragment message={this.props.message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <VideoComponent message={this.props.message} controls={false} loop={true}
                                click={() => UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})}/>
                {!text ? <MessageTimeComponent message={this.props.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

}

export default VideoMessageComponent;