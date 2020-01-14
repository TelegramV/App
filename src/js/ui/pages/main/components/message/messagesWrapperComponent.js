import {Pinned} from "../../../../pinnedController"
import LoaderComponent from "../loading/loader"
import MessagesWrapperChatInfoComponent from "./messagesWrapperChatInfoComponent"
import {AppFramework} from "../../../../framework/framework"
import DialogsManager from "../../../../../api/dialogs/dialogsManager"
import VDOM from "../../../../framework/vdom"
import TextMessageComponent from "./textMessageComponent"
import {Message} from "../../../../../dataObjects/message"
import {FileAPI} from "../../../../../api/fileAPI"
import ImageMessageComponent from "./imageMessageComponent"
import DialogsStore from "../../../../../api/store/dialogsStore"
import AppEvents from "../../../../../api/eventBus/appEvents"
import {isElementInViewport} from "../../../../framework/utils"

export function parseHashQuery() {
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
        renderedMessageElements: [],

        isFetchingNextPage: false,
    },
    /**
     * @property {Element|Node} elements.*
     */
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

        AppEvents.Dialogs.listenAny(event => {
            const dialog = event.dialog

            if (dialog && this.state.dialog && this.state.dialog.type === dialog.type && this.state.dialog.id === dialog.id) {
                if (event.type === "fetchedInitialMessages") {
                    this._appendMessages(event.messages)
                } else if (event.type === "fetchedMessagesNextPage") {
                    this._appendMessages(event.messages)
                } else if (event.type === "newMessage") {
                    if (isElementInViewport(this._prependMessages([event.message])[0])) {
                        this._markAllAsRead()
                    }
                } else {
                    this._resolveDialog(event.dialog)
                }
            }
        })

        AppEvents.Peers.listenAny(event => {
            if (event.type === "updateUserStatus") {
                if (this.state.dialog && this.state.dialog.type === event.peer.type && this.state.dialog.id === event.peer.id) {
                    this._patchChatInfo()
                }
            } else {
                const dialog = event.peer.dialog || DialogsManager.find(event.peer.type, event.peer.id)

                if (dialog && this.state.dialog && this.state.dialog.type === dialog.type && this.state.dialog.id === dialog.id) {
                    if (event.type === "updatePhoto") {
                        this.state.dialog = dialog
                        this._patchChatInfo()
                    } else if (event.type === "updateSingle") {
                        this.state.dialog = dialog
                        this._patchChatInfo()
                    } else if (event.type === "fullLoaded") {
                        this.state.dialog = dialog
                        this._patchChatInfo()
                    } else {
                        Logger.log("PeerUpdates", event)
                    }
                }
            }
        })

        AppFramework.Router.onQueryChange(queryParams => {
            if (queryParams.p) {

                let dialog = undefined

                if (queryParams.p.startsWith("@")) {
                    dialog = DialogsStore.getByUsername(queryParams.p.substring(1))
                } else {
                    const queryPeer = parseHashQuery()
                    dialog = DialogsManager.find(queryPeer.type, queryPeer.id)
                }

                if (dialog) {
                    if (this._resolveDialog(dialog)) {
                        this._markAllAsRead()
                        this._refreshMessages()
                    }
                }

            } else {
                // todo: handle no dialog selected
            }
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

                    return true
                }
            } else {
                const queryPeer = parseHashQuery()
                if (dialog.peer.type === queryPeer.type && dialog.peer.id === queryPeer.id) {
                    this.state.dialog = dialog
                    this._refreshDialog()
                    return true
                }
            }
        }

        return false
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

        this.state.dialog.API.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
        })
    },

    _markAllAsRead() {
        return this.state.dialog.API.readAllHistory()
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

        const pushed = []

        for (const message of messages) {
            // todo sticky date
            // todo push only new
            const rendered = this._renderMessage(message, true)
            this.state.renderedMessageElements.push(rendered)
            pushed.push(rendered)
        }

        if (reset) {
            this.elements.$bubbles.scrollTop = this.elements.$bubblesInner.clientHeight
        }

        return pushed
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
        /**
         * @type {Node|Element}
         */
        const $bi = this.elements.$bubblesInner

        if ($element.scrollTop === 0 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true
            this.state.dialog.API.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
            })
        } else if ($bi) {
            const minel = $bi.childNodes.length > 10 ? 10 : $bi.childNodes.length

            if (isElementInViewport($bi.childNodes[minel])) {
                this._markAllAsRead()
            }
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