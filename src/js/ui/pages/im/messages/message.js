import {MTProto} from "../../../../mtproto"
import VDOM from "../../../framework/vdom"

function vTimeTemplate(data, bg = false) {
    let classes = "inner tgico " + (bg ? "bg" : "")
    let classes2 = "time " + (bg ? "bg" : "")

    return (
        <span class={classes2}>
            <div class={classes}>{data.views ?
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

function vMessageTemplate(data, inside) {
    const className = data.post ? "channel in" : data.out ? "out" : "in"
    return (
        <div class={className} data-id={data.id}>
            {className === "in" ? (
                <div className={"avatar " + (!data.from.photo ? `placeholder-${data.from.photoPlaceholder.num}` : "")}
                     style={`background-image: url(${data.from.photo});`}>
                    {!data.from.photo ? data.from.photoPlaceholder.text : ""}
                </div>
            ) : ""}
            {inside}
        </div>
    )
}

// TODO add to every message type
function vForwardedTemplate(data) {
    return data.fwd ? <div class="fwd">Forwarded from {data.fwd.from}</div> : ""
}

function vMessageWithTextOnlyTemplate(data) {
    return vMessageTemplate(data, (
        <div class={vGetClass(data)}>
            {data.reply ? (<div className="box rp">
                <div className="quote">
                    <div className="name">{data.reply.name}</div>
                    <div className="text">{data.reply.text}</div>
                </div>
            </div>) : ""}
            <div class="message">
                {vForwardedTemplate(data)}
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>
        </div>
    ))

}

function vMessageWithImageTemplate(data) {
    let haveMsg = data.message && data.message.length > 0;
    return vMessageTemplate(data, (
        <div class={vGetClass(data)}>
            <img class="attachment" src={data.imgSrc}></img>
            {haveMsg ? (<div class="message">
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>): ""}
        </div>
    ))
}

function test() {
    MTProto.createFileNetworker(1).then(l => {
        console.log(l)
    })
}

function vMessageWithUrlTemplate(data) {
    return vMessageTemplate(data, (
        <div className={vGetClass(data)} onClick={test}>
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
    return vMessageTemplate(data,
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

    return VDOM.render(handlers[message.type](message))
}
