import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";
import Component from "../../../../../framework/vrdom/component";

class StickerMessageComponent extends Component {
    h() {
        const message = this.props.message
        let animated = message.media.document.mime_type === "application/x-tgsticker";
        let src = message.media.document.real ? message.media.document.real.url : "";
        let size = message.media.document.attributes.find(l => l._ === "documentAttributeImageSize")
        let height = size ? size.h / size.w * 250 : 250
        let sticker = src !== "" ? (animated ?
                <tgs-player className="sticker" autoplay loop mode="normal" src={src} css-width="250px" css-height={height + "px"}/>
        :
            <img className="sticker" src={src}/>) : <div className="sticker loading" css-width="250px" css-height={height + "px"}/>
        return (
            <MessageWrapperComponent message={message} transparent={true}>
                {sticker}
                <MessageTimeComponent message={message} bg={true}/>
            </MessageWrapperComponent>
        )
    }
}

export default StickerMessageComponent