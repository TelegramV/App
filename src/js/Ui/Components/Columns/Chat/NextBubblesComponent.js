/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import VComponent from "../../../../V/VRDOM/component/VComponent"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import UIEvents from "../../../EventBus/UIEvents"
import AppEvents from "../../../../Api/EventBus/AppEvents"
import MessageComponent from "./MessageComponent"
import {UserPeer} from "../../../../Api/Peers/Objects/UserPeer"
import {ServiceMessage} from "../../../../Api/Messages/Objects/ServiceMessage"
import type {Message} from "../../../../Api/Messages/Message"
import vrdom_delete from "../../../../V/VRDOM/delete"
import vrdom_render from "../../../../V/VRDOM/render/render"
import scrollToAndHighlight from "../../../../Utils/scrollToAndHighlight"
import findIntersection from "../../../Virtual/findIntersection"
import vrdom_deleteInner from "../../../../V/VRDOM/deleteInner"
import VirtualMessages from "../../../Virtual/VirtualMessages"
import scrollBottom from "../../../../Utils/scrollBottom"
import API from "../../../../Api/Telegram/API"
import {MessageFactory} from "../../../../Api/Messages/MessageFactory"

function getMessageElementById(messageId: number): HTMLElement | null {
    return document.getElementById(`message-${messageId}`); // dunno better way, sorry
}

// there is no possibility nor time to calculate each message size
class NextBubblesComponent extends VComponent {
    bubblesInnerRef = VComponent.createRef();

    mainVirtual: VirtualMessages = new VirtualMessages();
    secondVirtual: VirtualMessages = new VirtualMessages();

    isUsingSecondVirtual = false;
    actionCount = 0;

    identifier = `bubbles-component`;

    get currentVirtual(): VirtualMessages {
        if (this.isUsingSecondVirtual) {
            return this.secondVirtual;
        }

        return this.mainVirtual;
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedChat.check(event.peer))
            .on("chat.initialReady", this.onInitialMessagesReady)
            .on("chat.topPageReady", this.onTopPageMessagesReady)
            .on("chat.bottomPageReady", this.onBottomPageMessagesReady)
            .on("chat.showMessageReady", this.onChatShowMessageReady);

