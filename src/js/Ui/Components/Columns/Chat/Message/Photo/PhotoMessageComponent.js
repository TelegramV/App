import MessageWrapperFragment from "../Common/MessageWrapperFragment"
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterPhotoComponent from "../../../../Basic/BetterPhotoComponent"

class PhotoMessageComponent extends GeneralMessageComponent {
    render() {
        const text = this.props.message.text.length > 0 ? <TextWrapperComponent message={this.props.message}/> : ""

        return (
            <MessageWrapperFragment message={this.props.message}
                                    showUsername={false}
                                    outerPad={text !== ""}
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <BetterPhotoComponent calculateSize={true}
                                      photo={this.props.message.raw.media.photo}
                                      maxWidth={this.props.message.text.length === 0 ? 480 : 470}
                                      maxHeight={512}
                                      onClick={this.openMediaViewer}/>

                {!text && <MessageTimeComponent message={this.props.message} bg={true}/>}

                {text}
            </MessageWrapperFragment>
        )
    }

    openMediaViewer = () => {
        UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})
    }
}

export default PhotoMessageComponent