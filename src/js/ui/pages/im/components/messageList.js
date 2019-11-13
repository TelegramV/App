import {AppFramework} from "../../../framework/framework"
import {MTProto} from "../../../../mtproto"
import {PeerAPI} from "../../../../api/peerAPI"
import {AppTemporaryStorage} from "../../../../common/storage"
import {dialogPeerMap, findPeerFromDialog} from "./dialog"
import {MessageComponent} from "./message"
import VDOM from "../../../framework/vdom"

export class MessageListComponent extends HTMLElement {
    constructor() {
        super()
        this.dialogsSlice = AppTemporaryStorage.getItem("dialogsSlice")
        this.vNode = VDOM.h("h3", {
            children: "loading.."
        })
    }

    connectedCallback() {
        this.initVNode().then(() => {
            this.render()

            AppFramework.Router.onQueryChange(queryParams => {
                this.initVNode().then(() => {
                    this.render()
                })
            })
        })
    }

    async initVNode() {
        this.innerHTML = "loading.."

        if (!AppFramework.Router.activeRoute.queryParams.p) {
            this.vNode = VDOM.h("h1", {
                children: "Select a chat"
            })
            return
        } else {
            this.vNode = VDOM.h("h1", {
                children: "loading.."
            })
        }

        const dialogsSlice = this.dialogsSlice

        if (!dialogsSlice) return

        const dialogPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

        const dp = {
            _: dialogPeer[0],
        }
        dp[dialogPeerMap[dp._] + '_id'] = dialogPeer[1]

        const peer = findPeerFromDialog({
            peer: dp
        }, dialogsSlice)

        return await MTProto.invokeMethod("messages.getHistory", {
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

            this.vNode = (
                <div class="im flex-column">
                    <div class="im-header flex-row">
                        <div class="im-header-info flex-row">
                            <img class="im-header-photo round-block"
                                 src="https://static10.tgstat.ru/channels/_0/3b/3bdc7810ebf4c3de0646923f39267695.jpg"/>
                            <div class="flex-column">
                                <div class="im-header-name">Saved Messages</div>
                                <div class="im-header-status">Nothing</div>
                            </div>
                        </div>
                        <div class="im-header-options flex-row">
                            <button class="im-header-subscribe">SUBSCRIBE</button>
                            <div class="im-header-button"><img class="full-center" src="./icons/mute_svg.svg"/>
                            </div>
                            <div class="im-header-button"><img class="full-center"
                                                                   src="./icons/search_svg.svg"/>
                            </div>
                            <div class="im-header-button"><img class="full-center" src="./icons/more_svg.svg"/>
                            </div>
                        </div>
                    </div>
                    <div class="im-background">
                        <div class="im-container flex-column">
                            <div class="im-history flex-column-reverse">
                                {
                                    response.messages.map(message => {
                                        return (
                                            <div>
                                                <MessageComponent options={{
                                                    message,
                                                    messagesSlice: response
                                                }}/>
                                                <br/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )

        })
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}