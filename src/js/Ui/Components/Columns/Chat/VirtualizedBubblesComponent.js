/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import VComponent from "../../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../../Reactive/SelectedChat";
import UIEvents from "../../../EventBus/UIEvents";
import AppEvents from "../../../../Api/EventBus/AppEvents";
import type {Message} from "../../../../Api/Messages/Message";
import vrdom_delete from "../../../../V/VRDOM/delete";
import scrollToAndHighlight from "../../../../Utils/scrollToAndHighlight";
import findIntersection from "../../../Virtual/findIntersection";
import vrdom_deleteInner from "../../../../V/VRDOM/deleteInner";
import VirtualMessages from "../../../Virtual/VirtualMessages";
import scrollBottom from "../../../../Utils/scrollBottom";
import API from "../../../../Api/Telegram/API";
import StatelessComponent from "../../../../V/VRDOM/component/StatelessComponent";
import IntersectionObserver from 'intersection-observer-polyfill';
import GroupMessage from "../../../../Api/Messages/GroupMessage";
import {appendMessages, fixMessages, getMessageElement, prependMessages} from "./messagesUtils";
import {IS_DESKTOP_SCREEN, IS_MOBILE_SCREEN, IS_SAFARI} from "../../../../Utils/browser";

const useIntersectVirtualization = false;//!IS_SAFARI
const useScrollTopHack = IS_SAFARI;

// there is no possibility nor time to calculate each message size
class VirtualizedBubblesComponent extends StatelessComponent {
    bubblesInnerRef = VComponent.createRef();

    isLoadingRecent = false;
    mainVirtual: VirtualMessages = new VirtualMessages();
    secondVirtual: VirtualMessages = new VirtualMessages();

    isUsingSecondVirtual = false;
    actionCount = 0;

    identifier = `bubbles-component`;

    observer: IntersectionObserver;

