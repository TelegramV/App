import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {findUserFromMessage, getPeerName} from "./dialog"
import {FrameworkComponent} from "../../../framework/component"
import {FileAPI} from "../../../../api/fileAPI";
import {formatTimeAudio} from "../../../utils";

function vTimeTemplate(data, bg = false) {
    let classes = "inner tgico " + (bg ? "bg" : "")
    let classes2 = "time " + (bg ? "bg" : "")

    return (
        <span class={classes2}>
            <div class={classes}>{data.views ?
                <span>{data.views} <span class="tgico tgico-channelviews"/>    </span> : ""}{data.time}</div>
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
    return (
        <div class={data.out} data-id={data.id}>
            {data.out === "in" ? <img class="avatar" src={data.avatar}/> : ""}
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
    return vMessageTemplate(data, (
        <div class={vGetClass(data)}>
            <img class="attachment" src={data.imgSrc}></img>
            <div class="message">
                <span dangerouslySetInnerHTML={data.message}/>
                {vTimeTemplate(data)}
            </div>
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

            <div htmlChild="true">
                <span dangerouslySetInnerHTML={data.message}/>

            </div>

            <a href={data.fileURL}>
                Download {data.fileName}
            </a>
        </div>
    )
}

export class MessageComponent extends FrameworkComponent {
    constructor(options = {}) {
        super()
        if (!options.message) {
            throw new Error("message is not defined")
        }
        this.message = options.message
        this.messagesSlice = options.messagesSlice
    }

    data() {
        return {
            message: {
                type: "",
                data: {}
            }
        }
    }

    mounted() {
        const message = this.message

        const user = findUserFromMessage(message, this.messagesSlice)
        const userName = getPeerName(user)
        const type = "chat" // TODO getPeerType(user)
        const time = new Date(message.date * 1000)

        if (message._ === "messageService") {
            console.log(message)
            let data = {
                id: message.id,
                message: message.action._ // TODO parse this properly
            }
            this.reactive.message = {
                type: "service",
                data: data
            }
            return
        }
        const messageMessage = parseMessageEntities(message.message, message.entities)

        const timeString = time.toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        const out = message.pFlags.out && type !== "channel" ? "out" : "in"
        console.log(message, user)

        let data = {
            id: message.id,
            userName: userName,
            message: messageMessage,
            out: out,
            time: (message.post_author && message.post_author.length > 0 ? message.post_author + ", " : "") + timeString,
            avatar: "",
            views: message.views
        }
        if (message.fwd_from) {
            data.fwd = {
                from: "Test " + message.fwd_from.from_id,
                date: message.fwd_from.date

            }
        }
        if (message.reply_to_msg_id) {

            data.reply = {
                name: "kek",
                text: "lt"
            }
        }
        if (message.media) {
            if (message.media.photo) {
                this.reactive.message = {
                    type: "photo",
                    data: data
                }

                FileAPI.getFile(message.media.photo, "m").then(file => {
                    this.reactive.message.data.imgSrc = file
                })
            } else if (message.media.webpage) {
                if (message.media.webpage._ === "webPageEmpty") {
                    this.reactive.message = {
                        type: "text",
                        data: data
                    }
                } else {
                    this.reactive.message = {
                        type: "url",
                        data: data
                    }
                    const webpage = message.media.webpage
                    console.log(webpage)
                    this.reactive.message.data.url = {
                        description: webpage.description,
                        url: webpage.url,
                        title: webpage.title,
                        siteName: webpage.site_name
                    }
                    console.log("webpage photo download ", webpage.photo)
                    FileAPI.getFile(webpage.photo, "m").then(response => {
                        console.log("webpage photo " + response)
                        this.reactive.message.data.url.photo = response
                    })
                }
            } else if (message.media.document) {
                this.reactive.message = {
                    type: "document",
                    data: data
                }
                FileAPI.getFile(message.media.document, "").then(response => {
                    const url = response
                    message.media.document.attributes.forEach(attribute => {
                        if (attribute._ === "documentAttributeVideo") {
                            this.reactive.message.data.video = {
                                width: attribute.w,
                                height: attribute.h,
                                url: url,
                                type: message.media.document.mime_type,
                                duration: attribute.duration
                            }
                            this.reactive.message.type = attribute.pFlags.round_message ? "round" : "video"
                        } else if (attribute._ === "documentAttributeSticker") {
                            this.reactive.message.data.imgSrc = url
                            // console.log(this.reactive.message)
                            this.reactive.message.type = "sticker"

                        } else if (attribute._ === "documentAttributeAudio") {
                            const wf = []
                            const ka = [
                                248, 124, 62, 31, 15, 7, 3, 1
                            ]
                            const ka2 = [
                                0, 0, 0, 0, 128, 192, 224, 240
                            ]
                            console.log(attribute.waveform)
                            for (let i = 0, k = 0; i < attribute.waveform.length; i++, k = (k + 5) % 8) {
                                let z = attribute.waveform[i]
                                let z2 = attribute.waveform[i + 1]
                                wf.push(z & ka[k])

                            }
                            console.log(message)
                            this.reactive.message.data.audio = {
                                url: url,
                                waveform: attribute.waveform,
                                read: message.pFlags.media_unread ? "read" : "", // TODO
                                time: formatTimeAudio(attribute.duration)
                            }
                            this.reactive.message.type = attribute.pFlags.voice ? "voice" : "audio"
                        } else if (attribute._ === "documentAttributeFilename") {
                            this.reactive.message.data.documentName = attribute.file_name
                        } else {
                            console.log(attribute)
                            /*blob = blob.slice(0, blob.size, "octec/stream")
                            this.vNode = vMessageWithFileTemplate({
                                userName: userName,
                                message: messageMessage,
                                fileURL: URL.createObjectURL(blob),
                                fileName: message.media.document.mime_type,
                                                    out: message.pFlags.out

                            })*/
                        }
                    })
                })
            }

        } else {
            this.reactive.message = {
                type: "text",
                data: data
            }
        }


        if (user && user.photo) {
            let a = user.photo.photo_small
            FileAPI.getPeerPhoto(a, user, false).then(url => {
                this.reactive.message.data.avatar = url
            })
        }
    }

    h() {
        if (!this.reactive.message.type) {
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

        return handlers[this.reactive.message.type](this.reactive.message.data)
    }
}
