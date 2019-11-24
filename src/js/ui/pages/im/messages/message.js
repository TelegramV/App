import { MTProto } from "../../../../mtproto"
import Voice from "../../../voice"
import EmojiConverter from "emoji-js"

const emoji = new EmojiConverter();

function vTimeTemplate(data, bg = false) {
    let classes = "time" + (bg ? " bg" : "")

    return (
        <span class={classes}>
            <div class="inner tgico">{data.views ?
                <span>{data.views} <span
                    class="tgico tgico-channelviews"/>    </span> : ""}{data.time.toLocaleTimeString('en', {
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

const Message = ({ data, slot }) => {
    const className = data.post ? "channel in" : data.out ? "out" : "in"

    return (
        <div class={className} data-id={data.id} data-peer={`${data.from._}.${data.from.id}`}>
            {className === "in" ? (
                <div className={"avatar " + (!data.from.photo ? `placeholder-${data.from.photoPlaceholder.num}` : "")}
                     style={`background-image: url(${data.from.photo});`}>
                    {!data.from.photo ? data.from.photoPlaceholder.text : ""}
                </div>
            ) : ""}
            {slot}
        </div>
    )
}

// TODO add to every message type
function vForwardedTemplate(data) {
    return data.fwd ? <div class="fwd">Forwarded from {data.fwd.from}</div> : "";
}

function vMessageWithTextOnlyTemplate(data) {
    const username = data.userName && !data.post && !data.out;
    const msg = data.message ? emoji.replace_unified(data.message) : "";

    return <Message data={data}>
        <div className={vGetClass(data)}>
            {username ? <div className="username">{data.userName}</div> : ""}

            {data.reply ? (<div className="box rp">
                <div className="quote">
                    <div className="name">{data.reply.name}</div>
                    <div className="text">{data.reply.text}</div>
                </div>
            </div>) : ""}
            <div className={`message ${username ? "nopad" : ""}`}>

                {vForwardedTemplate(data)}
                <span dangerouslySetInnerHTML={msg}/>
                {vTimeTemplate(data)}
            </div>
        </div>
    </Message>
}


const MessageMediaImage = ({ src, size, alt = "", isThumb }) => {
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
        <Message data={data}>
            <div class={vGetClass(data)}>
                <MessageMediaImage src={data.imgSrc} size={data.imgSize} isThumb={!!data.thumbnail}/>

                {haveMsg ? (<div class="message">
                    <span dangerouslySetInnerHTML={data.message}/>
                    {vTimeTemplate(data)}
                </div>) : ""}
            </div>
        </Message>
    )
}

function test() {
    MTProto.createFileNetworker(1).then(l => {
        console.log(l)
    })
}

function vMessageWithUrlTemplate(data) {
    return (
        <Message data={data}>
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
        </Message>
    )
}

function vMessageWithStickerTemplate(data) {
    return (
        <Message data={data}>
            <div class={vGetClass(data, true)}>
                <img class="sticker" src={data.imgSrc}/>
                {vTimeTemplate(data, true)}
            </div>
        </Message>
    )
}

function vMessageWithVoiceAudioTemplate(data) {
    let color =  data.out ? "#50af4f" : "#4ea4f6";
    const voice = new Voice(new Audio(data.audio.url), data.audio.waveform, {
        id: data.id,
        duration: data.audio.time,
        mainColor: color,
        secondaryColor: "#c4c9cc"
    });
    return (
        <Message data={data}>
            <div class={vGetClass(data)}>
                <div className="message">
                    {vForwardedTemplate(data)}
                    {voice.asJSX()}
                    {vTimeTemplate(data)}
                </div>
            </div>
        </Message>
    )
}

function vMessageWithAudioTemplate(data) {
    return (
        <Message data={data}>
            <div class={vGetClass(data)}>
                <audio src={data.url}/>
                {vTimeTemplate(data, true)}
            </div>
        </Message>
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