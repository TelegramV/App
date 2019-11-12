import {AppFramework} from "../../../framework/framework"
import {MTProto} from "../../../../mtproto"
import {PeerAPI} from "../../../../api/peerAPI"
import {AppTemporaryStorage} from "../../../../common/storage"
import {findPeerFromDialog} from "./dialog"

const dialogPeerMap = {
    "peerUser": "user",
    "peerChannel": "channel",
    "peerChat": "chat",
}

export class MessageListComponent extends HTMLElement {
    constructor() {
        super()
        AppFramework.Router.onQueryChange(queryParams => {
            this.innerHTML = this.render()
        })
    }

    connectedCallback() {
        this.innerHTML = this.render()


    }

    async renderIfChatSelected() {
        const dialogsSlice = AppTemporaryStorage.getItem("dialogsSlice")

        if (!dialogsSlice) return

        const dialogPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

        console.error(dialogPeer)

        const dp = {
            _: dialogPeer[0],
        }
        dp[dialogPeerMap[dp._] + '_id'] = dialogPeer[1]

        const peer = findPeerFromDialog({
            peer: dp
        }, dialogsSlice)

        MTProto.invokeMethod("messages.getHistory", {
            peer: PeerAPI.getInput(peer),
            offset_id: 0,
            offset_date: 0,
            add_offset: 0,
            limit: 20,
            max_id: 0,
            min_id: 0,
            hash: 0

        }).then(response => {
            AppTemporaryStorage.setItem("messages.messagesSlice", response)
            this.innerHTML = ""

            response.messages.forEach((message, i) => {
                const messageComponent = document.createElement("message-component")
                messageComponent.dataset.messageId = message.id
                this.appendChild(messageComponent)
                this.appendChild(document.createElement("br"))
            })
        })
    }

    render() {
        if (!AppFramework.Router.activeRoute.queryParams.p) {
            return "<h1>Select a chat</h1>"
        } else {
            this.renderIfChatSelected().then(() => {
            })
            return "loading..."
        }
    }
}