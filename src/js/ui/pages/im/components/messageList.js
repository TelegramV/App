import {AppFramework} from "../../../framework/framework"
import {MTProto} from "../../../../mtproto"
import {PeerAPI} from "../../../../api/peerAPI"
import {AppTemporaryStorage} from "../../../../common/storage"
import {dialogPeerMap, findPeerFromDialog, getPeerName} from "./dialog"
import {MessageComponent} from "./message"
import {FrameworkComponent} from "../../../framework/component"
import {FileAPI} from "../../../../api/fileAPI";

export class MessageListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super()
        this.dialogsSlice = props.dialogsSlice || AppTemporaryStorage.getItem("dialogsSlice")

        // kostyl, have to be fixed later
        this.alwaysForceRender = true

        if (AppFramework.Router.activeRoute.queryParams.p) {
            this.init()
        }

        AppFramework.Router.onQueryChange(queryParams => {
            if (queryParams.p) {
                this.init()
                // this.forceRender()
            } else {
                // avoid shit like this!
                this.render()
            }
        })
    }

    data() {
        return {
            messagesSlice: false,
            isLoading: true
        }
    }

    init() {
        this.reactive.isLoading = true
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

        return MTProto.invokeMethod("messages.getHistory", {
            peer: PeerAPI.getInput(peer),
            offset_id: 0,
            offset_date: 0,
            add_offset: 0,
            limit: 20,
            max_id: 0,
            min_id: 0,
            hash: 0

        }).then(messagesSlice => {
            AppTemporaryStorage.setItem("messages.messagesSlice", messagesSlice)
            this.reactive.peer = peer
            this.reactive.title = getPeerName(peer)
            this.reactive.messagesSlice = messagesSlice
            this.reactive.isLoading = false
            this.reactive.photoPlaceholder = {
                num: Math.abs(peer.id) % 8,
                text: this.reactive.title[0] // TODO change to proper name
            }
            if(peer.photo) {
                let a = peer.photo.photo_small
                FileAPI.getPeerPhoto(a, peer.photo.dc_id, peer, false).then(url => {
                    this.reactive.photo = url
                })
            }
        })
    }

    h({reactive}) {
        if (!AppFramework.Router.activeRoute.queryParams.p) {
            return <h1>Select a chat</h1>
        }

        if (reactive.isLoading) {
            return <div className="full-size-loader height">
                <progress className="progress-circular big"/>
            </div>
        }
        const data = reactive

        return (
            <div id="chat" data-peer={AppFramework.Router.activeRoute.queryParams.p}>
                <div id="topbar">
                    <div className="chat-info">
                        <div className="person">
                            <div className={"avatar " + (!data.photo ? `placeholder-${data.photoPlaceholder.num}` : "")}
                                 style={`background-image: url(${data.photo});`}>
                                {!data.photo ? data.photoPlaceholder.text : ""}
                            </div>
                            <div className="content">
                                <div className="top">
                                    <div className="title">{data.title}</div>
                                </div>
                                <div className="bottom">
                                    <div
                                        className="info">online</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pinned-msg"></div>
                    <div className="btn-icon rp rps tgico-search"></div>
                    <div className="btn-icon rp rps tgico-more"></div>
                </div>
                <div id="bubbles">
                    <div id="bubbles-inner">
                        <div class="service">
                            <div class="service-msg">October 21</div>
                        </div>
                        {/*TODO fix that */}
                        {
                            reactive.messagesSlice.messages.map(message => {
                                return <MessageComponent constructor={{
                                    message,
                                    messagesSlice: reactive.messagesSlice
                                }}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}