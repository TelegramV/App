import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findUserFromMessage, getPeerName} from "./dialog"
import {FileAPI} from "../../../../api/fileAPI"
import {FrameworkComponent} from "../../../framework/component"

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
        this.messagesSlice = options.messagesSlice || AppTemporaryStorage.getItem("messages.messagesSlice")
        this.messageId = options.message.id

        this.init()
    }

    data() {
        return {
            message: {
                type: "",
                data: {}
            }
        }
    }

    init() {
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
        const out = message.pFlags.out ? "out" : "in"

        if (message.media) {
            if (message.media.photo) {
                this.reactive.message = {
                    type: "photo",
                    data: {
                        userName: userName,
                        message: messageMessage,
                        imgSrc: null,
                        out: out,
                        time: timeString
                    }
                }

                FileAPI.getFile(message.media.photo, "m").then(file => {
                    if (file._ === "upload.file") {
                        const blob = new Blob([file.bytes], {type: 'application/jpeg'});

                        this.reactive.message.data.imgSrc = URL.createObjectURL(blob)
                    }
                })
            } else if (message.media.document) {
                FileAPI.getFile(message.media.document, "").then(response => {
                    if (response._ === "upload.file") {
                        let blob = new Blob([response.bytes], {type: message.media.document.mime_type});
                        const url = URL.createObjectURL(blob)
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
                                this.reactive.message.type = "sticker"

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
                    }
                })
            }

        } else {
            this.reactive.message = {
                type: "text",
                data: {
                    userName: userName,
                    message: messageMessage,
                    out: out,
                    time: timeString
                }
            }
        }
    }

    h({reactive}) {
        if (!reactive.message.type) {
            return <div>Unsupported message type</div>
        }

        const handlers = {
            photo: vMessageWithImageTemplate,
            text: vMessageWithTextOnlyTemplate,
            round: vMessageWithRoundVideoTemplate,
            video: vMessageWithVideoTemplate,
            audio: vMessageWithAudioTemplate,
            voice: vMessageWithVoiceAudioTemplate,
            sticker: vMessageWithStickerTemplate
        }

        return handlers[reactive.message.type](reactive.message.data)
    }
}