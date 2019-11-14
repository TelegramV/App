import {AppFramework} from "../../../framework/framework"
import {MTProto} from "../../../../mtproto"
import {PeerAPI} from "../../../../api/peerAPI"
import {AppTemporaryStorage} from "../../../../common/storage"
import {dialogPeerMap, findPeerFromDialog} from "./dialog"
import {MessageComponent} from "./message"
import VDOM from "../../../framework/vdom"
import {FileAPI} from "../../../../api/fileAPI";

function vMessagesTemplate(data, messages) {
    return (
        <div id="chat">
            <div id="topbar">
                <div class="chat-info">
                    <div class="person">
                        <img src={data.photo.url} class="avatar"></img>
                        <div class="content">
                            <div class="top">
                                <div class="title">{data.peer.first_name} {data.peer.last_name}</div>
                            </div>
                            <div class="bottom">
                                <div class={"info" + (data.peer.status._ === "userStatusOnline" ? " online" : "")}>{data.peer.status._ === "userStatusOnline" ? "online" : "last seen a long time ago"}</div>
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
                        messages
                    }
                </div>
            </div>
        </div>
    )
}
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
        this.innerHTML = `<div class="full-size-loader"><progress class="progress-circular big"/></div>`

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
            console.log(response)
            console.log(peer)

            let messages = response.messages.map(message => {
                return <MessageComponent constructor={{
                    message,
                    messagesSlice: response
                }}/>
            })
            this.vNode = vMessagesTemplate({
                photo: {},
                peer: peer
            }, messages)

            if(peer.photo) {
                let a = peer.photo.photo_small
                FileAPI.getPeerPhoto(a, peer, false).then(response => {
                    const blob = new Blob([response.bytes], { type: 'application/jpeg' });
                    this.vNode = vMessagesTemplate({
                        photo: {
                            url: URL.createObjectURL(blob)
                        },
                        peer: peer
                    }, messages)
                    this.render()
                })
            }

        })
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}