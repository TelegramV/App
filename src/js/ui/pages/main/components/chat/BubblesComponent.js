import AppEvents from "../../../../../api/eventBus/AppEvents"
import {isElementInViewport} from "../../../../utils/index"

import MessageComponent from "./../../messages/newMessage"
import Component from "../../../../v/vrdom/Component"
import VRDOM from "../../../../v/vrdom/VRDOM"
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import type {Message} from "../../../../../api/messages/Message"

class BubblesComponent extends Component {

    elements: [string, Element] = {
        $bubblesInner: undefined,
        $loader: undefined,
    }

    state: [string, any] = {
        renderedMessages: new Map(),
        isFetchingNextPage: false,
        isFetching: false,
        messagesWaitingForRendering: new Set()
    }

    intersectionObserver: IntersectionObserver

    init() {
        this.reactive = {
            peer: AppSelectedPeer.Reactive.FireOnly,
        }
    }

    h() {
        return (
            <div id="bubbles" onScroll={this._onScrollBubbles}>
                <div id="bubbles-inner">

                </div>
            </div>
        )
    }

    mounted() {
        this.elements.$bubblesInner = this.$el.querySelector("#bubbles-inner")
        this.elements.$loader = this.$el.parentElement.querySelector("#messages-wrapper-messages-loader")

        function onIntersection(entries) {
            entries.forEach(entry => {
                entry.target.style.opacity = entry.intersectionRatio > 0 ? 1 : 0
            })
        }

        this.intersectionObserver = new IntersectionObserver(onIntersection, {
            root: this.$el,
            rootMargin: "250px",
            threshold: 1.0
        })


        AppEvents.Dialogs.subscribeAny(event => {
            const dialog = event.dialog

            if (dialog && AppSelectedPeer.check(dialog.peer)) {
                if (event.type === "fetchedInitialMessages") {

                    this._appendMessages(event.messages)

                } else if (event.type === "fetchedMessagesNextPage") {

                    this._appendMessages(event.messages)

                } else if (event.type === "newMessage") {
                    if (!this.state.isFetching) {
                        if (isElementInViewport(this._prependMessages([event.message])[0])) {
                            this._markAllAsRead()
                        }
                    } else {
                        this.state.messagesWaitingForRendering.add(event.message)
                    }
                }
            }
        })
    }

    reactiveChanged(key, value, event) {
        // check if selected peer was changed
        if (key === "peer") {
            if (value) {
                if (!this.reactive.peer.full) {
                    this.reactive.peer.fetchFull()
                }

                this._markAllAsRead()
                this._refreshMessages()
            } else {
                this._clearBubbles()
            }
        }
    }

    /**
     * TODO: REWRITE!!!!
     *
     * @param {Message} message
     * @param prepend
     * @private
     * @return {Element|Node|boolean}
     */
    _renderMessage(message, prepend = false) {

        if (!this.__.mounted) {
            return
        }

        if (this.state.renderedMessages.has(message.id)) {
            return false
        }

        const $mount = prepend ? VRDOM.prepend : VRDOM.append

        let $message = undefined

        $message = $mount(<MessageComponent intersectionObserver={this.intersectionObserver}
                                            message={message}/>, this.elements.$bubblesInner)

        return $message
    }

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    _appendMessages(messages) {
        for (const message of messages) {
            const $rendered = this._renderMessage(message)

            if ($rendered) {
                this.state.renderedMessages.set(message.id, $rendered)
            }
            // z += this.elements.$bubblesInner.clientHeight - k
        }
        // this.$el.scrollTop += z
    }

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
            const $rendered = this._renderMessage(message, true)

            if ($rendered) {
                this.state.renderedMessages.set(message.id, $rendered)
            }

            pushed.push($rendered)
        }

        if (reset) {
            this.$el.scrollTop = this.elements.$bubblesInner.clientHeight
        }

        return pushed
    }

    _refreshMessages() {
        this.state.isFetching = true
        this._toggleMessagesLoader(false)
        this._clearBubbles()

        this.reactive.peer.api.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
            this.state.isFetching = false
            this.state.messagesWaitingForRendering.forEach(message => {
                this._prependMessages([message])
            })
            this.state.messagesWaitingForRendering.clear()
        })
    }

    _clearBubbles() {
        this.state.renderedMessages.clear()

        VRDOM.deleteInner(this.elements.$bubblesInner)
    }

    _markAllAsRead() {
        // if (this.reactive.peer) {
        return this.reactive.peer.api.readAllHistory()
        // }
    }

    _onScrollBubbles(event) {
        const $element = event.target
        const $bi = this.elements.$bubblesInner

        if ($element.scrollTop === 0 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this._toggleMessagesLoader(false)

            this.reactive.peer.api.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
                this._toggleMessagesLoader(true)
            })

        } else if ($bi) {
            const minel = $bi.childNodes.length > 10 ? 10 : $bi.childNodes.length

            // if (isElementInViewport($bi.childNodes[minel])) {
            //     this._markAllAsRead()
            // }
        }
    }

    _toggleMessagesLoader(hide = true) {
        if (this.elements.$loader) {
            if (hide) {
                this.elements.$loader.style.display = "none"
            } else {
                this.elements.$loader.style.display = ""
            }
        }
    }
}

export default BubblesComponent