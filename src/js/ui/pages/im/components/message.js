import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findUserFromMessage, getPeerName} from "./dialog"
import VDOM from "../../../framework/vdom"
import {FileAPI} from "../../../../api/fileAPI"

function vMessageWithTextOnlyTemplate(data) {
    return VDOM.h("div", {
        events: {
            click() {
                console.log("FUCK IT DOES WORK!")
            }
        },
        children: [
            VDOM.h("span", {
                children: [
                    VDOM.h("i", {
                        children: data.userName
                    })
                ]
            }),

            VDOM.h("div", {
                htmlChild: true,
                children: data.message
            }),
        ]
    })
}

function vMessageWithImageTemplate(data) {
    return VDOM.h("div", {
        children: [
            VDOM.h("span", {
                children: [
                    VDOM.h("i", {
                        children: data.userName
                    })
                ]
            }),

            VDOM.h("div", {
                htmlChild: true,
                children: data.message
            }),

            VDOM.h("img", {
                attrs: {
                    src: data.imgSrc
                }
            }),
        ]
    })
}

function vMessageWithFileTemplate(data) {
    return VDOM.h("div", {
        children: [
            VDOM.h("span", {
                children: [
                    VDOM.h("i", {
                        children: data.userName
                    })
                ]
            }),

            VDOM.h("div", {
                htmlChild: true,
                children: data.message
            }),

            VDOM.h("a", {
                attrs: {
                    href: data.fileURL
                },
                children: `Download ${data.fileName}`
            }),
        ]
    })
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
                    imgSrc: null
                })

                FileAPI.getFile(message.media.document || message.media.photo).then(file => {
                    let imgSrc = null
                    if (file._ === "upload.file") {
                        const blob = new Blob([file.bytes], {type: 'application/jpeg'});
                        imgSrc = URL.createObjectURL(blob)

                        this.vNode = vMessageWithImageTemplate({
                            userName: userName,
                            message: messageMessage,
                            imgSrc: imgSrc
                        })

                        // re-render
                        this.render()
                    }
                })
            } else if (message.media.document) {
                FileAPI.getFile(message.media.document).then(response => {
                    if (response._ === "upload.file") {
                        const blob = new Blob([response.bytes], {type: "octec/stream"});
                        this.vNode = vMessageWithFileTemplate({
                            userName: userName,
                            message: messageMessage,
                            fileURL: URL.createObjectURL(blob),
                            fileName: message.media.document.mime_type
                        })

                        // re-render
                        this.render()
                    }
                })
            }

        } else {
            this.vNode = vMessageWithTextOnlyTemplate({
                userName: userName,
                message: messageMessage
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