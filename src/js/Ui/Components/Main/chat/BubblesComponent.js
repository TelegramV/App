import AppEvents from "../../../../Api/EventBus/AppEvents"
import {isElementInViewport} from "../../../Utils/isElementInViewport"

import MessageComponent from "./MessageComponent"
import VRDOM from "../../../../V/VRDOM/VRDOM"
import AppSelectedPeer from "../../../Reactive/SelectedPeer"
import type {Message} from "../../../../Api/Messages/Message"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../EventBus/UIEvents";
import AudioManager from "../../../Fuck/audioManager";
import {ChannelPeer} from "../../../../Api/Peers/Objects/ChannelPeer";
import {SupergroupPeer} from "../../../../Api/Peers/Objects/SupergroupPeer";
import {MessageAvatarComponent} from "./message/common/MessageAvatarComponent";
import {UserPeer} from "../../../../Api/Peers/Objects/UserPeer";
import {ServiceMessage} from "../../../../Api/Messages/Objects/ServiceMessage";
import MTProto from "../../../../MTProto/external";
import {ChatInputComponent} from "./chatInput/ChatInputComponent"

const DATA_FORMAT_MONTH_DAY = {
    month: 'long',
    day: 'numeric',
}

// needs rewrite
class BubblesComponent extends VComponent {

    loaderRef = this.props.loaderRef
    bubblesInnerRef = VComponent.createRef()
    _chatInput: ChatInputComponent

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
            .on("showMessageInstant", this.onShowMessageInstant)
            .on("scrollToBottom", this.onScrollToBottom)

