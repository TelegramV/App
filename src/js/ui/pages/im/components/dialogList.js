import {AppTemporaryStorage} from "../../../../common/storage"
import {MTProto} from "../../../../mtproto"

const dialogPeerMap = {
    "peerUser": "user",
    "peerChannel": "channel",
    "peerChat": "chat",
}

export class DialogListComponent extends HTMLElement {
    constructor() {
        super();
        this.classList.add("dialogs")
    }

    connectedCallback() {
        this.innerHTML = this.render()

        this.getDialogs().then(result => {
            AppTemporaryStorage.setItem("dialogsSlice", result)

            this.innerHTML = ""

            result.dialogs.forEach(dialog => {
                const element = document.createElement("telegram-dialog-component")
                element.dataset.peer = `${dialog.peer._}-${dialog.peer[dialogPeerMap[dialog.peer._] + '_id']}`
                this.appendChild(element)
            })

            document.getElementById("chatBlock").innerHTML = `<message-list-component></message-list-component>`
        })
    }

    getDialogs() {
        return MTProto.invokeMethod("messages.getDialogs", {
            flags: {},
            exclude_pinned: false,
            folder_id: "",
            offset_date: "",
            offset_id: "",
            offset_peer: {
                _: "inputPeerEmpty"
            },
            limit: "",
            hash: ""
        })
    }

    render() {
        return `
        loading...
        `
    }
}