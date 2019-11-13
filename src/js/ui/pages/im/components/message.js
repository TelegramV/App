import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findUserFromMessage, getPeerName} from "./dialog"
import {FileAPI} from "../../../../api/fileAPI"
import {VDOM} from "../../../framework/vdom"

function vMessageWithTextOnlyTemplate(data) {
    const classes = data.out ? "message message-self" : "message"
    return (
        <div class={classes}>
            <span>
                <i>{data.userName}</i>
            </span>

            <div htmlChild="true">
                {data.message}
            </div>
        </div>
    )
}

function vMessageWithImageTemplate(data) {
    const classes = data.out ? "message message-self" : "message"
    return (
        <div class={classes}>
            <span>
                <i>{data.userName}</i>
            </span>

            <div htmlChild="true">
                {data.message}
            </div>

            <img src={data.imgSrc} alt="fuck this"/>
        </div>
    )
}

function vMessageWithStickerTemplate(data) {
    const classes = data.out ? "message with-sticker message-self" : "message with-sticker"
    return (
        <div class={classes}>
            <div className="message-sticker">
                <img src={data.imgSrc} alt="sticker"/>
            </div>
            <div className="message-meta absolute"><span className="message-time">22:59</span>
            </div>
        </div>
    )
}


function vMessageWithRoundVideoTemplate(data) {
    const classes = data.out ? "message message-self" : "message"
    return (
        <div class={classes}>
            <span>
                <i>{data.userName}</i>
            </span>

            <video width={data.video.width} height={data.video.height} style="border-radius: 100%;">
                <source type={data.video.type} src={data.video.url}/>
            </video>
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

        if (message.media) {
            if (message.media.photo) {
                this.vNode = vMessageWithImageTemplate({
                    userName: userName,
                    message: messageMessage,
                    imgSrc: null,
                    out: message.pFlags.out
                })

                FileAPI.getFile(message.media.photo).then(file => {
                    let imgSrc = null
                    if (file._ === "upload.file") {
                        const blob = new Blob([file.bytes], {type: 'application/jpeg'});
                        imgSrc = URL.createObjectURL(blob)

                        this.vNode = vMessageWithImageTemplate({
                            userName: userName,
                            message: messageMessage,
                            imgSrc: imgSrc,
                            out: message.pFlags.out

                        })

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
                                this.vNode = handler({
                                    userName: userName,
                                    message: messageMessage,
                                    video: {
                                        width: attribute.w,
                                        height: attribute.h,
                                        url: URL.createObjectURL(blob),
                                        type: message.media.document.mime_type,
                                        duration: attribute.duration
                                    },
                                    out: message.pFlags.out

                                })
                            } else if (attribute._ === "documentAttributeSticker") {
                                this.vNode = vMessageWithStickerTemplate({
                                    userName: userName,
                                    message: messageMessage,
                                    imgSrc: URL.createObjectURL(blob),
                                    out: message.pFlags.out

                                })
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
            this.vNode = vMessageWithTextOnlyTemplate({
                userName: userName,
                message: messageMessage,
                out: message.pFlags.out

            })
        }
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}