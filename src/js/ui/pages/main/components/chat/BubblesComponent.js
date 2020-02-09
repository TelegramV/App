import AppEvents from "../../../../../api/eventBus/AppEvents"
import {isElementInViewport} from "../../../../utils/index"

import MessageComponent from "./MessageComponent"
import VRDOM from "../../../../v/vrdom/VRDOM"
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import type {Message} from "../../../../../api/messages/Message"
import VComponent from "../../../../v/vrdom/component/VComponent"

// needs rewrite
class BubblesComponent extends VComponent {

    loaderRef = this.props.loaderRef
    bubblesInnerRef = VComponent.createRef()

    messages = {
        rendered: new Map(),
        sending: new Map(),
        renderedGroups: new Map(),
        isFetching: false,
        isFetchingNextPage: false,
        isFetchingPrevPage: false,
        messagesWaitingForRendering: new Set()
    }

    intersectionObserver: IntersectionObserver

    init() {
        this.callbacks = {
            peer: AppSelectedPeer.Reactive.FireOnly,
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("fetchedInitialMessages", this.onFetchedInitialMessages)
            .on("fetchedMessagesNextPage", this.onFetchedMessagesNextPage)
            .on("newMessage", this.onNewMessage)
            .on("sendMessage", this.onSendMessage)
            .on("messageSent", this.onMessageSent)
    }

    h() {
        return (
            <div id="bubbles" class="scrollable">
                <div ref={this.bubblesInnerRef} id="bubbles-inner"/>
            </div>
        )
    }

    mounted() {
        this.$el.addEventListener("scroll", this.onScroll, {
            passive: true
        })

        this.intersectionObserver = new IntersectionObserver(this.onIntersection, {
            root: this.$el,
            rootMargin: "1500px",
            threshold: 1.0
        })
    }

    callbackChanged(key: string, value) {
        if (key === "peer") {
            if (value) {
                if (!this.callbacks.peer.full) {
                    this.callbacks.peer.fetchFull()
                }

                this.markAllAsRead()
                this.refreshMessages()
            } else {
                this.clearBubbles()
            }
        }
    }

    onFetchedInitialMessages = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            this.appendMessages(event.messages)
        }
    }

    onFetchedMessagesNextPage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            this.appendMessages(event.messages)
        }
    }

    onNewMessage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            if (!this.messages.isFetching) {
                if (isElementInViewport(this.prependMessages([event.message])[0])) {
                    this.markAllAsRead()
                }
            } else {
                this.messages.messagesWaitingForRendering.add(event.message)
            }
        }
    }

    onSendMessage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            this.prependMessages([event.message], true)
        }
    }

    onMessageSent = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            this.patchSentMessage(event.rawMessage)
        }
    }

    onIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = "visible"
            } else {
                entry.target.style.visibility = "hidden"
            }
        })
    }


    /**
     * TODO: REWRITE!!!!
     *
     * @param {Message} message
     * @param prepend
     * @private
     * @return {Element|Node|boolean}
     */
    renderMessage = (message, prepend = false) => {

        if (!this.__.mounted || !AppSelectedPeer.check(message.dialog.peer)) {
            return
        }

        if (this.messages.rendered.has(message.id)) {
            return false
        }

        const $mount = prepend ? VRDOM.prepend : VRDOM.append

        let $message = undefined


        if (message.groupedId && this.messages.renderedGroups.has(message.groupedId)) {
            return null
        }
        $message = $mount(<MessageComponent intersectionObserver={this.intersectionObserver}
                                            message={message}/>, this.bubblesInnerRef.$el)

        return $message
    }

    patchSentMessage = (rawMessage) => {
        if (!this.messages.sending.has(rawMessage.random_id)) {
            return false
        }
        const $rendered = this.messages.sending.get(rawMessage.random_id)

        this.messages.sending.delete(rawMessage.random_id)
        this.messages.rendered.set(rawMessage.id, $rendered)
        $rendered.__component.message.fillRawAndFire(rawMessage)
        $rendered.__component.__patch()
    }

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    appendMessages = (messages) => {
        const z = this.$el.scrollTop
        const k = this.bubblesInnerRef.$el.clientHeight
        for (const message of messages) {
            const $rendered = this.renderMessage(message)

            if ($rendered) {
                this.messages.rendered.set(message.id, $rendered)
                if (message.groupedId) {
                    this.messages.renderedGroups.set(message.groupedId, message)
                }
            }
        }
        this.$el.scrollTop = z + this.bubblesInnerRef.$el.clientHeight - k
    }

    /**
     * @param {Array<Message>} messages
     * @param {boolean} isSending
     * @private
     */
    prependMessages = (messages, isSending = false) => {
        let reset = false

        if (this.bubblesInnerRef.$el.clientHeight - (this.$el.scrollTop + this.$el.clientHeight) < 50) {
            reset = true
        }

        const pushed = []

        for (const message of messages) {
            const $rendered = this.renderMessage(message, true)

            if ($rendered) {
                if (isSending) {
                    this.messages.sending.set(message.raw.random_id, $rendered)
                } else {
                    this.messages.rendered.set(message.id, $rendered)
                    if (message.groupedId) {
                        this.messages.renderedGroups.set(message.groupedId, message)
                    }
                }
            }

            pushed.push($rendered)
        }

        if (reset) {
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight
        }

        return pushed
    }

    refreshMessages = () => {
        this.messages.isFetching = true
        this.toggleMessagesLoader(false)
        this.clearBubbles()

        this.callbacks.peer.api.fetchInitialMessages().then(messages => {
            this.toggleMessagesLoader(true)
            this.messages.isFetching = false
            this.messages.messagesWaitingForRendering.forEach(message => {
                this.prependMessages([message])
            })
            this.messages.messagesWaitingForRendering.clear()
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight
        })
    }

    clearBubbles = () => {
        this.messages.sending.clear()
        this.messages.rendered.clear()
        this.messages.renderedGroups.clear()

        VRDOM.deleteInner(this.bubblesInnerRef.$el)
    }

    markAllAsRead = () => {
        // if (this.callbacks.peer) {
        return this.callbacks.peer.api.readAllHistory()
        // }
    }

    scrollToMessage = (message) => {
        this.$el.scrollTo({top: message.offsetTop, behavior: "smooth"})
    }

    onScroll = (event) => {
        const $element = event.target

        if ($element.scrollTop < 300 && !this.messages.isFetchingNextPage) {
            this.messages.isFetchingNextPage = true

            this.callbacks.peer.api.fetchNextPage().then(() => {
                this.messages.isFetchingNextPage = false
            })

        }
    }

    toggleMessagesLoader = (hide = true) => {
        if (this.loaderRef) {
            if (hide) {
                this.loaderRef.$el.style.display = "none"
                this.$el.style.height = "100%"
            } else {
                this.loaderRef.$el.style.display = ""
                this.$el.style.height = "0"
            }
        }
    }
}

export default BubblesComponent