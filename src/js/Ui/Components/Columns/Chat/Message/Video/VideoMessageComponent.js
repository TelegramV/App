import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import MessageWrapperFragment from "../Common/MessageWrapperFragment";
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterVideoComponent from "../../../../Basic/BetterVideoComponent"

class VideoMessageComponent extends GeneralMessageComponent {

    render() {
        const text = (this.props.message.text.length > 0) ? <TextWrapperComponent message={this.props.message}/> : ""
        return (
            <MessageWrapperFragment message={this.props.message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>

                <BetterVideoComponent document={this.props.message.raw.media.document}
                                      onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})}
                                      playOnHover/>

                {!text ? <MessageTimeComponent message={this.props.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

}

export default VideoMessageComponent;