    get currentVirtual(): VirtualMessages {
        if (this.isUsingSecondVirtual) {
            return this.secondVirtual;
        }

        return this.mainVirtual;
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => AppSelectedChat.check(event.peer))
            .on("messages.recent", this.onPeerMessagesRecent)
            .on("messages.allRecent", this.onPeerMessagesAllRecent)
            .on("messages.nextTopPageDownloaded", this.onTopPageMessagesReady)
            .on("messages.nextBottomPageDownloaded", this.onBottomPageMessagesReady)
            .on("chat.showMessageReady", this.onChatShowMessageReady)
            .on("messages.new", this.onNewMessage);

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
            .on("chat.topMessagesReady", this.onTopPageMessagesReady)
            .on("chat.showMessage", this.onChatShowMessage)
            .on("chat.scrollBottom", this.onChatScrollBottomRequest)
            .on("chat.openedMobile", this.onChatOpenedMobile);

    }

    render() {
        return (
            <div id="bubbles" className="scrollable" css-overflow-anchor={useScrollTopHack ? "none" : "auto"}>
                <div ref={this.bubblesInnerRef} id="bubbles-inner"/>
            </div>
        );
    }

    componentDidMount() {
        if (useIntersectVirtualization) {
            this.observer = new IntersectionObserver(this.onIntersection, {
                root: this.$el,
                // rootMargin: "2200px 100px",
                threshold: 0,
            });
        } else {
            this.observer = new IntersectionObserver(this.onIntersection, {
                root: this.$el,
                rootMargin: "2200px 100px",
                threshold: 1.0,
            });
        }

        this.props.loaderRef.$el.style.display = "none";

        if (!useIntersectVirtualization) {
            this.$el.addEventListener("scroll", this.onScroll, {
                passive: true,
            });

        }
    }

    cleanupTree = () => {
        vrdom_deleteInner(this.bubblesInnerRef.$el);
    };

    refresh = (clearShowMessage = true) => {
        this.cleanupTree();
        this.mainVirtual.refresh();
        this.secondVirtual.refresh();

        this.isLoadingRecent = false;
        this.isUsingSecondVirtual = false;

        if (clearShowMessage) {
            this.isRequestedShowMessage = false;
        }
    };

    onChatOpenedMobile = (event) => {
        if (IS_MOBILE_SCREEN) {
            this.isRequestedShowMessage = event.message;

            if (AppSelectedChat.isSelected) {
                this.isLoadingRecent = true;

                AppSelectedChat.current.messages.fireRecent();
            }
        }
    };

    onChatSelect = (event) => {
        this.refresh();
        // if (event.message) {

        if (IS_DESKTOP_SCREEN) {
            this.isRequestedShowMessage = event.message;

            if (!this.isRequestedShowMessage) {
                if (AppSelectedChat.isSelected) {
                    this.isLoadingRecent = true;

                    AppSelectedChat.current.messages.fireRecent();
                }
            } else {
                this.onChatShowMessage({message: event.message});
            }
        }

        // } else {
        // if (AppSelectedChat.current.messages.readInboxMaxId > AppSelectedChat.current.messages.readOutboxMaxId && AppSelectedChat.current.messages.readInboxMaxId !== AppSelectedChat.current.messages.last?.id) {
        //     const lastUnread = AppSelectedChat.current.messages.getById(AppSelectedChat.current.messages.readInboxMaxId)
        //
        //     if (lastUnread) {
        //         this.isRequestedShowMessage = lastUnread
        //     } else {
        //         const peer = AppSelectedChat.current;
        //         API.messages.getHistory(peer, {
        //             offset_id: AppSelectedChat.current.messages.readInboxMaxId,
        //             limit: 1,
        //         }).then(Messages => {
        //             if (!AppSelectedChat.check(peer)) {
        //                 return;
        //             }
        //
        //             if (Messages.messages.length) {
        //                 const message = peer.messages.putRawMessage(Messages.messages[0]);
        //
        //                 this.isRequestedShowMessage = message;
        //             }
        //
        //             if (AppSelectedChat.isSelected) {
        //                 this.isLoadingRecent = true;
        //
        //                 AppSelectedChat.current.messages.fireRecent();
        //             }
        //
        //         })
        //     }
        // } else {
        //     if (AppSelectedChat.isSelected) {
        //         this.isLoadingRecent = true;
        //
        //         AppSelectedChat.current.messages.fireRecent();
        //     }
        // }
    };

    onChatScrollBottomRequest = () => {
        if (this.isLoadingRecent) {
            return;
        }

        if (this.virtual_isCompletelyBottom()) {
            this.isUsingSecondVirtual = false;
            this.scrollBottom();
        } else {
            this.cleanupTree();
            this.isUsingSecondVirtual = false;
            this.secondVirtual.refresh();
            this.appendMessages(this.mainVirtual.veryBottomPage(), this.mainVirtual.getBeforePageTopOne(), this.mainVirtual.getAfterPageBottomOne());
            this.scrollBottom();
            this.dev_checkTree();
        }
    };

    onScroll = (e) => {
        if (this.justChangedScrollTop) {
            this.justChangedScrollTop = false;
            return;
        }
        const {scrollTop, scrollHeight, clientHeight} = this.$el;
        const magicNumber = useScrollTopHack ? 0 : 400;
        // +400 because otherwise it would load only 2 messages when scrolling down, which is weird
        const isAtBottom = Math.floor(scrollHeight - scrollTop) <= clientHeight + magicNumber;
        const isAtTop = scrollTop <= magicNumber;

        //
        // if(this.smoothScrollingTo != null) {
        //     if(Math.abs(this.smoothScrollingTo - scrollTop) <= 10) {
        //         this.smoothScrollingTo = null
        //     } else {
        //         return
        //     }
        // }

        if (!isAtBottom) {
            UIEvents.General.fire("chat.scrollBottom.show");
        }

        if (isAtTop) {
            this.virtual_onScrolledTop();
        } else if (isAtBottom) {
            if (this.virtual_isCompletelyBottom() || (!this.mainVirtual.hasMoreOnTopToDownload && this.virtual_isCompletelyBottom())) {
                UIEvents.General.fire("chat.scrollBottom.hide");
            }

            this.virtual_onScrolledBottom();
        }
    };

    onPeerMessagesRecent = (event) => {
        this.refresh(false);

        this.mainVirtual.hasMoreOnTopToDownload = true;

        this.mainVirtual.messages = fixMessages(event.messages.slice());

        if (event.messages.length < 100) {
            this.isLoadingRecent = true;
            AppSelectedChat.current.messages.fireAllRecent();
        }

        const vbp = this.mainVirtual.veryBottomPage();

        if (!this.isRequestedShowMessage) {
            this.appendMessages(vbp, this.mainVirtual.getBeforePageTopOne(), this.mainVirtual.getAfterPageBottomOne());
            this.scrollBottom();
        } else if (event.messages.length >= 100) {
            const message = this.isRequestedShowMessage;
            const messageIndex = this.mainVirtual.messages.findIndex(m => m.id === message.id);

            if (messageIndex > -1) {
                this.cleanupTree();

                this.mainVirtual.currentPage = this.mainVirtual.messages
                    .slice(Math.max(messageIndex - this.mainVirtual.edgeSize, 0), messageIndex + this.mainVirtual.edgeSize);

                let messages = this.mainVirtual.currentPage;

                if (messages.length < this.mainVirtual.size) {
                    messages = this.mainVirtual.veryBottomPage();
                }

                this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

                const $message = this.$el.querySelector(`#message-${message.id}`);

                if ($message) {
                    scrollToAndHighlight(this.$el, $message);
                } else {
                    console.warn("No message to scroll found.");
                }
            } else {
                const actionCount = (++this.actionCount);

                API.messages.getHistory(message.dialogPeer, {
                    offset_id: message.id,
                    add_offset: -51,
                    limit: 100
                }).then(Messages => {
                    AppEvents.Peers.fire("chat.showMessageReady", {
                        peer: message.dialogPeer,
                        messages: message.dialogPeer.messages.putRawMessages(Messages.messages),
                        offset_id: message.id,
                        actionCount,
                    });
                });
            }
        }
        if (!AppSelectedChat.current.pinnedMessage) AppSelectedChat.current.findPinnedMessage(); // Можливо десь видалився пін, спробуємо знайти...
    };

    onPeerMessagesAllRecent = event => {
        this.isLoadingRecent = true;
        event.messages = fixMessages(event.messages.slice());
        const lenbeforefuck = this.mainVirtual.currentPage.length;
        this.mainVirtual.messages = [...event.messages, ...this.mainVirtual.messages];
        this.mainVirtual.hasMoreOnTopToDownload = this.mainVirtual.messages.flatMap(message => message instanceof GroupMessage ? Array.from(message.messages) : [message]).length >= 100;
        const vbp = this.mainVirtual.veryBottomPage();
        if (!this.isRequestedShowMessage) {
            this.appendMessages(vbp.slice(0, vbp.length - lenbeforefuck), null, this.mainVirtual.getVeryBottomOne());
            this.scrollBottom();
        } else {
            const message = this.isRequestedShowMessage;
            const messageIndex = this.mainVirtual.messages.findIndex(m => m.id === message.id);

            if (messageIndex > -1) {
                this.cleanupTree();

                this.mainVirtual.currentPage = this.mainVirtual.messages
                    .slice(Math.max(messageIndex - this.mainVirtual.edgeSize, 0), messageIndex + this.mainVirtual.edgeSize);

                let messages = this.mainVirtual.currentPage;

                if (messages.length < this.mainVirtual.size) {
                    messages = this.mainVirtual.veryBottomPage();
                }

                this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

                const $message = this.$el.querySelector(`#message-${message.id}`);

                if ($message) {
                    scrollToAndHighlight(this.$el, $message);
                } else {
                    console.warn("No message to scroll found.");
                }
            } else {
                this.isLoadingRecent = false;
                const actionCount = (++this.actionCount);

                API.messages.getHistory(message.dialogPeer, {
                    offset_id: message.id,
                    add_offset: -51,
                    limit: 100
                }).then(Messages => {
                    AppEvents.Peers.fire("chat.showMessageReady", {
                        peer: message.dialogPeer,
                        messages: message.dialogPeer.messages.putRawMessages(Messages.messages),
                        offset_id: message.id,
                        actionCount,
                    });
                });
            }
        }
        this.isLoadingRecent = false;
    };

    onNewMessage = (event) => {
        const message = event.message;

        if (document.getElementById(`message-${message.id}`)) {
            return;
        }

        if (this.virtual_isCompletelyBottom()) {
            const afterMessage = this.mainVirtual.getVeryBottomOne();

            this.mainVirtual.messages.push(message);
            this.mainVirtual.veryBottomPage();

            const {scrollTop, scrollHeight, clientHeight} = this.$el;
            const isAtBottom = scrollHeight - scrollTop === clientHeight;

            this.prependMessages([message], afterMessage, null);

            if (this.bubblesInnerRef.$el.childElementCount > this.mainVirtual.size) {
                vrdom_delete(this.bubblesInnerRef.$el.lastElementChild);
                this.dev_checkTree();
            }

            this.justChangedScrollTop = true;
            this.$el.style.setProperty("overflow", "hidden");

            if (isAtBottom) {
                this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
            } else {
                this.$el.scrollTop = scrollTop;
            }
            this.$el.style.setProperty("overflow", "");

        } else {
            this.mainVirtual.messages.push(message);
        }
    };

    onChatShowMessage = ({message}) => {
        console.log("onChatSh");

        this.isRequestedShowMessage = null;

        if (this.isLoadingRecent) {
            return;
        }

        if (AppSelectedChat.check(message.to)) {
            let $message = getMessageElement(message);

            if (!$message) {
                const messageIndex = this.mainVirtual.messages.findIndex(m => m.id === message.id);

                if (messageIndex > -1) {
                    this.cleanupTree();

                    const edgeSize = 20;
                    // console.log(messageIndex, messageIndex - this.mainVirtual.edgeSize, messageIndex + this.mainVirtual.edgeSize)
                    this.mainVirtual.currentPage = this.mainVirtual.messages
                        .slice(Math.max(messageIndex - edgeSize, 0), messageIndex + edgeSize);

                    const messages = this.mainVirtual.currentPage;
                    // console.log(messages)

                    this.prependMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

                    $message = this.$el.querySelector(`#message-${message.id}`);
                } else {
                    const peer = AppSelectedChat.current;

                    const actionCount = (++this.actionCount);

                    API.messages.getHistory(peer, {
                        offset_id: message.id,
                        add_offset: -21,
                        limit: 40
                    }).then(Messages => {
                        AppEvents.Peers.fire("chat.showMessageReady", {
                            peer,
                            messages: peer.messages.putRawMessages(Messages.messages),
                            offset_id: message.id,
                            actionCount,
                        });
                    });
                }
            }
            // console.log($message, $message.getBoundingClientRect(), $message.nextSibling, $message.previousSibling)
            // const messageIndex = this.mainVirtual.messages.findIndex(m => m.id === message.id);
            // console.log("lol!", messageIndex, this.mainVirtual.currentPage.length)
            if ($message) {
                // this.smoothScrollingTo = $message.offsetTop + ($message.clientHeight / 2 - this.$el.clientHeight / 2)
                scrollToAndHighlight(this.$el, $message);
            } else {
                console.warn("No message to scroll found.");
            }
        } else {
            console.log('NO SELECT!!!', event);
            const peer = message.dialogPeer;

            AppSelectedChat.select(peer, {message});
        }
    };

    onChatShowMessageReady = event => {
        console.log('SHIWWWWWWW', event);
        if (this.isLoadingRecent) {
            return;
        }

        if (this.actionCount > event.actionCount) {
            return;
        }

        this.cleanupTree();
        this.secondVirtual.refresh();

        this.isUsingSecondVirtual = true;

        let messages = fixMessages(event.messages);

        const intersect = this.mainVirtual.isEmpty() ? -1 : findIntersection(messages, [this.mainVirtual.getVeryTopOne()]);

        if (intersect > -1) {
            console.log("[show message] intersect found");

            messages = messages.slice(0, intersect - 1);

            this.mainVirtual.messages = [...messages, ...this.mainVirtual.messages];

            this.isUsingSecondVirtual = false;

            messages = this.mainVirtual.veryTopPage();
        } else {
            this.secondVirtual.messages.push(...messages);
            messages = this.secondVirtual.veryBottomPage();
        }

        this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());
        // this.patchMessages(messages.reverse(), this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

        const $message = this.$el.querySelector(`#message-${event.offset_id}`);

        if ($message) {
            // this.isBlockingScroll = true;
            scrollToAndHighlight(this.$el, $message);
            // this.isBlockingScroll = false;
        } else {
            console.error("BUG: no message found to scroll");
        }
    };

    virtual_onScrolledTop = () => {
        if (this.isLoadingRecent || this.isBlockingScroll) {
            return;
        }

        // console.log("scrolled top")

        if (this.currentVirtual.isVeryTop()) {
            if (!this.currentVirtual.hasMoreOnTopToDownload) {
                // console.log("!hasMoreOnTopToDownload", this.isUsingSecondVirtual);
            }

            if (this.currentVirtual.isDownloading) {
                // console.log("isDownloading", this.isUsingSecondVirtual);
            }

            if (this.currentVirtual.hasMoreOnTopToDownload && !this.currentVirtual.isDownloading) {
                console.log(this.currentVirtual.isEmpty());
                if (!this.currentVirtual.isEmpty()) {
                    this.currentVirtual.isDownloading = true;

                    // console.log("[top] downloading");

                    AppSelectedChat.current.messages.downloadNextTopPage(this.currentVirtual.getVeryTopOne().id, {
                        isUsingSecondVirtual: this.isUsingSecondVirtual
                    });
                }
            }

            return;
        }

        const messages = this.currentVirtual.nextTop();

        if (this.currentVirtual.currentPage.length > messages.length) {
            for (let i = 0; i < messages.length; i++) {
                vrdom_delete(this.bubblesInnerRef.$el.firstChild);
            }
        }

        let $first: HTMLElement = this.bubblesInnerRef.$el.lastElementChild;

        let k = 0;
        if (useScrollTopHack) {
            k = $first.offsetTop;
        }
        // this.$el.style.setProperty("-webkit-overflow-scrolling", "auto")

        this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());
        let delta = 0;
        if (useScrollTopHack) {
            delta = $first.offsetTop - k;
        }

        this.dev_checkTree();

        if (useScrollTopHack) {
            if (this.$el.scrollTop <= 0) {

                if ($first) {
                    const zz = this.$el.scrollTop;

                    // this.$el.style.setProperty("-webkit-overflow-scrolling", "auto")
                    this.$el.style.setProperty("overflow", "hidden");
                    this.$el.scrollTop = zz + delta;
                    this.$el.style.setProperty("overflow", "");

                    this.justChangedScrollTop = true;
                }
            }
        } else if ($first) {
            if (this.$el.scrollTop <= 0) {
                this.$el.scrollTop = $first.offsetTop;
            }
        }
    };

    onTopPageMessagesReady = (event) => {
        if (this.isLoadingRecent) {
            return;
        }

        this.currentVirtual.isDownloading = false;

        if (event.context.isUsingSecondVirtual && !this.isUsingSecondVirtual) {
            console.log("wat");
            this.secondVirtual.refresh();
            return;
        }

        const ivt = this.currentVirtual.isVeryTop();

        this.currentVirtual.hasMoreOnTopToDownload = event.messages.flatMap(message => message instanceof GroupMessage ? Array.from(message.messages) : [message]).length >= 100;

        this.currentVirtual.messages = [...fixMessages(event.messages), ...this.currentVirtual.messages];

        if (ivt) {
            this.virtual_onScrolledTop();
        }
    };

    virtual_onScrolledBottom = () => {
        if (this.isLoadingRecent) {
            return;
        }

        // console.log("on scrolled bottom");

        if (this.currentVirtual.isVeryBottom()) {
            if (this.currentVirtual.hasMoreOnBottomToDownload && !this.currentVirtual.isDownloading) {
                if (this.currentVirtual.messages.length > 0) {
                    this.currentVirtual.isDownloading = true;

                    // console.log("[bottom] downloading")

                    AppSelectedChat.current.messages.downloadNextBottomPage(this.currentVirtual.getVeryBottomOne().id, {
                        isUsingSecondVirtual: this.isUsingSecondVirtual
                    });
                }
            }

            // console.log("isVeryBottom")

            return;
        }

        if (this.virtual_isCompletelyBottom()) {
            return;
        }

        const messages = this.currentVirtual.nextBottom();

        for (let i = 0; i < Math.min(this.currentVirtual.currentPage.length, messages.length); i++) {
            vrdom_delete(this.bubblesInnerRef.$el.lastChild);
        }

        let k;
        let $first: HTMLElement = this.bubblesInnerRef.$el.lastElementChild;

        if (useScrollTopHack) {

            k = $first.offsetTop;
        }
        this.prependMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

        this.dev_checkTree();

        if (useScrollTopHack) {

            const delta = $first.offsetTop - k;

            // if (this.$el.scrollTop <= 0) {

            if ($first) {
                const zz = this.$el.scrollTop;

                // this.$el.style.setProperty("-webkit-overflow-scrolling", "auto")
                this.$el.style.setProperty("overflow", "hidden");
                this.$el.scrollTop = zz + delta;
                this.$el.style.setProperty("overflow", "");

                this.justChangedScrollTop = true;
            }
        }
        // }

    };

    onBottomPageMessagesReady = (event) => {
        if (this.isLoadingRecent) {
            return;
        }

        //  main virtual should never fire this event
        if (!this.isUsingSecondVirtual) {
            this.secondVirtual.refresh();

            this.mainVirtual.isDownloading = false;
            return;
        }

        this.secondVirtual.isDownloading = false;

        let messages = fixMessages(event.messages);

        const ivt = this.secondVirtual.isVeryBottom();
        const intersect = this.mainVirtual.isEmpty() ? -1 : findIntersection(messages, [this.mainVirtual.getVeryTopOne()]);

        if (intersect > -1) {
            console.log("[bottom page] intersect found");

            messages = messages.slice(0, intersect - 1);

            this.mainVirtual.currentPage = this.secondVirtual.currentPage;

            this.secondVirtual.messages.push(...messages);
            this.mainVirtual.messages = [...this.secondVirtual.messages, ...this.mainVirtual.messages];

            this.isUsingSecondVirtual = false;

            this.secondVirtual.refresh();
        } else {
            console.log("[bottom page] no intersect found");

            this.secondVirtual.messages.push(...messages);
        }

        if (ivt) {
            this.virtual_onScrolledBottom();
        }
    };

    virtual_isCompletelyBottom = () => {
        return !this.isUsingSecondVirtual && this.mainVirtual.isVeryBottom();
    };

    dev_checkTree = () => {
        if (__IS_DEV__) {
            if (this.bubblesInnerRef.$el.childElementCount < 100) {
                console.log("BUG: < 100 messages rendered!!!");
            }
        }
    };

    onIntersection = (entries) => {
        let isAtBottom = false;
        let isAtTop = false;

        entries.forEach(entry => {
            if (useIntersectVirtualization) {
                const $target = entry.target;
                // console.log($target.offsetTop, entry.isIntersecting)


                if (entry.isIntersecting) {
                    const children = [...$target.parentElement.children];
                    const length = children.length;
                    const edge = 8;
                    const index = children.findIndex($elem => $target === $elem);
                    if (index >= length - edge) {
                        isAtTop = true;
                    }

                    // const w = Math.floor(this.$el.scrollHeight - offset);

                    if (index <= edge) {
                        isAtBottom = true;
                    }
                }
            }
            if (entry.isIntersecting) {
                entry.target.style.visibility = "visible";
                entry.target.__v?.component.onElementVisible.call(entry.target.__v.component);
            } else {
                entry.target.style.visibility = "hidden";
                entry.target.__v?.component.onElementHidden.call(entry.target.__v.component);
            }
        });
        // if(isAtBottom) {
        //     console.log("BOTTOM")
        // }
        // if(isAtTop) {
        //     console.log("TOP")
        // }
        if (useIntersectVirtualization) {
            if (!isAtBottom) {
                UIEvents.General.fire("chat.scrollBottom.show");
            }

            if (isAtTop) {
                this.virtual_onScrolledTop();
            } else if (isAtBottom) {
                if (this.virtual_isCompletelyBottom() || (!this.mainVirtual.hasMoreOnTopToDownload && this.virtual_isCompletelyBottom())) {
                    UIEvents.General.fire("chat.scrollBottom.hide");
                }

                this.virtual_onScrolledBottom();
            }
        }
    };

    scrollBottom() {
        scrollBottom(this.$el, this.bubblesInnerRef.$el);
    }

    appendMessages = (messages: Message[], beforeTopMessage: Message = null, afterBottomMessage: Message = null) => {
        return appendMessages(this.bubblesInnerRef.$el, messages, beforeTopMessage, afterBottomMessage, this.observer);
    };

    prependMessages = (messages: Message[], beforeTopMessage: Message = null, afterBottomMessage: Message = null) => {
        return prependMessages(this.bubblesInnerRef.$el, messages, beforeTopMessage, afterBottomMessage, this.observer);
    };
}

export default VirtualizedBubblesComponent;