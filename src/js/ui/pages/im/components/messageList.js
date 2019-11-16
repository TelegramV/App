import {AppFramework} from "../../../framework/framework"
import {FrameworkComponent} from "../../../framework/component"
import PeersManager from "../../../../api/peers/peersManager"
import MessagesManager from "../../../../api/messages/messagesManager"
import {getPeerName} from "../../../../api/dialogs/util"
import {MessageComponent} from "./message"

function onScrollMessages(peer) {
    return event => {
        const $element = event.target
        if ($element.scrollHeight - $element.scrollTop === $element.clientHeight) {
            MessagesManager.fetchNextPage(peer)
        }
    }
}

export class MessageListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super()
        this.isFetching = false
    }

    fetchHistory() {
        if (AppFramework.Router.activeRoute.queryParams.p) {
            const dialogPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")
            this.peer = PeersManager.find(dialogPeer[0], Number(dialogPeer[1]))

            if (!this.peer) {
                this.isFetching = true
                PeersManager.listenPeerInit(dialogPeer[0], Number(dialogPeer[1]), peer => {
                    if (peer._ == dialogPeer[0] && peer.id == dialogPeer[1]) {
                        this.peer = peer
                        this.render()
                        MessagesManager.fetchMessages(this.peer).then(() => {
                            this.isFetching = false
                            this.render()
                        })
                    }
                })
            } else {
                if (MessagesManager.existForPeer(this.peer)) {
                    this.render()
                } else {
                    this.isFetching = true
                    if (this.peer._ == dialogPeer[0] && this.peer.id == dialogPeer[1]) {
                        MessagesManager.fetchMessages(this.peer).then(() => {
                            this.isFetching = false
                            this.render()
                        })
                    }
                }
            }
        } else {
            this.render()
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

        MessagesManager.listenUpdates(() => {
            this.render()
        })
    }

    h() {
        if (!AppFramework.Router.activeRoute.queryParams.p) {
            return <h1>Select a chat</h1>
        }

        if (!this.peer || this.isFetching) {
            return <div className="full-size-loader height">
                <progress className="progress-circular big"/>
            </div>
        }

        return (
            <div id="chat" data-peer={AppFramework.Router.activeRoute.queryParams.p}>
                <div id="topbar">
                    <div className="chat-info">
                        <div className="person">
                            <div
                                className={"avatar " + (!this.peer.photo ? `placeholder-${this.peer.photoPlaceholder.num}` : "")}
                                style={`background-image: url(${this.peer.photo});`}>
                                {!this.peer.photo ? this.peer.photoPlaceholder.text : ""}
                            </div>
                            <div className="content">
                                <div className="top">
                                    <div className="title">{getPeerName(this.peer)}</div>
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
                <div id="bubbles" onScroll={onScrollMessages(this.peer)}>
                    <div id="bubbles-inner">
                        <div class="service">
                            <div class="service-msg">October 21</div>
                        </div>
                        {
                            MessagesManager.allForPeer(this.peer).map(message => {
                                return <MessageComponent constructor={{
                                    message,
                                }}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
