import MessageComponent from "./messageComponent"
import MessageTimeComponent from "./messageTimeComponent"

const MessageMediaImage = ({src, size, alt = "", isThumb}) => {
    let width = isThumb ? parseInt(size[0]) >= 460 ? "460px" : `${size[0]}px` : parseInt(size[0]) >= 480 ? "480px" : `${size[0]}px`
    return (
        <img className={["attachment", isThumb ? "attachment-thumb" : ""]}
             css-width={width}
             src={src}
             alt={alt}/>
    )
}

const ImageMessageComponent = {
    name: "image-only-message",

    /**
     * @param {Message} message
     * @param image
     * @return {*}
     */
    h({message, image = false}) {
        let classes = "bubble"

        if (message.isRead) {
            classes += " read"
        }

        let haveMsg = message.text.length > 0

        if (image) {
            return (
                <MessageComponent message={message}>
                    <div class={classes}>
                        {haveMsg ? (
                            <div class="message">
                                <MessageMediaImage src={image.imgSrc} size={image.imgSize} isThumb={!!image.thumbnail}/>
                                <span dangerouslySetInnerHTML={message.text}/>
                                <MessageTimeComponent message={message}/>
                            </div>
                        ) : ""}
                    </div>
                </MessageComponent>
            )
        }

        return (
            <MessageComponent message={message}>
                <div class={classes}>
                    {haveMsg ? (
                        <div class="message">
                            <img src="" class="attachment"/>
                            <span dangerouslySetInnerHTML={message.text}/>
                            <MessageTimeComponent message={message}/>
                        </div>
                    ) : ""}
                </div>
            </MessageComponent>
        )
    }
}

export default ImageMessageComponent