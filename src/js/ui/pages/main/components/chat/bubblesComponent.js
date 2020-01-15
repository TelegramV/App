import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"
import AppEvents from "../../../../../api/eventBus/appEvents"
import VDOM from "../../../../framework/vdom"
import ImageMessageComponent from "./message/imageMessageComponent"
import {FileAPI} from "../../../../../api/fileAPI"
import TextMessageComponent from "./message/textMessageComponent"
import {isElementInViewport} from "../../../../framework/utils"

/**
 * WARNING: never patch this component! not manually, not from parent!
 *
 * @property {Node[]|Element[]|undefined[]} elements
 * @property {Node|Element} $el
 */
const BubblesComponent = {
    name: "BubblesInnerComponent",

    reactive: {
        dialog: AppSelectedDialog.Reactive.FireOnly,
    },

    state: {
        /**
         * @var {Array<Node|Element>|[]} renderedMessageElements
         */
        renderedMessageElements: [],
        isFetchingNextPage: false,
    },

    elements: {
        $bubblesInner: undefined,
        $loader: undefined,
    },

    h() {
        return (
            <div id="bubbles" onScroll={this._onScrollBubbles}>
                <div id="bubbles-inner">

                </div>
            </div>
        )
    },

    mounted() {
        this.elements.$bubblesInner = this.$el.querySelector("#bubbles-inner")
        this.elements.$loader = this.$el.parentElement.querySelector("#messages-wrapper-messages-loader")

        AppEvents.Dialogs.listenAny(event => {
            const dialog = event.dialog

            if (AppSelectedDialog.check(dialog)) {
                if (event.type === "fetchedInitialMessages") {
                    this._appendMessages(event.messages)
                } else if (event.type === "fetchedMessagesNextPage") {
                    this._appendMessages(event.messages)
                } else if (event.type === "newMessage") {
                    if (isElementInViewport(this._prependMessages([event.message])[0])) {
                        this._markAllAsRead()
                    }
                } else {

                }
            }
        })
    },

    changed(key, value) {
        // check if selected dialog was changed
        if (key === "dialog") {
            if (value) {
                if (!this.reactive.dialog.peer.full) {
                    this.reactive.dialog.peer.fetchFull()
                }

                this._markAllAsRead()
                this._refreshMessages()
            } else {
                this._clearBubbles()
            }
        }
    },

    /**
     * TODO: REWRITE!!!!
     *
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

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    _appendMessages(messages) {
        let k = this.elements.$bubblesInner.clientHeight

        for (const message of messages) {
            this.state.renderedMessageElements.push(this._renderMessage(message))
        }

        this.$el.scrollTop += this.elements.$bubblesInner.clientHeight - k
    },

    /**
     * @param {Array<Message>} messages
     * @private
     */
    _prependMessages(messages) {
        let reset = false

        if (this.elements.$bubblesInner.clientHeight - (this.$el.scrollTop + this.$el.clientHeight) < 50) {
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
            this.$el.scrollTop = this.elements.$bubblesInner.clientHeight
        }

        return pushed
    },

    _refreshMessages() {
        this._toggleMessagesLoader(false)
        this._clearBubbles()

        this.reactive.dialog.API.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
        })
    },

    _clearBubbles() {
        this.state.renderedMessageElements = []

        while (this.elements.$bubblesInner.firstChild) {
            this.elements.$bubblesInner.firstChild.remove()
        }
    },

    _markAllAsRead() {
        return this.reactive.dialog.API.readAllHistory()
    },

    _onScrollBubbles(event) {
        const $element = event.target
        const $bi = this.elements.$bubblesInner

        if ($element.scrollTop === 0 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this.reactive.dialog.API.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
            })

        } else if ($bi) {
            const minel = $bi.childNodes.length > 10 ? 10 : $bi.childNodes.length

            // if (isElementInViewport($bi.childNodes[minel])) {
            //     this._markAllAsRead()
            // }
        }
    },

    _toggleMessagesLoader(hide = true) {
        if (this.elements.$loader) {
            if (hide) {
                this.elements.$loader.style.display = "none"
            } else {
                this.elements.$loader.style.display = ""
            }
        }
    },
}

export default BubblesComponent