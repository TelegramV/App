import { parseMessageEntities } from "../../../../mtproto/utils/htmlHelpers";
import { FileAPI } from "../../../../api/fileAPI"

const Message = ({ message }) => {
    if (!message.type) {
        return <div>Unsupported message type</div>
    }

    const handlers = {
        text: TextMessageComponent,
        // photo: idk, is it exist?
        // round: vMessageWithRoundVideoTemplate,
        // video: vMessageWithVideoTemplate,
        // audio: vMessageWithAudioTemplate,
        // voice: vMessageWithVoiceAudioTemplate,
        // sticker: vMessageWithStickerTemplate,
        // document: TextMessage,
        // url: vMessageWithUrlTemplate,
        // service: vServiceMessageTemplate
    }

    const Handler = handlers[message.type]

    if (Handler) {
        return <Handler message={message}/>
    } else {
        return <div>No handler!</div>
    }
}

const TextMessageComponent = ({ message }) => {
    let classes = {
        "bubble": true,
        "read": message.isRead
    }

    const username = message.from.name && !message.isPost && !message.isOut
    let text = parseMessageEntities(message.text, message.entities)

    return (
        <MessageWrapperComponent message={message}>
                <div className={classes}>
                    {username ? <div className="username">{message.from.name}</div> : ""}

                    <div className={`message ${username ? "nopad" : ""}`}>
                    	{message.media ? <MessageMediaComponent message={message}/> : ""} {/*Text can be before media (links), there's need to move text position inside it*/}
                        {!!text ? <span dangerouslySetInnerHTML={text}/> : ""}
                        <MessageTimeComponent message={message}/>
                    </div>
                </div>
            </MessageWrapperComponent>
    )
}

const MessageMediaComponent = ({ message }) => {
    if (!message.media) return "";

    if (message.media.photo) {
        if (message.media.photo.real) { //re-render of image, when it's ready
            let image = message.media.photo.real;
            return (<MessageMediaImage src={image.src} size={image.sizes} isThumb={!!image.thumbnail}/>);
        }
        return (<MessageMediaImage src="" size={message.media.photo.sizes} isThumb={undefined}/>); //placeholder
    }
    return ""; //TODO add more media types
}

const MessageMediaImage = ({ src, size, alt = "", isThumb }) => {
    let width = isThumb ? parseInt(size[0]) >= 460 ? "460px" : `${size[0]}px` : parseInt(size[0]) >= 480 ? "480px" : `${size[0]}px`
    return (
        <img className={["attachment", isThumb ? "attachment-thumb" : ""]}
             css-width={width}
             src={src}
             alt={alt}/>
    )
}

const MessageTimeComponent = ({ message, bg = false }) => {
    let classes = "time" + (bg ? " bg" : "");

    let views = "";
    if (message.raw.views) {
        views = (
            <span class="views">
        		{numberFormat(message.raw.views)}
                <span class="tgico tgico-channelviews"/> 
            </span>
        )
    }

    let edited = message.raw.edit_date ? (<span class="edited">edited</span>) : "";

    return (
        <span class={classes}>
        		{views}
        		<div class="inner tgico">
        			{edited}
                    {message.getDate('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </div>
            </span>
    )
}

const MessageWrapperComponent = ({ message, slot }) => {
    const className = {
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    const from = message.from

    let hasAvatar = !from.photo.isEmpty

    const classes = "avatar" + (!hasAvatar ? ` placeholder-${from.photo.letter.num}` : "")
    const letter = hasAvatar ? "" : from.photo.letter.text

    const cssBackgroundImage = hasAvatar ? `url(${from.photo.smallUrl})` : "none"

    return (
        <div class={className} data-id={message.id} data-peer={`${from.type}.${from.id}`}>
            {!message.isPost && className.in ? (
                <div className={classes}
                     css-background-image={cssBackgroundImage}>
                    {letter}
                </div>
            ) : ""}
            {slot}
        </div>
    )

}

function numberFormat(num) {
    let digits = 1;
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export default Message;