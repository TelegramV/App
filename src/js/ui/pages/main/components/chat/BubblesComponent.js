import AppEvents from "../../../../../api/eventBus/AppEvents"
import {isElementInViewport} from "../../../../utils/index"

import MessageComponent from "./MessageComponent"
import VRDOM from "../../../../v/vrdom/VRDOM"
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import type {Message} from "../../../../../api/messages/Message"
import VComponent from "../../../../v/vrdom/component/VComponent"
import UIEvents from "../../../../eventBus/UIEvents";
import AudioManager from "../../../../audioManager";
import {ChannelPeer} from "../../../../../api/peers/objects/ChannelPeer";

const DATA_FORMAT_MONTH_DAY = {
    month: 'long',
    day: 'numeric',
}

// needs rewrite
class BubblesComponent extends VComponent {

    loaderRef = this.props.loaderRef
    bubblesInnerRef = VComponent.createRef()
    chatInputRef = this.props.chatInputRef

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
        E.bus(AppEvents.Peers)
            .on("fetchedInitialMessages", this.onFetchedInitialMessages)
            .on("fetchedMessagesNextPage", this.onFetchedMessagesNextPage)
            .on("fetchedMessagesPrevPage", this.onFetchedMessagesPrevPage)
            .on("fetchedMessagesAnyPage", this.onFetchedMessagesAnyPage)

        E.bus(AppEvents.Dialogs)
            .on("newMessage", this.onNewMessage)
            .on("sendMessage", this.onSendMessage)
            .on("messageSent", this.onMessageSent)
        E.bus(UIEvents.Bubbles)
            .on("showMessage", this.onShowMessage)
            .on("scrollToBottom", this.onScrollToBottom)
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
            rootMargin: "2000px 100px",
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

    onScrollToBottom = message => {
        this.$el.scrollTo({top: this.bubblesInnerRef.$el.clientHeight})
    }

    onShowMessage = message => {
        if (this.messages.rendered.has(message.id)) {
            const $rendered = this.messages.rendered.get(message.id)
            this.scrollToMessage($rendered)
        } else if (!this.messages.isFetchingNextPage && !this.messages.isFetchingPrevPage) {
            this.toggleMessagesLoader(false)
            AppSelectedPeer.Current.messages.clear()
            this.clearBubbles()
            this.messages.isFetchingNextPage = true
            this.messages.isFetchingPrevPage = true
            this.waitingScrollToMessage = message
            this.callbacks.peer.api.fetchByOffsetId({
                offset_id: message.id,
                add_offset: -25,
                limit: 50
            }).then(() => {
                this.messages.isFetchingNextPage = false
                this.messages.isFetchingPrevPage = false
            })
        }
    }

    onFetchedInitialMessages = event => {
        if (AppSelectedPeer.check(event.peer)) {
            this.appendMessages(event.messages)
            if(event.peer instanceof ChannelPeer && !event.peer.canPostMessages) {
                this.chatInputRef.component.hide()
            } else {
                this.chatInputRef.component.show()
            }
        }
    }

    onFetchedMessagesPrevPage = event => {
        if (AppSelectedPeer.check(event.peer)) {
            if (event.messages.length === 0) {
                this.loadedTop = false
                return
            }
            this.prependMessages(event.messages, false, true)
        }
    }

    onFetchedMessagesNextPage = event => {
        if (AppSelectedPeer.check(event.peer)) {
            this.appendMessages(event.messages)
        }
    }

    onFetchedMessagesAnyPage = event => {
        if (AppSelectedPeer.check(event.peer)) {
            this.clearAndAppend(event.messages)
        }
    }

