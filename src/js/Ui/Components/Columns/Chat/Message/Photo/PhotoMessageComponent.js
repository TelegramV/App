import MessageWrapperFragment from "../Common/MessageWrapperFragment"
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../../Api/Messages/Objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"
import UIEvents from "../../../../../EventBus/UIEvents";
import BetterPhotoComponent from "../../../../Basic/BetterPhotoComponent"

const MessagePhotoFigureFragment = ({message, clickLoader, click, progress = 0.0, pending, downloaded}) => {
    return (
        <PhotoFigureFragment srcUrl={message.srcUrl}
                             thumbnail={message.thumbnail}
                             width={message.maxWidth}
                             height={message.maxHeight}
                             maxWidth={message.text.length === 0 ? 480 : 470}
                             maxHeight={512}
                             loading={pending}
                             loaded={downloaded}
                             progress={progress}
                             clickLoader={clickLoader}
                             click={click}/>
    )
}

class PhotoMessageComponent extends GeneralMessageComponent {
    message: PhotoMessage

    render() {
        const text = this.message.text.length > 0 ? <TextWrapperComponent message={this.message}/> : ""

        return (
            <MessageWrapperFragment message={this.message}
                                    showUsername={false}
                                    outerPad={text !== ""}
                                    avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>

                <BetterPhotoComponent photo={this.message.raw.media.photo}
                                      maxWidth={this.message.text.length === 0 ? 480 : 470}
                                      maxHeight={512}
                                      onClick={this.openMediaViewer}/>

                {!text && <MessageTimeComponent message={this.message} bg={true}/>}

                {text}
            </MessageWrapperFragment>
        )
    }

    openMediaViewer = () => {
        UIEvents.MediaViewer.fire("showMessage", {message: this.message})
    }
}

export default PhotoMessageComponent