import MessageWrapperFragment from "../Common/MessageWrapperFragment"
import TextWrapperComponent from "../Common/TextWrapperComponent";
import MessageTimeComponent from "../Common/MessageTimeComponent";
import GeneralMessageComponent from "../Common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../Api/Messages/Objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import VUI from "../../../../VUI"

const MessagePhotoFigureFragment = ({message, clickLoader, click}) => {
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
                             clickLoader={clickLoader}
                             click={click}/>
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

    render() {
        const text = (this.message.text.length > 0) ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <MessagePhotoFigureFragment ref={this.photoFigureRef}
                                            message={this.message}
                                            clickLoader={this.toggleLoading} click={this.openMediaViewer}/>
                {!text ? <MessageTimeComponent message={this.message} bg={true}/> : ""}
                {text}
            </MessageWrapperFragment>
        )
    }

    openMediaViewer = event => {
        VUI.MediaViewer.open(this.message)
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

    toggleLoading = (ev) => {
        ev.stopPropagation()
        if (this.message.loading) {
            this.message.loading = false
            this.message.interrupted = true
        } else {
            this.message.fetchMax()
        }

        this.patchFigure()
    }

    componentWillUnmount() {
        this.photoFigureRef.$el = null
        this.photoFigureRef.fragment = null
    }
}

export default PhotoMessageComponent