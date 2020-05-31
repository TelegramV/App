import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import VUI from "../../../../VUI"
/*import {StickerMessage} from "../../../../../../api/messages/objects/StickerMessage"
import VRDOM from "../../../../../v/vrdom/VRDOM"*/

// this is needed to make direct patches without patching full component
/*const StickerFragment = ({id, url, w, h}) => {
    if (url === "") {
        return <div id={id}
                    classNames="sticker loading"
                    css-width={`${w}px`}
                    css-height={`${h}px`}/>
    } else {
        return <img id={id}
                    classNames="sticker"
                    src={url} css-width={`${w}px`}
                    css-height={`${h}px`}
                    alt="Sticker"/>
    }
}

class StickerMessageComponent extends GeneralMessageComponent {

    message: StickerMessage
    $sticker: Element

    width: 250
    height: 250

    render() {
        this.calculateSize()

        return (
            <MessageWrapperFragment message={this.props.message} transparent={true} noPad showUsername={false}>

                <StickerFragment id={`sticker-${this.props.message.id}`}
                                 url={this.props.message.srcUrl}
                                 w={this.width}
                                 h={this.height}/>

                <MessageTimeComponent message={this.props.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    mounted() {
        super.mounted()
        this.$sticker = this.$el.querySelector(`#sticker-${this.props.message.id}`)
    }

    calculateSize() {
        this.width = 250
        this.height = this.props.message.h ? this.props.message.h / this.props.message.w * this.width : 250
    }

    patchSticker() {
        VRDOM.patch(this.$sticker, <StickerFragment id={`sticker-${this.props.message.id}`}
                                                    url={this.props.message.srcUrl}
                                                    w={this.width}
                                                    h={this.height}/>)
    }

    reactiveChanged(key: *, value: *, event: *) {
        super.reactiveChanged(key, value, event)

        if (event.type === "stickerLoaded") {
            this.patchSticker()
        }
    }
}*/

class StickerMessageComponent extends GeneralMessageComponent {
    render() {
        return (
            <MessageWrapperFragment message={this.props.message} transparent={true} noPad showUsername={false}
                                    avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>

                <BetterStickerComponent isFull width={200} document={this.props.message.raw.media.document} onClick={() => {
                    VUI.Modal.open(<div>TODO: implement me!</div>)
                }}/>

                <MessageTimeComponent message={this.props.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }
}

export default StickerMessageComponent