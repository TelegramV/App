import MessageWrapperFragment from "../common/MessageWrapperFragment"
import TextWrapperComponent from "../common/TextWrapperComponent";
import GeneralMessageComponent from "../common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../../../api/messages/objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"

const MessagePhotoFigureFragment = ({message, clickLoader}) => {
    return (
        <PhotoFigureFragment id={`msg-photo-figure-${message.id}`}
                             srcUrl={message.srcUrl}
                             thumbnail={message.thumbnail}
                             width={message.width}
                             height={message.height}
                             loading={message.loading}
                             loaded={message.loaded}
                             clickLoader={clickLoader}/>
    )
}

class PhotoMessageComponent extends GeneralMessageComponent {

    message: PhotoMessage

    $figure: Element

    h() {
        const text = this.message.text.length > 0 ? <TextWrapperComponent message={this.message}/> : ""
        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} outerPad={text !== ""}>
                <MessagePhotoFigureFragment message={this.message}
                                            clickLoader={this.toggleLoading}/>

               {text}
            </MessageWrapperFragment>
        )
    }

    mounted() {
        super.mounted()
        this.$figure = this.$el.querySelector(`#msg-photo-figure-${this.message.id}`)
    }

    reactiveChanged(key: *, value: *, event: *) {
        super.reactiveChanged(key, value, event)

        if (event.type === "photoLoaded") {
            this.patchFigure()
        }
    }

    patchFigure() {
        VRDOM.patch(this.$figure, <MessagePhotoFigureFragment message={this.message}
                                                              clickLoader={this.toggleLoading}/>)
    }

    toggleLoading() {
        if (this.message.loading) {
            this.message.loading = false
            this.message.interrupted = true
        } else {
            this.message.fetchMax()
        }

        this.patchFigure()
    }
}

export default PhotoMessageComponent