import MessageWrapperFragment from "../common/MessageWrapperFragment"
import TextWrapperComponent from "../common/TextWrapperComponent";
import MessageTimeComponent from "../common/MessageTimeComponent";
import GeneralMessageComponent from "../common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../../../api/messages/objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"
import {VComponent} from "../../../../../../v/vrdom/component/VComponent"

const MessagePhotoFigureFragment = ({message, clickLoader}) => {
    return (
        <PhotoFigureFragment id={`msg-photo-figure-${message.id}`}
                             srcUrl={message.srcUrl}
                             thumbnail={message.thumbnail}
                             width={message.maxWidth}
                             height={message.maxHeight}
                             maxWidth={message.text.length === 0 ? 480 : 470}
                             maxHeight={512}
                             loading={message.loading}
                             loaded={message.loaded}
                             clickLoader={clickLoader}/>
    )
}

class PhotoMessageComponent extends GeneralMessageComponent {

    message: PhotoMessage

    photoFigureRef = VComponent.createFragmentRef()

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("photoLoaded", this.onPhotoLoaded)
    }

    h() {
        const text = (this.message.text.length > 0) ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""} avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <MessagePhotoFigureFragment ref={this.photoFigureRef}
                                            message={this.message}
                                            clickLoader={this.toggleLoading}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }


    onPhotoLoaded = event => {
        this.patchFigure()
    }

    patchFigure = () => {
        this.photoFigureRef.patch({
            message: this.message,
            clickLoader: this.toggleLoading
        })
    }

    toggleLoading = () => {
        if (this.message.loading) {
            this.message.loading = false
            this.message.interrupted = true
        } else {
            this.message.fetchMax()
        }

        this.patchFigure()
    }

    destroy() {
        super.destroy()
        this.photoFigureRef.$el = null
        this.photoFigureRef.fragment = null
    }
}

export default PhotoMessageComponent