    onNewMessage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            if (!this.loadedTop) {
                if (!this.messages.isFetching) {
                    if (isElementInViewport(this.prependMessages([event.message])[0])) {
                        this.markAllAsRead()
                    } else {
                        if (document.hasFocus()) AudioManager.playNotification("in")
                    }
                } else {
                    this.messages.messagesWaitingForRendering.add(event.message)
                    if (document.hasFocus()) AudioManager.playNotification("in")
                }
            }
        }
    }

    onSendMessage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            // TODO load first page
            if (!this.loadedTop) {
                this.prependMessages([event.message], true)
            }
        }
    }

    onMessageSent = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            AudioManager.playNotification("out")
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

        if (!this.__.mounted || !AppSelectedPeer.check(message.to)) {
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

    changeTails($message, message) {
        const threshold = 60 * 5
        const avatar = $message.__component.avatarRef

        if ($message.previousSibling && $message.previousSibling.__component) {
            const prev = $message.previousSibling.__component
            const $prev = $message.previousSibling
            const from = prev.message.from
            if (from === message.from && Math.abs(prev.message.date - message.date) <= threshold) {
                $prev.classList.remove("upper")
                const username = $prev.querySelector(".username")

                if (username) {
                    username.parentNode.removeChild(username)
                }
                $message.classList.add("hide-tail")
                $message.classList.add("upper")
                avatar.component && avatar.component.hide()
            } else {
                $message.classList.add("upper")
            }

        } else {
            $message.classList.add("upper")
            if ($message.nextSibling && $message.nextSibling.__component) {
                const next = $message.nextSibling.__component
                const $next = $message.nextSibling
                const from = next.message.from
                if (from === message.from && Math.abs(next.message.date - message.date) <= threshold) {
                    $next.classList.add("hide-tail")
                    $message.classList.remove("hide-tail")
                    $message.classList.remove("upper")
                    const username = $message.querySelector(".username")

                    if (username) {
                        username.parentNode.removeChild(username)
                    }

                    const avatarNext = $next.__component.avatarRef

                    avatarNext.component && avatarNext.component.hide()
                } else {
                    $next.classList.add("upper")
                }
            } else {
                $message.classList.add("upper")
            }
        }


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

    sameDay(d1n: number, d2n: number) {
        const d1 = new Date(d1n * 1000)
        const d2 = new Date(d2n * 1000)
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
    }

    clearAndAppend(messages: Message[]) {


        this.appendMessages(messages, false)

        this.toggleMessagesLoader(true)
        this.scrollToWaitedMessage(false)
        this.loadedTop = true
    }

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @param scrollToWaited
     * @private
     */
    appendMessages = (messages, scrollToWaited = true) => {
        const z = this.$el.scrollTop
        const k = this.bubblesInnerRef.$el.clientHeight
        const pushed = []
        for (const message of messages) {
            const all = [...this.messages.rendered.values()]
            const last = all.length > 0 ? all.reduce((l, q) => {
                return l.id < q.id ? l : q
            }) : null

            const $rendered = this.renderMessage(message)

            if (last && last.__component && !this.sameDay(message.date, last.__component.message.date)) {
                const $time = VRDOM.render(<div className="service">
                    <div className="service-msg">{last.__component.message.getDate("en", DATA_FORMAT_MONTH_DAY)}</div>
                </div>)
                this.bubblesInnerRef.$el.insertBefore($time, $rendered)
            }

            if ($rendered) {
                pushed.push($rendered)
                this.messages.rendered.set(message.id, $rendered)
                if (message.groupedId) {
                    this.messages.renderedGroups.set(message.groupedId, message)
                }
            }
        }
        pushed.forEach(l => {
            this.changeTails(l, l.__component.message)
        })
        this.$el.scrollTop = z + this.bubblesInnerRef.$el.clientHeight - k
        if (scrollToWaited) {
            this.scrollToWaitedMessage()
        }
    }

    /**
     * @param {Array<Message>} messages
     * @param {boolean} isSending
     * @param forceNoReset
     * @private
     */
    prependMessages = (messages, isSending = false, forceNoReset = false) => {
        let reset = false

        if (!forceNoReset && this.bubblesInnerRef.$el.clientHeight - (this.$el.scrollTop + this.$el.clientHeight) < 50) {
            reset = true
        }

        const pushed = []

        for (const message of messages) {
            const all = [...this.messages.rendered.values()]
            const first = all.length > 0 ? all.reduce((l, q) => {
                return l.id > q.id ? l : q
            }) : null

            const $rendered = this.renderMessage(message, true)

            if (first && first.__component && !this.sameDay(message.date, first.__component.message.date)) {
                const $time = VRDOM.render(<div className="service">
                    <div className="service-msg">{message.getDate("en", DATA_FORMAT_MONTH_DAY)}</div>
                </div>)
                this.bubblesInnerRef.$el.insertBefore($time, first)
            }

            if ($rendered) {
                if (isSending) {
                    this.messages.sending.set(message.raw.random_id, $rendered)
                } else {
                    this.messages.rendered.set(message.id, $rendered)
                    if (message.groupedId) {
                        this.messages.renderedGroups.set(message.groupedId, message)
                    }
                }
                pushed.push($rendered)
            }

        }

        pushed.forEach(l => {
            this.changeTails(l, l.__component.message)
        })

        if (reset) {
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight
        }
        this.scrollToWaitedMessage()

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

    scrollToWaitedMessage(smooth = true) {
        if (this.waitingScrollToMessage && this.messages.rendered.has(this.waitingScrollToMessage.id)) {
            this.scrollToMessage(this.messages.rendered.get(this.waitingScrollToMessage.id), smooth)
            this.waitingScrollToMessage = null
        }
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

    scrollToMessage = (message, smooth = true) => {
        // todo hightlight
        this.$el.scrollTo({
            top: message.offsetTop + message.clientHeight / 2 - this.$el.clientHeight / 2,
            behavior: smooth ? "smooth" : "auto"
        })
    }

    onScroll = (event) => {
        const $element = event.target

        if (this.loadedTop && !this.messages.isFetchingPrevPage) {
            if ($element.scrollTop > this.bubblesInnerRef.$el.clientHeight - this.$el.clientHeight - 300) {
                this.messages.isFetchingPrevPage = true
                const all = [...this.messages.rendered.keys()]

                this.callbacks.peer.api.fetchPrevPage(all.length > 0 ? all.reduce((l, q) => {
                    return l > q ? l : q
                }) : null).then(() => {
                    this.messages.isFetchingPrevPage = false
                })
            }
        }
        if ($element.scrollTop < 300 && !this.messages.isFetchingNextPage) {
            this.messages.isFetchingNextPage = true

            const all = [...this.messages.rendered.keys()]

            this.callbacks.peer.api.fetchNextPage(all.length > 0 ? all.reduce((l, q) => {
                return l < q ? l : q
            }) : null).then(() => {
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