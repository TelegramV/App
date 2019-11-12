import {parseMessageEntities} from "../../../../mtproto/utils/htmlHelpers"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findUserFromMessage, getPeerName} from "./dialog"
import {FileAPI} from "../../../../api/fileAPI"

function template(data) {
    return `
        <span><i>${data.name}:</i></span>
        <div>
            ${data.message}
        </div> 
        <div></div>
    `
}

export class MessageComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = this.render()
    }

    render() {
        const messagesSlice = AppTemporaryStorage.getItem("messages.messagesSlice")

        const message = messagesSlice.messages.find(message => message.id == this.dataset.messageId)
        const messageMessage = parseMessageEntities(message.message, message.entities)

        const user = findUserFromMessage(message, messagesSlice)
        const userName = getPeerName(user)

        return template({
            name: userName,
            message: messageMessage
        })

        // if (message.media) {
        //     if (message.media.photo) {
        //         const img = document.createElement("img")
        //         messageComponent.appendChild(img)
        //         FileAPI.getFile(message.media.document || message.media.photo).then(response => {
        //             if (response._ === "upload.file") {
        //                 const blob = new Blob([response.bytes], {type: 'application/jpeg'});
        //                 img.setAttribute("src", URL.createObjectURL(blob))
        //             }
        //         })
        //     } else if (message.media.document) {
        //         const docLink = document.createElement("a")
        //         messageComponent.appendChild(docLink)
        //         FileAPI.getFile(message.media.document).then(response => {
        //             if (response._ === "upload.file") {
        //                 // message.media.document.mime_type
        //                 const blob = new Blob([response.bytes], {type: "octec/stream"});
        //                 docLink.setAttribute("href", URL.createObjectURL(blob))
        //                 docLink.innerText = `Download file (${message.media.document.mime_type})`
        //                 // console.log("Attributes", message.media.document.attributes)
        //             }
        //         })
        //     }
        // }
    }
}