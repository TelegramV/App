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
                <div id="chat">
                    <div id="topbar">
                        <div class="chat-info">
                            <div class="person">
                                <div class="avatar"></div>
                                <div class="content">
                                    <div class="top">
                                        <div class="title">Campus Party</div>
                                    </div>
                                    <div class="bottom">
                                        <div class="info">2,500 members, 746 online</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pinned-msg"></div>
                        <div class="btn-icon rp rps tgico-search"></div>
                        <div class="btn-icon rp rps tgico-more"></div>
                    </div>
                    <div id="bubbles">
                        <div id="bubbles-inner">
                            {/*<div class="service">*/}
                            {/*    <div class="service-msg">October 21</div>*/}
                            {/*</div>*/}
                            {/*TODO fix that */}
                            {
                                response.messages.map(message => {
                                    return <MessageComponent constructor={{
                                                message,
                                                messagesSlice: response
                                            }}/>
                                })
                            }
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