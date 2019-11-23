import {MTProto} from "../../../../mtproto"
import Voice from "../../../voice"
import EmojiConverter from "emoji-js"
import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers";

const emoji = new EmojiConverter();

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

function vMessageTemplate(message, inside) {
    const className = message.post ? "channel in" : message.out ? "out" : "in"
    const from = message.from
    console.log(message)
    return (
        <div class={className} data-id={message.id} data-peer={`${from.type}.${from.id}`}>
            {className === "in" ? (
                <div className={"avatar " + (!from.hasAvatar ? `placeholder-${from.avatarLetter.num}` : "")}
                     style={`background-image: url(${from._avatar});`}>
                    {!from.hasAvatar ? from.avatarLetter.text : ""}
                </div>
            ) : ""}
            {inside}
        </div>
    )
}

// TODO add to every message type
function vForwardedTemplate(data) {
    return data.fwd ? <div class="fwd">Forwarded from {data.fwd.from}</div> : "";
}

function vMessageWithTextOnlyTemplate(message) {
    const username = message.userName && !message.post && !message.out;
    let msg = parseMessageEntities(message.text, message.entities)
    msg = msg ? emoji.replace_unified(msg) : "";

    return vMessageTemplate(message, (
        <div class={vGetClass(message)}>
            {username ? <div className="username">{message.userName}</div> : ""}

            {message.reply ? (<div className="box rp">
                <div className="quote">
                    <div className="name">{message.reply.name}</div>
                    <div className="text">{message.reply.text}</div>
                </div>
            </div>) : ""}
            <div class={`message ${username ? "nopad" : ""}`}>

                {vForwardedTemplate(message)}
                <span dangerouslySetInnerHTML={msg}/>
                {vTimeTemplate(message)}
            </div>
        </div>
    ))

}

function vMessageWithImageTemplate(data) {
    let haveMsg = data.message && data.message.length > 0;
    return vMessageTemplate(data, (
        <div class={vGetClass(data)}>
            {data.thumbnail ?
                <div>
                    <div css-position="absolute" css-z-index="1000" className="full-size-loader">
                        <progress className="progress-circular"/>
                    </div>
                    <img class="attachment attachment-thumb"
                         src={data.imgSrc}
                         css-width={Number(data.imgSize[0]) > 460 ? "460px" : `${data.imgSize[0]}px`}/>
                </div> :
                <img className="attachment" src={data.imgSrc}/>
            }
            {haveMsg ? (<div class="message">
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>) : ""}
        </div>
    ))
}


function vMessageWithUrlTemplate(data) {
    return vMessageTemplate(data, (
        <div className={vGetClass(data)}>
            <div className="message">
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>

            <a href={data.url.url} className="box web rp">
                <div className="quote">
                    <div className="preview"
                         style={`background-image: url(${data.url.photo})`}></div>
                    <div className="name">{data.url.siteName}</div>
                    <div className="title">{data.url.title}</div>
                    <div className="text">{data.url.description}</div>
                </div>
            </a>
        </div>
    ))
}

function vMessageWithStickerTemplate(data) {
    return vMessageTemplate(data, (
        <div class={vGetClass(data, true)}>
            <img class="sticker" src={data.imgSrc}></img>
            {vTimeTemplate(data, true)}
        </div>
    ))
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
    const voice = new Voice(new Audio(data.audio.url), data.audio.waveform);
    return vMessageTemplate(data,
        <div class={vGetClass(data)}>
            <div className="message">
                {vForwardedTemplate(data)}
                {voice.asJSX()}
                {vTimeTemplate(data)}
            </div>
        </div>
    )
}

function vMessageWithAudioTemplate(data) {
    return vMessageTemplate(
        <div class={vGetClass(data)}>
            <audio src={data.url}/>
            dsfsdf
            {vTimeTemplate(data, true)}
        </div>
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
        photo: vMessageWithImageTemplate,
        text: vMessageWithTextOnlyTemplate,
        round: vMessageWithRoundVideoTemplate,
        video: vMessageWithVideoTemplate,
        audio: vMessageWithAudioTemplate,
        voice: vMessageWithVoiceAudioTemplate,
        sticker: vMessageWithStickerTemplate,
        document: vMessageWithTextOnlyTemplate,
        url: vMessageWithUrlTemplate,
        service: vServiceMessageTemplate
    }

    return handlers[message.type](message)
}

