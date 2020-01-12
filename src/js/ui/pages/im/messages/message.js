import { MTProto } from "../../../../mtproto"
import Voice from "../../../voice"
import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers";
import {emoji} from "../../../utils";
import MessageComponent from "../components/message/messageComponent"
import TextMessageComponent from "../components/message/textMessageComponent"


function vTimeTemplate(message, bg = false) {
    let classes = "time" + (bg ? " bg" : "")

    return (
        <span class={classes}>
            <div class="inner tgico">{message.views ?
                <span>{message.views} <span
                    class="tgico tgico-channelviews"/>    </span> : ""}{message.getDate('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })}</div>
        </span>
    )
}

function vGetClass(data, transparent = false) {
    let classes = "bubble"
    if (data.read) classes += " read"
    if (transparent) classes += " transparent"
    return classes
}

function vServiceMessageTemplate(data, inside) {
    return (
        <div className="service">
            <div className="service-msg">{data.message}</div>
        </div>
    )
}

// TODO add to every message type
function vForwardedTemplate(data) {
    return data.fwd ? <div class="fwd">Forwarded from {data.fwd.from}</div> : "";
}


const MessageMediaImage = ({src, size, alt = "", isThumb}) => {
    let width = isThumb ? Number(size[0]) >= 460 ? "460px" : `${size[0]}px` : Number(size[0]) >= 480 ? "480px" : `${size[0]}px`
    return (
        <div>
            <img className={["attachment", isThumb ? "attachment-thumb" : ""]}
                 css-width={width}
                 src={src}
                 alt={alt}/>
        </div>
    )
}

function vMessageWithImageTemplate(data) {
    let haveMsg = data.message && data.message.length > 0;
    return (
        <MessageComponent data={data}>
            <div class={vGetClass(data)}>
                <MessageMediaImage src={data.imgSrc} size={data.imgSize} isThumb={!!data.thumbnail}/>

                {haveMsg ? (<div class="message">
                    <span dangerouslySetInnerHTML={data.message}/>
                    {vTimeTemplate(data)}
                </div>) : ""}
            </div>
        </MessageComponent>
    )
}


function vMessageWithUrlTemplate(data) {
    return (
        <MessageComponent data={data}>
            <div className={vGetClass(data)} onClick={test}>
                <div className="message">
                    <span dangerouslySetInnerHTML={data.message}/>
                    {vTimeTemplate(data)}
                </div>

                <a href={data.url.url} className="box web rp">
                    <div className="quote">
                        <div className="preview"
                             css-background-image="url(${data.url.photo})"/>
                        <div className="name">{data.url.siteName}</div>
                        <div className="title">{data.url.title}</div>
                        <div className="text">{data.url.description}</div>
                    </div>
                </a>
            </div>
        </MessageComponent>
    )
}

function vMessageWithStickerTemplate(data) {
    return (
        <MessageComponent data={data}>
            <div class={vGetClass(data, true)}>
                <img class="sticker" src={data.imgSrc}/>
                {vTimeTemplate(data, true)}
            </div>
        </MessageComponent>
    )
}

function vMessageWithVoiceAudioTemplate(data) {
    /*return vMessageTemplate(data,
        <div class={vGetClass(data)}>
            <div className="message">
                {vForwardedTemplate(data)}
                <div class="audio">
                    <div class="play"/>
                    <div class="inside">
                        <div class="bars">
                            {
                                Object.assign([], data.audio.waveform).map(l => {
                                    return <div className="bar" style={`height: ${l / 31 * 100}%`}/>
                                })
                            }
                        </div>
                        <span class="time">{data.audio.time} <span class={data.audio.read}/></span>
                    </div>
                    {vTimeTemplate(data)}
                </div>
                <audio src={data.audio.url}/>
            </div>
        </div>
    )*/
    // const voice = new Voice(new Audio(data.audio.url), data.audio.waveform);
    return (
        <MessageComponent data={data}>
            {/*<div class={vGetClass(data)}>*/}
            {/*    <div className="message">*/}
            {/*        {vForwardedTemplate(data)}*/}
            {/*        {voice.asJSX()}*/}
            {/*        {vTimeTemplate(data)}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </MessageComponent>
    )
}

function vMessageWithAudioTemplate(data) {
    return (
        <MessageComponent data={data}>
            {/*<div class={vGetClass(data)}>*/}
            {/*    <audio src={data.url}/>*/}
            {/*    {vTimeTemplate(data, true)}*/}
            {/*</div>*/}
        </MessageComponent>
    )
}


function vMessageWithRoundVideoTemplate(data) {
    return (
        <div class={vGetClass(data, true)}>
            <video width={data.video.width} height={data.video.height} style="border-radius: 100%;">
                <source type={data.video.type} src={data.video.url}/>
            </video>
            {vTimeTemplate(data, true)}
        </div>
    )
}

function vMessageWithVideoTemplate(data) {
    return (
        <div class={vGetClass(data)}>
            <video class="attachment" width={data.video.width} height={data.video.height} controls>
                <source type={data.video.type} src={data.video.url}/>
            </video>
            <div className="message">
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>
        </div>
    )
}

function vMessageWithFileTemplate(data) {
    const classes = data.out ? "message message-self" : "message"
    return (
        <div class={classes}>
<span>
<i>{data.userName}</i>
</span>

            <div>
                <span dangerouslySetInnerHTML={data.message}/>

            </div>

            <a href={data.fileURL}>
                Download {data.fileName}
            </a>
        </div>
    )
}

export function UICreateMessage(message) {
    if (!message.type) {
        return <div>Unsupported message type</div>
    }

    const handlers = {
        // photo: vMessageWithImageTemplate,
        text: TextMessageComponent,
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
        return <div>unexpected</div>
    }
}

