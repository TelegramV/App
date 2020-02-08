import AppEvents from "../../../../../api/eventBus/AppEvents"
import {isElementInViewport} from "../../../../utils/index"

import MessageComponent from "./MessageComponent"
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
        sendingMessages: new Map(),
        renderedGroups: new Map(),
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
            <div id="bubbles" class="scrollable" onScroll={this._onScrollBubbles}>
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
                if (entry.isIntersecting) {
                    entry.target.style.visibility = "visible"

                } else {
                    entry.target.style.visibility = "hidden"

                }
                // entry.target.style.visibility = entry.intersectionRatio > 0 ? "visible" : "hidden"
                // console.log(entry.intersectionRatio > 0 ? "visible" : "hidden", entry.target.id)
                // entry.target.style.display = entry.target.style.display === "none" ? "block" : "none"
            })
        }

        this.intersectionObserver = new IntersectionObserver(onIntersection, {
            root: this.$el,
            rootMargin: "1500px",
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
                } else if (event.type === "sendMessage") {
                    this._prependMessages([event.message], true)
                } else if(event.type === "messageSent") {
                    this._patchSentMessage(event.rawMessage)
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

        if (!this.__.mounted || !AppSelectedPeer.check(message.dialog.peer)) {
            return
        }

        if (this.state.renderedMessages.has(message.id)) {
            return false
        }

        const $mount = prepend ? VRDOM.prepend : VRDOM.append

        let $message = undefined


        if (message.groupedId && this.state.renderedGroups.has(message.groupedId)) {
            return null
        }
        $message = $mount(<MessageComponent intersectionObserver={this.intersectionObserver}
                                            message={message}/>, this.elements.$bubblesInner)

        return $message
    }

    _patchSentMessage(rawMessage) {
        if (!this.state.sendingMessages.has(rawMessage.random_id)) {
            return false
        }
        const $rendered = this.state.sendingMessages.get(rawMessage.random_id)

        this.state.sendingMessages.delete(rawMessage.random_id)
        this.state.renderedMessages.set(rawMessage.id, $rendered)
        $rendered.__component.message.fillRawAndFire(rawMessage)
        $rendered.__component.__patch()
        // VRDOM.patch($rendered, <MessageComponent intersectionObserver={this.intersectionObserver}
        //                                          message={message}/>)
    }

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    _appendMessages(messages) {
        const z = this.$el.scrollTop
        const k = this.elements.$bubblesInner.clientHeight
        for (const message of messages) {
            const $rendered = this._renderMessage(message)

            if ($rendered) {
                this.state.renderedMessages.set(message.id, $rendered)
                if (message.groupedId) {
                    this.state.renderedGroups.set(message.groupedId, message)
                }
            }
        }
        this.$el.scrollTop = z + this.elements.$bubblesInner.clientHeight - k
    }

    /**
     * @param {Array<Message>} messages
     * @param {boolean} isSending
     * @private
     */
    _prependMessages(messages, isSending = false) {
        let reset = false

        if (this.elements.$bubblesInner.clientHeight - (this.$el.scrollTop + this.$el.clientHeight) < 50) {
            reset = true
        }

        const pushed = []

        for (const message of messages) {
            const $rendered = this._renderMessage(message, true)

            if ($rendered) {
                if(isSending) {
                    this.state.sendingMessages.set(message.raw.random_id, $rendered)
                } else {
                    this.state.renderedMessages.set(message.id, $rendered)
                    if (message.groupedId) {
                        this.state.renderedGroups.set(message.groupedId, message)
                    }
                }
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
            this.$el.scrollTop = this.elements.$bubblesInner.clientHeight
        })
    }

    _clearBubbles() {
        this.state.sendingMessages.clear()
        this.state.renderedMessages.clear()
        this.state.renderedGroups.clear()

        VRDOM.deleteInner(this.elements.$bubblesInner)
    }

    _markAllAsRead() {
        // if (this.reactive.peer) {
        return this.reactive.peer.api.readAllHistory()
        // }
    }

    _scrollToMessage(message) {
        this.$el.scrollTo({top: message.offsetTop, behavior: "smooth"})
    }

    _onScrollBubbles(event) {
        const $element = event.target

        if ($element.scrollTop < 300 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this.reactive.peer.api.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
            })

        }
    }

    _toggleMessagesLoader(hide = true) {
        if (this.elements.$loader) {
            if (hide) {
                this.elements.$loader.style.display = "none"
                this.$el.style.height = "100%"
            } else {
                this.elements.$loader.style.display = ""
                this.$el.style.height = "0"
            }
        }
    }
}

export default BubblesComponent