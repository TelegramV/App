import {AppFramework} from "../../../framework/framework"
import {MTProto} from "../../../../mtproto"
import {PeerAPI} from "../../../../api/peerAPI"
import {AppTemporaryStorage} from "../../../../common/storage"
import {dialogPeerMap, findPeerFromDialog} from "./dialog"
import {MessageComponent} from "./message"
import {FrameworkComponent} from "../../../framework/component"

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
            this.reactive.messagesSlice = messagesSlice
            this.reactive.isLoading = false
        })
    }

    h({reactive}) {
        if (!AppFramework.Router.activeRoute.queryParams.p) {
            return <h1>Select a chat</h1>
        }

        if (reactive.isLoading) {
            return <h1>Loading...</h1>
        }

        return (
            <div data-peer={AppFramework.Router.activeRoute.queryParams.p} className="im flex-column">
                <div className="im-header flex-row">
                    <div className="im-header-info flex-row">
                        <img className="im-header-photo round-block"
                             src="https://static10.tgstat.ru/channels/_0/3b/3bdc7810ebf4c3de0646923f39267695.jpg"/>
                        <div className="flex-column">
                            <div className="im-header-name">Saved Messages</div>
                            <div className="im-header-status">Nothing</div>
                        </div>
                    </div>
                    <div className="im-header-options flex-row">
                        <button className="im-header-subscribe">SUBSCRIBE</button>
                        <div className="im-header-button"><img className="full-center"
                                                               src="/static/images/icons/mute_svg.svg"/>
                        </div>
                        <div className="im-header-button"><img className="full-center"
                                                               src="/static/images/icons/search_svg.svg"/>
                        </div>
                        <div className="im-header-button"><img className="full-center"
                                                               src="/static/images/icons/more_svg.svg"/>
                        </div>
                    </div>
                </div>
                <div className="im-background">
                    <div className="im-container flex-column">
                        <div className="im-history flex-column-reverse">
                            {
                                reactive.messagesSlice.messages.map(message => {
                                    return (
                                        <div>
                                            <MessageComponent constructor={{
                                                message,
                                                messagesSlice: reactive.messagesSlice
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
    }
}