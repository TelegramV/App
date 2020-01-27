import MessageWrapperComponent from "./common/MessageWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {StickerMessage} from "../../../../../../api/messages/objects/StickerMessage"

// this is needed to make direct patches without patching full component
const StickerFragment = ({id, url, w, h}) => {
    if (url === "") {
        return <div id={id}
                    className="sticker loading"
                    css-width={`${w}px`}
                    css-height={`${h}px`}/>
    } else {
        return <img id={id}
                    className="sticker"
                    src={url} css-width={`${w}px`}
                    css-height={`${h}px`} alt="Sticker"/>
    }
}

class StickerMessageComponent extends GeneralMessageComponent {

    message: StickerMessage
    $sticker: Element

    width: 250
    height: 250

    h() {
        this.calculateSize()

        return (
            <MessageWrapperComponent message={this.message} transparent={true} noPad>

                <StickerFragment id={`sticker-${this.message.id}`}
                                 url={this.message.srcUrl}
                                 w={this.width}
                                 h={this.height}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperComponent>
        )
    }

    mounted() {
        this.$sticker = this.$el.querySelector(`#sticker-${this.message.id}`)
    }

    calculateSize() {
        this.width = 250
        this.height = this.message.h ? this.message.h / this.message.w * this.width : 250
    }

    patchSticker() {
        VRDOM.patch(this.$sticker, <StickerFragment id={`#sticker-${this.message.id}`}
                                                    url={this.message.srcUrl}
                                                    w={this.width}
                                                    h={this.height}/>)
    }

    reactiveChanged(key: *, value: *, event: *) {
        super.reactiveChanged(key, value, event)

        if (event.type === "stickerLoaded") {
            this.patchSticker()
        }
    }
}

export default StickerMessageComponent