        E.bus(AppEvents.Dialogs)
            .only(event => AppSelectedChat.check(event.dialog.peer))
            .on("newMessage", this.onNewMessage);

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
            .on("chat.topMessagesReady", this.onTopPageMessagesReady)
            .on("chat.showMessage", this.onChatShowMessage)
            .on("chat.scrollBottom", this.onChatScrollBottomRequest);
    }

    render() {
        return (
            <div id="bubbles" className="scrollable">
                <div ref={this.bubblesInnerRef} id="bubbles-inner"/>
            </div>
        );
    }

    componentDidMount() {
        this.props.loaderRef.$el.style.display = "none";
        this.$el.addEventListener("scroll", this.onScroll, {
            passive: true,
        });
    }

    renderMessage = (message: Message, prevMessage: Message = null, nextMessage: Message = null): HTMLElement => {
        const isOut = !message.isPost && message.isOut;
        const hideAvatar = isOut || message.isPost || message.to instanceof UserPeer || message instanceof ServiceMessage;

        message.hideAvatar = true;

        let prevCurr = this._isGrouping(prevMessage, message);
        let currNext = this._isGrouping(message, nextMessage);
        if (!prevCurr && currNext) {
            message.tailsGroup = "s";
        } else if (!currNext) {
            if (!prevCurr) {
                message.tailsGroup = "se";
            } else {
                message.tailsGroup = "e";
            }
            if (!isOut) message.hideAvatar = false;
        } else {
            message.tailsGroup = "m";
        }

        return vrdom_render(
            <div>
                <MessageComponent message={message}/>
            </div>
        );
    }

    _isGrouping(one: Message, two: Message) {
        if (!one || !two) return false;
        return (!(one.type instanceof ServiceMessage) && !(two.type instanceof ServiceMessage))
            && (one.isPost || one.isOut === two.isOut)
            && (one.from.id === two.from.id)
            && (Math.abs(one.date - two.date) < 5 * 60);
    }

    cleanupTree = () => {
        vrdom_deleteInner(this.bubblesInnerRef.$el);
    }

    refresh = () => {
        this.cleanupTree();
        this.mainVirtual.refresh();
        this.secondVirtual.refresh();

        this.isUsingSecondVirtual = false;
    }

    // first message must always be last
    fixMessages(messages: Message[]): Message[] {
        if (messages.length > 0 && messages[0].id > messages[messages.length - 1].id) {
            messages = messages.reverse();
        }

        return messages;
    }

    scrollBottom() {
        scrollBottom(this.$el, this.bubblesInnerRef.$el);
    }

    appendMessages(messages: Message[], beforeTopMessage: Message = null, afterBottomMessage: Message = null) {
        if (messages.length > 0) {
            if (!__IS_PRODUCTION__) {
                if (!beforeTopMessage) {
                    console.log("[warn] append no before message")
                }
                if (!afterBottomMessage) {
                    console.log("[warn] append no after message")
                }
                if (beforeTopMessage && messages[0].id < beforeTopMessage.id) {
                    console.error("append shit before", beforeTopMessage, messages)
                }
                if (afterBottomMessage && messages[messages.length - 1].id > afterBottomMessage.id) {
                    console.error("append shit after", afterBottomMessage, messages)
                }
            }

            const $messages = [this.renderMessage(messages[0], beforeTopMessage, messages[1])];

            //[0,1,2,3]
            //[x,0,1]
            //[0,1,2] loop
            //[1,2,3] loop
            //[2,3,y]
            for (let i = 1; i < messages.length - 1; i++) {
                $messages.push(this.renderMessage(messages[i], messages[i - 1], messages[i + 1]));
            }

            if (messages.length > 1) {
                $messages.push(this.renderMessage(messages[messages.length - 1], messages[messages.length - 2], afterBottomMessage));
            }

            this.bubblesInnerRef.$el.append(...$messages);

            return $messages;
        }

        return [];
    }

    prependMessages(messages: HTMLElement[], beforeTopMessage: Message = null, afterBottomMessage: Message = null) {
        if (messages.length > 0) {
            if (!__IS_PRODUCTION__) {
                if (!beforeTopMessage) {
                    console.log("[warn] prepend no before message")
                }
                if (!afterBottomMessage) {
                    console.log("[warn] prepend no after message")
                }
                if (beforeTopMessage && messages[0].id < beforeTopMessage.id) {
                    console.error("prepend shit before", beforeTopMessage, messages)
                }
                if (afterBottomMessage && messages[messages.length - 1].id > afterBottomMessage.id) {
                    console.error("prepend shit after", afterBottomMessage, messages)
                }
            }

            const $messages = [this.renderMessage(messages[0], beforeTopMessage, messages[1])];

            for (let i = 1; i < messages.length - 1; i++) {
                $messages.push(this.renderMessage(messages[i], messages[i - 1], messages[i + 1]));
            }

            if (messages.length > 1) {
                $messages.push(this.renderMessage(messages[messages.length - 1], messages[messages.length - 2], afterBottomMessage));
            }

            this.bubblesInnerRef.$el.prepend(...$messages);

            return $messages;
        }

        return [];
    }

    onChatSelect = () => {
        this.refresh();

        if (AppSelectedChat.isSelected) {
            const peer = AppSelectedChat.Current;

            API.messages.getHistory(peer, {limit: 100}).then(Messages => {
                AppEvents.Peers.fire("chat.initialReady", {
                    messages: Messages.messages.map(rawMessage => MessageFactory.fromRaw(peer, rawMessage)),
                    peer
                });
            });
        }
    }

    onChatScrollBottomRequest = () => {
        if (this.virtual_isCompletelyBottom()) {
            this.isUsingSecondVirtual = false;
            this.scrollBottom();
        } else {
            this.cleanupTree();
            this.isUsingSecondVirtual = false;
            this.secondVirtual.refresh();
            // patching is good idea, but it doesn't work properly
            // vrdom_patch(this.bubblesInnerRef.$el, <div ref={this.bubblesInnerRef} id="bubbles-inner">{this.mainVirtual.veryBottomPage().map(m => this.renderVRNodeMessage(m))}</div>)
            this.appendMessages(this.mainVirtual.veryBottomPage(), this.mainVirtual.getBeforePageTopOne(), this.mainVirtual.getAfterPageBottomOne());
            this.scrollBottom();
        }
    }

    onScroll = () => {
        const {scrollTop, scrollHeight, clientHeight} = this.$el;
        const isAtBottom = scrollHeight - scrollTop === clientHeight;
        // const isAtTop = scrollTop <= 300;
        const isAtTop = scrollTop === 0;

        if ((scrollHeight - scrollTop) >= (clientHeight - 20)) {
            UIEvents.General.fire("chat.scrollBottom.show");
        }

        if (isAtTop) {
            console.log("on top")
            this.virtual_onScrolledTop();
        } else if (isAtBottom) {
            if (this.virtual_isCompletelyBottom()) {
                UIEvents.General.fire("chat.scrollBottom.hide");
            }
            this.virtual_onScrolledBottom();
        }
    }

    onInitialMessagesReady = (event) => {
        this.refresh();

        this.currentVirtual.hasMoreOnTopToDownload = event.messages.length === 100;

        this.mainVirtual.messages = this.fixMessages(event.messages);
        console.log("prepending")
        this.prependMessages(this.mainVirtual.veryBottomPage(), this.mainVirtual.getBeforePageTopOne(), this.mainVirtual.getAfterPageBottomOne());
        this.scrollBottom();
    }

    onNewMessage = (event) => {
        const message = event.message;

        if (this.virtual_isCompletelyBottom()) {
            this.mainVirtual.messages.push(message);

            const {scrollTop, scrollHeight, clientHeight} = this.$el;
            const isAtBottom = scrollHeight - scrollTop === clientHeight;

            if (this.mainVirtual.messages.length > this.mainVirtual.size) {
                vrdom_delete(this.bubblesInnerRef.$el.firstChild);
            }

            this.mainVirtual.veryBottomPage();

            this.appendMessages([message], this.mainVirtual.getBeforePageTopOne(), this.mainVirtual.getAfterPageBottomOne());

            if (isAtBottom) {
                this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
            } else {
                this.$el.scrollTop = scrollTop;
            }
        } else {
            this.mainVirtual.messages.push(message);
        }
    }

    onChatShowMessage = ({message}) => {
        if (AppSelectedChat.check(message.to)) {
            let $message = getMessageElementById(message.id);

            if (!$message) {
                const messageIndex = this.mainVirtual.messages.findIndex(m => m.id === message.id);

                if (messageIndex > -1) {
                    this.cleanupTree();

                    this.mainVirtual.currentPage = this.mainVirtual.messages
                        .slice(Math.max(messageIndex - this.mainVirtual.edgeSize, 0), messageIndex + this.mainVirtual.edgeSize);

                    const messages = this.mainVirtual.currentPage;

                    this.prependMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

                    $message = this.$el.querySelector(`#message-${message.id}`);
                } else {
                    const peer = AppSelectedChat.Current;

                    const actionCount = (++this.actionCount);

                    API.messages.getHistory(peer, {
                        offset_id: message.id,
                        add_offset: -51,
                        limit: 100
                    }).then(Messages => {
                        AppEvents.Peers.fire("chat.showMessageReady", {
                            peer,
                            messages: Messages.messages.map(rawMessage => MessageFactory.fromRaw(peer, rawMessage)),
                            offset_id: message.id,
                            actionCount,
                        })
                    });
                }
            }

            if ($message) {
                scrollToAndHighlight(this.$el, $message);
            } else {
                console.warn("No message to scroll found.")
            }
        } else {
            AppSelectedChat.select(message.to);

            const actionCount = (++this.actionCount);

            API.messages.getHistory(peer, {
                offset_id: message.id,
                add_offset: -51,
                limit: 100
            }).then(Messages => {
                AppEvents.Peers.fire("chat.showMessageReady", {
                    peer,
                    messages: Messages.messages.map(rawMessage => MessageFactory.fromRaw(peer, rawMessage)),
                    offset_id: message.id,
                    actionCount,
                })
            });
        }
    }

    onChatShowMessageReady = event => {
        if (this.actionCount > event.actionCount) {
            return;
        }

        this.cleanupTree();
        this.secondVirtual.refresh();

        this.isUsingSecondVirtual = true;

        let messages = this.fixMessages(event.messages);

        const intersect = this.mainVirtual.isEmpty() ? -1 : findIntersection(messages, [this.mainVirtual.getVeryTopOne()]);

        if (intersect > -1) {
            console.log("[show message] intersect found");

            messages = messages.slice(intersect - 1);

            this.secondVirtual.messages.push(...messages);
            this.mainVirtual.messages = [...this.secondVirtual.messages, ...this.mainVirtual.messages];

            this.isUsingSecondVirtual = false;
            this.secondVirtual.refresh();

            messages = this.mainVirtual.nextBottom();
        } else {
            this.secondVirtual.messages.push(...messages);
            messages = this.secondVirtual.veryBottomPage();
        }

        this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

        const $message = this.$el.querySelector(`#message${event.offset_id}`);

        if ($message) {
            scrollToAndHighlight(this.$el, $message);
        } else {
            console.error("BUG: no message found to scroll");
        }
    }

    virtual_onScrolledTop = () => {
        console.log("scrolled top")

        if (this.currentVirtual.isVeryTop()) {
            if (!this.currentVirtual.hasMoreOnTopToDownload) {
                console.log("!hasMoreOnTopToDownload", this.isUsingSecondVirtual);
            }

            if (this.currentVirtual.isDownloading) {
                console.log("isDownloading", this.isUsingSecondVirtual);
            }

            if (this.currentVirtual.hasMoreOnTopToDownload && !this.currentVirtual.isDownloading) {
                console.log("[top] downloading");

                if (!this.currentVirtual.isEmpty()) {
                    this.currentVirtual.isDownloading = true;

                    console.log("[top] downloading ok");

                    const peer = AppSelectedChat.Current;

                    API.messages.getHistory(peer, {
                        offset_id: this.currentVirtual.getVeryTopOne().id,
                        limit: 100
                    }).then(Messages => {
                        console.log("messaes")
                        AppEvents.Peers.fire("chat.topPageReady", {
                            messages: Messages.messages.map(rawMessage => MessageFactory.fromRaw(peer, rawMessage)),
                            peer,
                            isUsingSecondVirtual: this.isUsingSecondVirtual,
                        });
                    });
                }
            }

            return;
        }

        const messages = this.currentVirtual.nextTop();

        for (let i = 0; i < messages.length; i++) {
            vrdom_delete(this.bubblesInnerRef.$el.lastChild);
        }

        this.prependMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());

        if (this.$el.scrollTop === 0) {
            let $first: HTMLElement = this.bubblesInnerRef.$el.childNodes[messages.length - 1];

            if ($first) {
                if ($first.nextElementSibling) {
                    this.$el.scrollTop = $first.nextElementSibling.offsetTop;
                } else {
                    this.$el.scrollTop = $first.offsetTop;
                }
            }
        }
    }

    onTopPageMessagesReady = (event) => {
        this.currentVirtual.isDownloading = false;

        if (event.isUsingSecondVirtual && !this.isUsingSecondVirtual) {
            console.log("wat")
            this.secondVirtual.refresh();
            return;
        }

        const ivt = this.currentVirtual.isVeryTop();

        this.currentVirtual.hasMoreOnTopToDownload = event.messages.length === 100;

        this.currentVirtual.messages = [...this.fixMessages(event.messages), ...this.currentVirtual.messages];

        if (ivt) {
            this.virtual_onScrolledTop();
        }
    }

    virtual_onScrolledBottom = () => {
        console.log("on scrolled bottom");

        if (this.currentVirtual.isVeryBottom()) {
            if (this.currentVirtual.hasMoreOnBottomToDownload && !this.currentVirtual.isDownloading) {
                if (this.currentVirtual.messages.length > 0) {
                    this.currentVirtual.isDownloading = true;

                    const peer = AppSelectedChat.Current;

                    console.log("[bottom] downloading")

                    API.messages.getHistory(peer, {
                        offset_id: this.currentVirtual.getVeryBottomOne().id,
                        limit: 99,
                        add_offset: -100
                    }).then(Messages => {
                        AppEvents.Peers.fire("chat.bottomPageReady", {
                            messages: Messages.messages.map(rawMessage => MessageFactory.fromRaw(peer, rawMessage)),
                            peer,
                            isUsingSecondVirtual: this.isUsingSecondVirtual,
                        });
                    });
                }
            }

            console.log("isVeryBottom")

            return;
        }

        if (this.virtual_isCompletelyBottom()) {
            return;
        }

        const messages = this.currentVirtual.nextBottom();

        for (let i = 0; i < messages.length; i++) {
            vrdom_delete(this.bubblesInnerRef.$el.firstChild);
        }

        this.appendMessages(messages, this.currentVirtual.getBeforePageTopOne(), this.currentVirtual.getAfterPageBottomOne());
    }

    onBottomPageMessagesReady = (event) => {
        //  main virtual should never fire this event
        if (!this.isUsingSecondVirtual) {
            this.secondVirtual.refresh();

            this.mainVirtual.isDownloading = false;
            return;
        }

        this.secondVirtual.isDownloading = false;

        let messages = this.fixMessages(event.messages);

        const ivt = this.secondVirtual.isVeryBottom();
        const intersect = this.mainVirtual.isEmpty() ? -1 : findIntersection(messages, [this.mainVirtual.getVeryTopOne()]);

        if (intersect > -1) {
            console.log("[bottom page] intersect found");

            messages = messages.slice(intersect - 1);

            this.mainVirtual.currentPage = this.secondVirtual.currentPage;

            this.secondVirtual.messages.push(...messages);
            this.mainVirtual.messages = [...this.secondVirtual.messages, ...this.mainVirtual.messages];

            this.isUsingSecondVirtual = false;

            console.log(this.mainVirtual.currentPage)

            this.secondVirtual.refresh();
        } else {
            console.log("[bottom page] no intersect found");

            this.secondVirtual.messages.push(...messages);
        }

        if (ivt) {
            this.virtual_onScrolledBottom();
        }
    }

    virtual_isCompletelyBottom = () => {
        return !this.isUsingSecondVirtual && this.mainVirtual.isVeryBottom();
    }

    virtual_isCurrentVirtualLastPage = () => {
        return this.currentVirtual.offset + this.currentVirtual.size >= this.currentVirtual.messages.length;
    }

    virtual_isMainVirtualLastPage = () => {
        return !this.isUsingSecondVirtual && this.mainVirtual.offset + this.mainVirtual.size >= this.mainVirtual.messages.length;
    }
}

export default NextBubblesComponent;