import {AppFramework} from "../../../framework/framework"
import {FrameworkComponent} from "../../../framework/component"
import {PeerAPI} from "../../../../api/peerAPI"
import MTProto from "../../../../mtproto"
import PeersManager from "../../../../api/peers/peersManager"
import DialogsManager from "../../../../api/dialogs/dialogsManager"
import {FileAPI} from "../../../../api/fileAPI"
import {getPeerName} from "../../../../api/dialogs/util"
import {MessageComponent} from "./message"

export class MessageListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super()
    }

    data() {
        return {
            messagesSlice: false,
            isLoading: true
        }
    }

    fetchHistory() {

        this.reactive.isLoading = true

        if (!DialogsManager.isFetching()) {
            const dialogPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

            const peer = PeersManager.find(dialogPeer[0], dialogPeer[1])

            MTProto.invokeMethod("messages.getHistory", {
                peer: PeerAPI.getInput(peer),
                offset_id: 0,
                offset_date: 0,
                add_offset: 0,
                limit: 20,
                max_id: 0,
                min_id: 0,
                hash: 0
            }).then(messagesSlice => {
                console.log("ll")
                this.reactive.peer = peer
                this.reactive.title = getPeerName(peer)
                this.reactive.messagesSlice = messagesSlice
                this.reactive.isLoading = false
                if (peer.photo) {
                    let a = peer.photo.photo_small
                    FileAPI.getPeerPhoto(a, peer, false).then(url => {
                        this.reactive.photo = {
                            url: url
                        }
                    })
                }
            })
        } else {
            // fix loading after page reload
        }
    }

    mounted() {
        console.log("mounted")
        this.fetchHistory()
        AppFramework.Router.onQueryChange(queryParams => {
            if (queryParams.p) {
                this.fetchHistory()
            } else {
                // avoid shit like this!
                this.render()
            }
        })
    }

    h() {
        if (!AppFramework.Router.activeRoute.queryParams.p) {
            return <h1>Select a chat</h1>
        }

        if (this.reactive.isLoading) {
            return <div className="full-size-loader height">
                <progress className="progress-circular big"/>
            </div>
        }
        const data = this.reactive

        return (
            <div id="chat" data-peer={AppFramework.Router.activeRoute.queryParams.p}>
                <div id="topbar">
                    <div className="chat-info">
                        <div className="person">
                            <img src={data.photo.url} className="avatar"/>
                            <div className="content">
                                <div className="top">
                                    <div className="title">{data.title}</div>
                                </div>
                                <div className="bottom">
                                    <div
                                        className="info">online
                                    </div>
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
                        TODO fix that
                        {
                            data.messagesSlice.messages.map(message => {
                                return <MessageComponent constructor={{
                                    message,
                                    messagesSlice: data.messagesSlice
                                }}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
