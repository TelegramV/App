import { parseMessageEntities } from "../../../../mtproto/utils/htmlHelpers";
import { FileAPI } from "../../../../api/fileAPI"
import {LocaleController} from "../../../../common/locale/localization"

const Message = ({ message }) => {
    /*if (!message.type) {
        return <div>Unsupported message type</div>
    }*/

    const handlers = {
        text: TextMessageComponent,
        photo: PhotoMessageComponent,
        round: RoundVideoMessageComponent,
        video: VideoMessageComponent,
        audio: AudioMessageComponent,
        // voice: vMessageWithVoiceAudioTemplate,
        sticker: StickerMessageComponent,
        // document: TextMessage,
        //location:
        //beacon:
        //game:
        //poll:
        //invoice:
        //contact:
        webpage: WebpageMessageComponent,
        service: ServiceMessageComponent
    }

    const Handler = handlers[message.type]

    if (Handler) {
        return <Handler message={message}/>
    } else {
        message._message.message = "Unsupported message type!"
        return (
            <TextMessageComponent message={message}/>
        )
    }
}

const ServiceMessageComponent = ({message}) => {
    return (
        <div className="service">
            <div className="service-msg">Service Message [{message.action._}]</div>
        </div>
        )
}

const AudioMessageComponent = ({message}) => {
    let audioSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message}>
            <div class="message">
                <audio constrols>
                    <source src={audioSrc} type={message.media.document.mime_type}/>
                </audio>
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
        )
}

const VideoMessageComponent = ({message}) => {
    let videoSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message}>
        <div class="message no-pad">
                <div class="media-wrapper">
                    <video controls src={videoSrc} type={message.media.document.mime_type}/>
                </div>
                <TextWrapperComponent message={message}/>
                </div>
        </MessageWrapperComponent>
        )
}

const RoundVideoMessageComponent = ({message}) => {
    let videoSrc = message.media.document.real ? message.media.document.real.url : "";
    return (
        <MessageWrapperComponent message={message} transparent={true}>
                <div class="round-video-wrapper">
                    <video controls src={videoSrc} type={message.media.document.mime_type}/>
                </div>
                <MessageTimeComponent message={message} bg={true}/>
        </MessageWrapperComponent>
        )
}

const IVMessageComponent = ({ message }) => {
    //one day...
}

const WebpageMessageComponent = ({ message }) => {
    let webpage = message.media.webpage;
    let photoUrl = "";
    if(webpage.photo && webpage.photo.real) {
        photoUrl = webpage.photo.real.url;
    }
    return (
        <MessageWrapperComponent message={message}>
            <div className="message">
                <TextWrapperComponent message={message}>
                <a href={webpage.url} target="_blank" className="box web rp">
                    <div className="quote">
                        {photoUrl?<img className="preview" src={photoUrl}/>: ""}
                        {webpage.site_name?<div className="name">{webpage.site_name}</div>:""}
                        {webpage.title?<div className="title">{webpage.title}</div>: ""}
                        {webpage.description?<div className="text">{webpage.description}</div>: ""}
                    </div>
                </a>
                </TextWrapperComponent>
            </div>
        </MessageWrapperComponent>
    )
}

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

const PhotoMessageComponent = ({ message }) => {
    let imageLoaded = message.media.photo.real;

    return (
        <MessageWrapperComponent message={message}>
            <div className="message no-pad">
                {imageLoaded ?
                    <MessageMediaImage src={imageLoaded.src} isThumb={!!imageLoaded.thumbnail}/>
                    :
                    <MessageMediaImage src="" isThumb={undefined}/>
                }
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
    )
}

const TextMessageComponent = ({ message }) => {
    const username = message.from.name && !message.isPost && !message.isOut;
    return (
        <MessageWrapperComponent message={message}>
            {username ? <div className="username">{message.from.name}</div> : ""}
            <div className="message">
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
    )
}

const TextWrapperComponent = ({ message, slot}) => {
    let text = parseMessageEntities(message.text, message.entities);
    if (!text) return "";
    return (
        <div class="text-wrapper">
            {text}
            {slot}
            <MessageTimeComponent message={message}/>
        </div>
    )
}

const MessageMediaImage = ({ src, alt = "", isThumb }) => {
    return (
        <div class="media-wrapper">
            <img className={["attachment", isThumb ? "attachment-thumb" : ""]}
             src={src}
             alt={alt}/>
        </div>
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
                <div class="inner status tgico">
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

const MessageWrapperComponent = ({ message, transparent = false, slot }) => {
    const className = {
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    let wrapClasses = {
        "bubble": true,
        "transparent": transparent,
        "read": message.isRead,
        "sent": !message.isRead //TODO more convenient method to do this
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
            <div className={wrapClasses}>
                {slot}
            </div>
        </div>
    )
}

function isBigMedia(message) {
    if (!message.media) return false;
    let media = message.media;
    if (media.photo) return true;
    return false;
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