        E.bus(UIEvents.RightSidebar)
            .on("show", this.onRightSidebarShow)
            .on("hide", this.onRightSidebarHide)
    }

    onRightSidebarShow = l => {
        this.$el.parentNode.classList.add("right-bar-open")
        this.rightSidebarOpen = true
    }

    onRightSidebarHide = l => {
        this.$el.parentNode.classList.remove("right-bar-open")
        this.rightSidebarOpen = false
    }

    render() {
        return (
            <div id="bubbles" class="scrollable">
                <div ref={this.bubblesInnerRef} id="bubbles-inner"/>
            </div>
        )
    }

    get chatInput() {
        if (!this._chatInput) {
            this._chatInput = VComponent.getComponentById(`chat-input`)
        }

        return this._chatInput
    }

    componentDidMount() {

        this.$el.addEventListener("scroll", this.onScroll, {
            passive: false
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

                if (!this.showInstant) {
                    this.toggleMessagesLoader(true)
                    this.refreshMessages()
                } else {
                    if ((AppSelectedPeer.Current instanceof ChannelPeer && !(AppSelectedPeer.Current instanceof SupergroupPeer)) && !AppSelectedPeer.Current.canPostMessages) {
                        this.chatInput.hide()
                    } else {
                        this.chatInput.show()
                    }
                    this.showInstant = false
                }
            } else {
                this.clearBubbles()
            }
        }
    }

    onScrollToBottom = message => {
        if (this.isEnd) {
            this.$el.scrollTo({top: this.bubblesInnerRef.$el.clientHeight})
        } else {
            // TODO load end messages and scroll to bottom
        }
    }

    onShowMessageInstant = message => {
        this.showInstant = true
        let to = message.to
        if (message.to instanceof UserPeer) {
            if (message.to.id === MTProto.getAuthorizedUser().user.id) {
                to = message.from
            }
        }
        AppSelectedPeer.select(to)
        this.onShowMessage(message)
    }

    onShowMessage = message => {
        if (this.messages.rendered.has(message.id)) {
            const $rendered = this.messages.rendered.get(message.id)
            this.scrollToMessage($rendered)
        } else if (!this.messages.isFetchingNextPage && !this.messages.isFetchingPrevPage) {
            this.toggleMessagesLoader(false)
            AppSelectedPeer.Current.messages.clear()
            this.clearBubbles()
            this.isEnd = false
            this.messages.isFetchingNextPage = true
            this.messages.isFetchingPrevPage = true
            this.waitingScrollToMessage = message.id
            this.callbacks.peer.api.fetchByOffsetId({
                offset_id: message.id,
                add_offset: -25,
                limit: 50
            }).then(() => {
                this.messages.isFetchingNextPage = false
                this.messages.isFetchingPrevPage = false
                this.showInstant = false
            })
        }
    }

    onFetchedInitialMessages = event => {
        if (AppSelectedPeer.check(event.peer)) {
            this.isEnd = true
            this.appendMessages(event.messages)
        }
    }

    onFetchedMessagesPrevPage = event => {
        if (AppSelectedPeer.check(event.peer)) {
            if (event.isEnd) {
                this.isEnd = true
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
            this.isEnd = false
            this.clearAndAppend(event.messages)
        }
    }

    onNewMessage = event => {
        if (AppSelectedPeer.check(event.dialog.peer)) {
            if (this.isEnd) {
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

        const isOut = !message.isPost && message.isOut

        let $group = message instanceof ServiceMessage ? null : this.bubblesInnerRef.$el.childNodes[!prepend ? this.bubblesInnerRef.$el.childNodes.length - 1 : 0]
        if ($group) {
            const $bubblesList = $group.querySelector(".bubbles-list")
            let $otherMessage = $bubblesList.childNodes[!prepend ? $bubblesList.childNodes.length - 1 : 0]

            if ($otherMessage) {
                let prev = $otherMessage.__v.component
                if (prev.message instanceof ServiceMessage) {
                    $group = null
                } else {
                    const from = prev.message.from
                    const threshold = 60 * 5

                    if (from === message.from && Math.abs(prev.message.date - message.date) <= threshold) {

                    } else {
                        $group = null
                    }
                }
            }
        }
        const msg = <MessageComponent
            intersectionObserver={this.intersectionObserver}
            message={message}/>

        if (message.to && message.to.messages.last && message.id === message.to.messages.last.id) {
            message.to.api.readAllHistory()
        } else {
            if (message === this.bubblesInnerRef.$el.firstChild && !message.isInRead) {
                message.read()
            }
        }

        if ($group) {
            return (!prepend ? VRDOM.prepend : VRDOM.append)(msg, $group.querySelector(".bubbles-list"))
        } else {
            // TODO fix saved messages
            const hideAvatar = isOut || message.isPost || message.to instanceof UserPeer || message instanceof ServiceMessage
            const avatar = !hideAvatar ? <MessageAvatarComponent id={`message-${message.id}-avatar`}
                                                                 show={!hideAvatar}
                                                                 message={message}/> : ""
            $message = $mount(<div className={["bubble-group", isOut ? "out" : "in"]}>{avatar}
                <div className="bubbles-list">{msg}</div>
            </div>, this.bubblesInnerRef.$el)
            const $bubblesList = $message.querySelector(".bubbles-list")
            return $bubblesList.childNodes[!prepend ? $bubblesList.childNodes.length - 1 : 0]
        }
    }

    patchSentMessage = (rawMessage) => {
        if (!this.messages.sending.has(rawMessage.random_id)) {
            return false
        }
        const $rendered = this.messages.sending.get(rawMessage.random_id)

        this.messages.sending.delete(rawMessage.random_id)
        this.messages.rendered.set(rawMessage.id, $rendered)
        $rendered.__v.component.message.fillRawAndFire(rawMessage)
        $rendered.__v.component.forceUpdate()
    }

    sameDay(d1n: number, d2n: number) {
        const d1 = new Date(d1n * 1000)
        const d2 = new Date(d2n * 1000)
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
    }

    clearAndAppend(messages: Message[]) {


        this.appendMessages(messages, false, true)

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
    appendMessages = (messages, scrollToWaited = true, showNewBadge = false) => {
        const z = this.$el.scrollTop
        const k = this.bubblesInnerRef.$el.clientHeight
        const pushed = []
        let i = 0
        for (const message of messages) {
            const all = [...this.messages.rendered.keys()]
            const last = all.length > 0 ? this.messages.rendered.get(all.reduce((l, q) => {
                return l < q ? l : q
            })) : null

            if (message.groupedId) {
                const isNotReady = messages.slice(i, messages.length).every(l => {
                    return l.groupedId === message.groupedId
                })
                if (isNotReady) {
                    break
                }
            }


            // if (showNewBadge && message.to && message.id === message.to.messages.readInboxMaxId) {
            //     VRDOM.append(<div className="service" css-padding-top="100px">
            //         <div className="service-msg">New Messages</div>
            //     </div>, this.bubblesInnerRef.$el)
            // }

            const $rendered = this.renderMessage(message)

            if ($rendered && last && last.__v.component && !this.sameDay(message.date, last.__v.component.message.date)) {
                const $time = VRDOM.render(<div className="service">
                    <div className="service-msg">{last.__v.component.message.getDate("en", DATA_FORMAT_MONTH_DAY)}</div>
                </div>)
                this.bubblesInnerRef.$el.insertBefore($time, $rendered.parentNode.parentNode)
            }

            if ($rendered) {
                pushed.push($rendered)
                this.messages.rendered.set(message.id, $rendered)
                if (message.groupedId) {
                    this.messages.renderedGroups.set(message.groupedId, message)
                }
            }
            i++
        }

        // console.log("append! after, scrollTop=", this.$el.scrollTop, "height=", this.bubblesInnerRef.$el.clientHeight, "scrollToWaited=", scrollToWaited, this.waitingScrollToMessage)

        if (this.$el.scrollTop === 0) {
            this.$el.scrollTop = z + this.bubblesInnerRef.$el.clientHeight - k
        }
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

        let i = 0
        for (const message of messages) {
            const all = [...this.messages.rendered.keys()]
            const first = all.length > 0 ? this.messages.rendered.get(all.reduce((l, q) => {
                return l > q ? l : q
            })) : null

            if (message.groupedId) {
                const isNotReady = messages.slice(i, messages.length).every(l => {
                    return l.groupedId === message.groupedId
                })
                if (isNotReady) {
                    break
                }
            }

            const $rendered = this.renderMessage(message, true)

            if ($rendered && first && first.__v.component && !this.sameDay(message.date, first.__v.component.message.date)) {
                const $time = VRDOM.render(<div className="service">
                    <div className="service-msg">{message.getDate("en", DATA_FORMAT_MONTH_DAY)}</div>
                </div>)
                this.bubblesInnerRef.$el.insertBefore($time, first.parentNode.parentNode)
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

            i++
        }

        if (reset) {
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight
        }
        this.scrollToWaitedMessage()

        return pushed
    }

    refreshMessages = () => {
        console.log("refreshMessages")

        if ((AppSelectedPeer.Current instanceof ChannelPeer && !(AppSelectedPeer.Current instanceof SupergroupPeer)) && !AppSelectedPeer.Current.canPostMessages) {
            this.chatInput.hide()
        } else {
            this.chatInput.show()
        }

        if (AppSelectedPeer.Current.messages.unreadCount > 0) {
            const maxUnread = AppSelectedPeer.Current.messages.readInboxMaxId
            if (this.messages.rendered.has(maxUnread)) {
                const $rendered = this.messages.rendered.get(maxUnread)
                this.scrollToMessage($rendered)
            } else if (!this.messages.isFetchingNextPage && !this.messages.isFetchingPrevPage) {
                this.toggleMessagesLoader(false)
                AppSelectedPeer.Current.messages.clear()
                this.clearBubbles()
                this.isEnd = false
                this.messages.isFetchingNextPage = true
                this.messages.isFetchingPrevPage = true
                this.waitingScrollToMessage = maxUnread
                this.waitingScrollTop = true
                this.callbacks.peer.api.fetchByOffsetId({
                    offset_id: maxUnread,
                    add_offset: -25,
                    limit: 50
                }).then(() => {
                    this.messages.isFetchingNextPage = false
                    this.messages.isFetchingPrevPage = false
                })
            }
            // this.onShowMessageInstant(AppSelectedPeer.Current.messages.get(AppSelectedPeer.Current.))
            return
        }
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
        if (this.waitingScrollToMessage && this.messages.rendered.has(this.waitingScrollToMessage)) {
            let id = this.waitingScrollToMessage
            if (this.waitingScrollTop) {
                id = [...this.messages.rendered.keys()].filter(l => {
                    return l > this.waitingScrollToMessage
                }).reduce((l, q) => {
                    return l < q ? l : q
                })
            }
            this.scrollToMessage(this.messages.rendered.get(id), smooth, !!this.waitingScrollTop)
            this.waitingScrollToMessage = null
            this.waitingScrollTop = null
        }
    }

    clearBubbles = () => {
        this.messages.sending.clear()
        this.messages.rendered.clear()
        this.messages.renderedGroups.clear()
        this.chatInput.clear()

        VRDOM.deleteInner(this.bubblesInnerRef.$el)
    }

    markAllAsRead = () => {
        // if (this.callbacks.peer) {
        return this.callbacks.peer.api.readAllHistory()
        // }
    }

    scrollToMessage = (message, smooth = true, top = false) => {
        // todo hightlight
        this.$el.scrollTo({
            top: message.offsetTop + (top ? 0 : message.clientHeight / 2 - this.$el.clientHeight / 2),
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