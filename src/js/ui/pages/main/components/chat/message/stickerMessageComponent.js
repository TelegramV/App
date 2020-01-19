import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";

const StickerMessageComponent = ({ message }) => {
    let animated = message.media.document.mime_type == "application/x-tgsticker";
    let src = message.media.document.real ? message.media.document.real.url : "";
    let sticker = animated ? <tgs-player class="sticker" autoplay loop src={src}/> : <img class="sticker" src={src}/>
    return (
        <MessageWrapperComponent message={message} transparent={true}>
            {sticker}
            <MessageTimeComponent message={message} bg={true}/>
        </MessageWrapperComponent>
    )
}

export default StickerMessageComponent