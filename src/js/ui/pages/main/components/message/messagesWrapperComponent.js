import {Pinned} from "../../../../pinnedController"
import LoaderComponent from "../loading/loader"
import MessagesWrapperChatInfoComponent from "./messagesWrapperChatInfoComponent"
import {AppFramework} from "../../../../framework/framework"
import DialogsManager from "../../../../../api/dialogs/dialogsManager"
import VDOM from "../../../../framework/vdom"
import PeersManager from "../../../../../api/peers/peersManager"
import TextMessageComponent from "./textMessageComponent"
import {MTProto} from "../../../../../mtproto"
import {Message} from "../../../../../dataObjects/message"
import {getPeerNameFromType} from "../../../../../api/dialogs/util"
import {FileAPI} from "../../../../../api/fileAPI"
import ImageMessageComponent from "./imageMessageComponent"

function parseHashQuery() {
    const queryPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

    if (queryPeer.length < 2) {
        throw Error("invalid peer")
    }

    return {type: queryPeer[0], id: parseInt(queryPeer[1])}
}

/**
 * CRITICAL: never rerender this component!
 */
const MessagesWrapperComponent = {
    name: "messages-wrapper-component",
    state: {
        /**
         * @var {Dialog} dialog
         */
        dialog: undefined,
        /**
         * @var {Array<Node|Element>|[]} renderedMessageElements
         */
        renderedMessageElements: []
    },
    elements: {
        $fullLoader: undefined,
        $messagesLoader: undefined,
        $chatInfo: undefined,
        $pinned: undefined,
        $topbar: undefined,
        $bubbles: undefined,
        $bubblesInner: undefined,
        $latestSticky: undefined,
    },
    h() {
        return (
            <div id="chat">
                <LoaderComponent id="messages-wrapper-full-loader" full={true} show={false}/>

                <div id="topbar">
                    <MessagesWrapperChatInfoComponent dialog={this.state.dialog}/>
                    <Pinned/>
                    <div className="btn-icon rp rps tgico-search"/>
                    <div className="btn-icon rp rps tgico-more"/>
                </div>

                <LoaderComponent id="messages-wrapper-messages-loader" full={true} show={true}/>

                <div id="bubbles" onScroll={this._onScrollBubbles.bind(this)}>

                    <div id="bubbles-inner">

                    </div>
                </div>
            </div>
        )
    },
    mounted() {
        this.elements.$topbar = this.$el.querySelector("#topbar")
        this.elements.$fullLoader = this.$el.querySelector("#messages-wrapper-full-loader")
        this.elements.$chatInfo = this.elements.$topbar.querySelector("#messages-wrapper-chat-info")
        this.elements.$pinned = this.elements.$topbar.querySelector("#messages-wrapper-pinned")

        this.elements.$bubbles = this.$el.querySelector("#bubbles")
        this.elements.$bubblesInner = this.elements.$bubbles.querySelector("#bubbles-inner")
        this.elements.$messagesLoader = this.$el.querySelector("#messages-wrapper-messages-loader")

        DialogsManager.listenUpdates(event => {
            const dialog = event.dialog
            if (dialog && this.state.dialog && this.state.dialog.type === dialog.type && this.state.dialog.id === dialog.id) {
                if (event.type === "fetchedInitialMessages") {
                    this._appendMessages(event.messages)
                } else if (event.type === "fetchedMessagesNextPage") {
                    this._appendMessages(event.messages)
                } else {
                    this._resolveDialog(event.dialog)
                }
            }
        })

        PeersManager.listenUpdates(event => {
            const dialog = event.peer.dialog || DialogsManager.find(event.peer.type, event.peer.id)

            if (dialog && this.state.dialog && this.state.dialog.type === dialog.type && this.state.dialog.id === dialog.id) {
                if (event.type === "updatePhoto") {
                    this.state.dialog = dialog
                    this._patchChatInfo()
                } else if (event.type === "fullLoaded") {
                    this.state.dialog = dialog
                    this._patchChatInfo()
                } else {
                    Logger.log("PeerUpdates", event)
                }
            }
        })

        AppFramework.Router.onQueryChange(queryParams => {
            if (queryParams.p) {

                let dialog = undefined

                if (queryParams.p.startsWith("@")) {
                    dialog = DialogsManager.findByUsername(queryParams.p.substring(1))
                } else {
                    const queryPeer = parseHashQuery()
                    dialog = DialogsManager.find(queryPeer.type, queryPeer.id)
                }

                if (dialog) {
                    this._resolveDialog(dialog)
                    this._refreshMessages()
                }

            } else {
                // todo: handle no dialog selected
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateShortMessage", async update => {
            const peer = PeersManager.find("user", update.user_id)

            if (peer && this.state.dialog && this.state.dialog.peer.type === peer.type && this.state.dialog.peer.id === peer.id) {
                const message = new Message(this.state.dialog, update)

                this._prependMessages([message])
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateShortChatMessage", async update => {
            const peer = PeersManager.find("chat", update.chat_id)

            if (peer && this.state.dialog && this.state.dialog.peer.type === peer.type && this.state.dialog.peer.id === peer.id) {
                const message = new Message(this.state.dialog, update)

                this._prependMessages([message])
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateNewMessage", update => {
            let peer = undefined

            if (update.message.pFlags.out && update.message.to_id) {
                const peerName = getPeerNameFromType(update.message.to_id._)
                peer = PeersManager.find(peerName, update.message.to_id[`${peerName}_id`])
            } else {
                peer = PeersManager.find("user", update.message.from_id)
            }

            if (peer && this.state.dialog && this.state.dialog.peer.type === peer.type && this.state.dialog.peer.id === peer.id) {
                const message = new Message(this.state.dialog, update.message)

                this._prependMessages([message])
            }
        })


        MTProto.UpdatesManager.listenUpdate("updateNewChannelMessage", update => {
            const peer = PeersManager.find("channel", update.message.to_id.channel_id)

            if (peer && this.state.dialog && this.state.dialog.peer.type === peer.type && this.state.dialog.peer.id === peer.id) {
                const message = new Message(this.state.dialog, update.message)

                this._prependMessages([message])
            }
        })

        MTProto.UpdatesManager.listenUpdate("updateDeleteChannelMessages", update => {
            // const peer = PeersManager.find("channel", update.channel_id)

            // if (peer && this.state.dialog && this.state.dialog.peer.type === peer.type && this.state.dialog.peer.id === peer.id) {
            //     if (update.messages.indexOf(dialog.lastMessage.id) > -1) {
            //         this.fetchPlainPeerDialogs({
            //             _: dialog.peer.type,
            //             id: dialog.peer.id,
            //             access_hash: dialog.peer.peer.access_hash
            //         })
            //     }
            // }
        })
    },

    /**
     * @param {Dialog} dialog
     * @private
     */
    _resolveDialog(dialog) {
        if (AppFramework.Router.activeRoute.queryParams.p) {
            if (AppFramework.Router.activeRoute.queryParams.p.startsWith("@")) {
                if (dialog.peer.username === AppFramework.Router.activeRoute.queryParams.p.substring(1)) {
                    this.state.dialog = dialog
                    this._refreshDialog()
                }
            } else {
                const queryPeer = parseHashQuery()
                if (dialog.peer.type === queryPeer.type && dialog.peer.id === queryPeer.id) {
                    this.state.dialog = dialog
                    this._refreshDialog()
                }
            }
        }
    },

    _clearBubbles() {
        this.state.renderedMessageElements = []

        while (this.elements.$bubblesInner.firstChild) {
            this.elements.$bubblesInner.firstChild.remove()
        }
    },

    _refreshMessages() {
        this._toggleMessagesLoader(false)
        this._clearBubbles()

        this.state.dialog.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
        })
    },

    __sticky_isOtherDay(date1, date2) {
        // fixme
        if (!date1 || !date2) return false

        return date1.getFullYear() !== date2.getFullYear() || date1.getMonth() !== date2.getMonth() || date1.getDay() !== date2.getDay()
    },

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    _appendMessages(messages) {
        // if (this.elements.$latestSticky && !this.__sticky_isOtherDay(messages[0].date, this.elements.$latestSticky.date)) {
        //     this.elements.$latestSticky.elem.parentElement.removeChild(this.elements.$latestSticky.elem)
        // }

        let latest = null
        let final = null

        let k = this.elements.$bubblesInner.clientHeight

        for (const message of messages) {
            // if (latest && this.__sticky_isOtherDay(message.date, latest.date)) {
            //     VDOM.appendToReal(<StickyDateComponent message={message}/>, this.elements.$bubblesInner)
            //
            //     final = latest.date
            //     latest = null
            // }
            //
            // if (!latest) {
            //     latest = message
            // }

            this.state.renderedMessageElements.push(this._renderMessage(message))
        }

        // if (latest) {
        //     VDOM.appendToReal(<StickyDateComponent message={latest}/>, this.elements.$bubblesInner)
        //
        //     final = latest.date
        //     latest = null
        // }
        //
        // const all = document.querySelectorAll(".date.service")
        //
        // this.elements.$latestSticky = {
        //     elem: all[all.length - 1],
        //     date: final
        // }

        this.elements.$bubbles.scrollTop += this.elements.$bubblesInner.clientHeight - k
    },

    /**
     * @param {Array<Message>} messages
     * @private
     */
    _prependMessages(messages) {
        // if($latestSticky && !isOtherDay(messages[messages.length - 1].time, $latestSticky.date)) {
        //     $latestSticky.elem.parentElement.removeChild($latestSticky.elem)
        // }
        let reset = false

        if (this.elements.$bubblesInner.clientHeight - (this.elements.$bubbles.scrollTop + this.elements.$bubbles.clientHeight) < 50) {
            reset = true
        }

        for (const message of messages) {
            // todo sticky date
            // todo push only new
            this.state.renderedMessageElements.push(this._renderMessage(message, true))
        }

        if (reset) {
            this.elements.$bubbles.scrollTop = this.elements.$bubblesInner.clientHeight
        }
    },

    /**
     * @param {Message} message
     * @param prepend
     * @private
     * @return {Element|Node}
     */
    _renderMessage(message, prepend = false) {
        const $mount = prepend ? VDOM.prependToReal : VDOM.appendToReal
        let $message = undefined

        if (message.media) {
            if (message.media.photo) {
                $message = $mount(<ImageMessageComponent message={message} image={false}/>, this.elements.$bubblesInner)

                FileAPI.photoThumnail(message.media.photo, data => {
                    console.log("patching", data, $message)
                    VDOM.patchReal($message, <ImageMessageComponent message={message} image={{
                        imgSrc: data.src,
                        imgSize: data.size,
                        thumbnail: data.thumbnail
                    }}/>)
                })

            } else {
                $message = $mount(<TextMessageComponent message={message}/>, this.elements.$bubblesInner)
            }
        } else {
            $message = $mount(<TextMessageComponent message={message}/>, this.elements.$bubblesInner)
        }

        return $message
    },

    _refreshDialog() {
        if (this.state.dialog) {
            this._patchChatInfo()
            if (!this.state.dialog.peer.full) {
                this.state.dialog.peer.fetchFull()
            }
        } else {

        }
    },

    _patchChatInfo() {
        VDOM.patchReal(this.elements.$chatInfo, <MessagesWrapperChatInfoComponent dialog={this.state.dialog}/>)
    },

    _onScrollBubbles(event) {
        const $element = event.target

        if ($element.scrollTop === 0) {
            this.state.dialog.fetchNextPage()
        }
    },

    _toggleFullLoader(hide = true) {
        if (hide) {
            this.elements.$fullLoader.style.display = "none"
            this.elements.$topbar.style.display = ""
            this.elements.$bubbles.style.display = ""
        } else {
            this.elements.$topbar.style.display = "none"
            this.elements.$bubbles.style.display = "none"
            this.elements.$fullLoader.style.display = ""
        }
    },

    _toggleMessagesLoader(hide = true) {
        if (hide) {
            this.elements.$messagesLoader.style.display = "none"
        } else {
            this.elements.$messagesLoader.style.display = ""
        }
    },
}

export default MessagesWrapperComponent