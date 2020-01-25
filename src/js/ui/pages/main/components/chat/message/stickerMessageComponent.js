import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";
import Component from "../../../../../framework/vrdom/component";
import {MessageType} from "../../../../../../api/dataObjects/messages/Message";

class StickerMessageComponent extends Component {
    h() {
        const message = this.props.message
        let animated = message.media.document.mime_type === "application/x-tgsticker";
        let src = message.media.document.real ? message.media.document.real.url : "";
        let size = message.media.document.attributes.find(l => l._ === "documentAttributeImageSize")
        const s = this.props.message.type === MessageType.ANIMATED_EMOJI ? 150 : 250
        let height = size ? size.h / size.w * s : s
        let sticker = src !== "" ? (animated ?
                <tgs-player className={["sticker", this.props.message.type === MessageType.ANIMATED_EMOJI ? "emoji" : ""]} autoplay loop mode="normal" src={src} css-width={s + "px"} css-height={height + "px"}/>
        :
            <img className="sticker" src={src} css-width={s + "px"} css-height={height + "px"}/>) : <div className="sticker loading" css-width={s + "px"} css-height={height + "px"}/>
        return (
            <MessageWrapperComponent message={message} transparent={true}>
                {sticker}
                <MessageTimeComponent message={message} bg={true}/>
            </MessageWrapperComponent>
        )
    }
}

export default StickerMessageComponent