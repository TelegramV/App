import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findUserFromMessage, getPeerName} from "./dialog"
import {FileAPI} from "../../../../api/fileAPI"
import {VDOM} from "../../../framework/vdom"

function vTimeTemplate(data, bg = false) {
    let classes = "inner tgico " + (bg ? "bg" : "")
    let classes2 = "time " + (bg ? "bg" : "")

    return (
        <span class={classes2}>
            <div class={classes}>{data.time}</div>
        </span>
    )
}

function vGetClass(data, transparent = false) {
    let classes = "bubble"
    if (data.read) classes += " read"
    if (transparent) classes += " transparent"
    return classes
}

function vMessageTemplate(data, inside) {
    return (
        <div class={data.out}>
            {inside}
        </div>
    )
}

function vMessageWithTextOnlyTemplate(data) {
    return vMessageTemplate(data, (
        <div class={vGetClass(data)}>
            <div class="message">
                {data.message}
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
                {data.message}
                {vTimeTemplate(data)}
            </div>
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
            <audio src={data.audio.url}/>
            {vTimeTemplate(data, true)}
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
    const classes = data.out ? "message message-self" : "message"
    return (
        <div class={classes}>
<span>
<i>{data.userName}</i>
</span>

            <div htmlChild="true">
                {data.message}
            </div>

            <video width={data.video.width} height={data.video.height}>
                <source type={data.video.type} src={data.video.url}/>
            </video>
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
                {data.message}
            </div>

            <a href={data.fileURL}>
                Download {data.fileName}
            </a>
        </div>
    )
}

export class MessageComponent extends HTMLElement {
    constructor(options = {}) {
        super()
        if (!options.message) {
            throw new Error("message is not defined")
        }
        this.message = options.message
        this.messagesSlice = options.messagesSlice || AppTemporaryStorage.getItem("messages.messagesSlice")
        this.dataset.messageId = options.message.id

        this.vNode = null
    }

    connectedCallback() {
        this.initVNode().then(() => {
            this.render()
        })
    }

    async initVNode() {
        this.innerHTML = "loading.."
        const message = this.message
        const messageMessage = parseMessageEntities(message.message, message.entities)

        const user = findUserFromMessage(message, this.messagesSlice)
        const userName = getPeerName(user)
        const time = new Date(message.date * 1000)


        const timeString = time.toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        console.log(message)

        const data = {
            userName: userName,
            message: messageMessage,
            out: message.pFlags.out ? "out" : "in",
            time: timeString
        }

        if (message.media) {
            if (message.media.photo) {
                data.imgSrc = null
                this.vNode = vMessageWithImageTemplate(data)

                FileAPI.getFile(message.media.photo, "m").then(file => {
                    if (file._ === "upload.file") {
                        const blob = new Blob([file.bytes], {type: 'application/jpeg'});
                        data.imgSrc = URL.createObjectURL(blob)

                        this.vNode = vMessageWithImageTemplate(data)

// re-render
                        this.render()
                    }
                })
            } else if (message.media.document) {
                FileAPI.getFile(message.media.document, "").then(response => {
                    if (response._ === "upload.file") {
                        let blob = new Blob([response.bytes], {type: message.media.document.mime_type});
                        /*this.vNode = vMessageWithFileTemplate({
                        userName: userName,
                        message: messageMessage,
                        fileURL: URL.createObjectURL(blob),
                        fileName: message.media.document.mime_type,
                        out: message.pFlags.out

                        })*/
                        message.media.document.attributes.forEach(attribute => {
                            if (attribute._ === "documentAttributeVideo") {
                                const handler = attribute.pFlags.round_message ? vMessageWithRoundVideoTemplate : vMessageWithVideoTemplate
                                data.video = {
                                    width: attribute.w,
                                    height: attribute.h,
                                    url: URL.createObjectURL(blob),
                                    type: message.media.document.mime_type,
                                    duration: attribute.duration
                                }
                                this.vNode = handler(data)
                            } else if (attribute._ === "documentAttributeSticker") {
                                data.imgSrc = URL.createObjectURL(blob)
                                this.vNode = vMessageWithStickerTemplate(data)

                            }else if(attribute._ === "documentAttributeAudio") {
                                const handler = attribute.pFlags.voice ? vMessageWithVoiceAudioTemplate : vMessageWithAudioTemplate
                                const waveform = attribute.waveform
                                data.audio = {
                                    url: URL.createObjectURL(blob),
                                    duration: attribute.duration,
                                    waveform: waveform
                                }
                                this.vNode = handler(data)
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
                        /*this.vNode = vMessageWithRoundVideoTemplate({
                        userName: userName,
                        message: messageMessage,
                        video: {
                        width: "200",
                        height: "200",
                        url: URL.createObjectURL(blob),
                        type: message.media.document.mime_type
                        },
                        out: message.pFlags.out

                        })*/

// re-render
                        this.render()
                    }
                })
            }

        } else {
            this.vNode = vMessageWithTextOnlyTemplate(data)
        }
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}