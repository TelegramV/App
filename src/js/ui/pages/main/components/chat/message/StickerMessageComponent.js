import MessageWrapperComponent from "./common/MessageWrapperComponent";
import MessageTimeComponent from "./common/MessageTimeComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {MessageType} from "../../../../../../api/messages/Message"

class StickerMessageComponent extends GeneralMessageComponent {
    h() {
        const message = this.props.message
        let animated = message.raw.media.document.mime_type === "application/x-tgsticker";
        let src = message.raw.media.document.real ? message.raw.media.document.real.url : "";
        let size = message.raw.media.document.attributes.find(l => l._ === "documentAttributeImageSize")
        const s = this.props.message.type === MessageType.ANIMATED_EMOJI ? 150 : 250
        let height = size ? size.h / size.w * s : s
        let sticker = src !== "" ? (animated ?
            <tgs-player className={["sticker", this.props.message.type === MessageType.ANIMATED_EMOJI ? "emoji" : ""]}
                        autoplay loop mode="normal" src={src} css-width={s + "px"} css-height={height + "px"}/>
            :
            <img className="sticker" src={src} css-width={s + "px"} css-height={height + "px"}/>) :
            <div className="sticker loading" css-width={s + "px"} css-height={height + "px"}/>
        return (
            <MessageWrapperComponent message={message} transparent={true} noPad>
                {sticker}
                <MessageTimeComponent message={message} bg={true}/>
            </MessageWrapperComponent>
        )
    }
}

export default StickerMessageComponent