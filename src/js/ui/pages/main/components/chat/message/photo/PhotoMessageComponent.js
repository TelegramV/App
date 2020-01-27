import MessageWrapperComponent from "../common/MessageWrapperComponent"
import TextWrapperComponent from "../common/TextWrapperComponent";
import GeneralMessageComponent from "../common/GeneralMessageComponent"
import {PhotoMessage} from "../../../../../../../api/messages/objects/PhotoMessage"
import {PhotoFigureFragment} from "./PhotoFigureFragment"

class PhotoMessageComponent extends GeneralMessageComponent {

    message: PhotoMessage

    $figure: Element

    h() {
        return (
            <MessageWrapperComponent message={this.message} noPad>
                <PhotoFigureFragment message={this.message} clickLoader={this.toggleLoading}/>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }

    mounted() {
        this.$figure = this.$el.querySelector(`#msg-photo-figure-${this.message.id}`)
    }

    reactiveChanged(key: *, value: *, event: *) {
        super.reactiveChanged(key, value, event)

        if (event.type === "photoLoaded") {
            this.patchFigure()
        }
    }

    patchFigure() {
        VRDOM.patch(this.$figure, <PhotoFigureFragment message={this.message}/>)
    }

    toggleLoading() {
        if (this.message.loading) {
            this.message.loading = false
        } else {
            this.message.fetchMax()
        }

        this.patchFigure()
    }
}

export default PhotoMessageComponent