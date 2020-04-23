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
import {MessageAvatarComponent} from "./Message/Common/MessageAvatarComponent"
import type {Message} from "../../../../Api/Messages/Message"
import vrdom_delete from "../../../../V/VRDOM/delete"
import vrdom_render from "../../../../V/VRDOM/render/render"
import scrollToAndHighlight from "./Functions/scrollToAndHighlight"
import findIntersection from "./Functions/findIntersection"
import vrdom_deleteInner from "../../../../V/VRDOM/deleteInner"
import VirtualMessages from "./VirtualMessages"

class NextBubblesComponent extends VComponent {
    bubblesInnerRef = VComponent.createRef();

    hasTopMessagesToLoad = true;
    hasBottomMessagesToLoad = true;
    
    mainStream: VirtualMessages = new VirtualMessages();
    secondStream: VirtualMessages = new VirtualMessages();

    isUsingSecondStream = false;

    get currentStream(): VirtualMessages {
        if (this.isUsingSecondStream) {
            return this.secondStream;
        }

        return this.mainStream;
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedChat.check(event.peer))
            .on("chat.initialReady", this.onInitialMessagesReady)
            .on("chat.nextPageReady", this.onNextPageMessagesReady)
            .on("chat.prevPageReady", this.onPrevPageMessagesReady)
            .on("chat.showMessageReady", this.onChatShowMessageReady);

        E.bus(AppEvents.Dialogs)
            .only(event => AppSelectedChat.check(event.dialog.peer))
            .on("newMessage", this.onNewMessage);

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
            .on("chat.showMessage", this.onChatShowMessage)
            .on("chat.scrollToBottom", this.onChatScrollBottomRequest);
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

    renderMessage = (message: Message): HTMLElement => {
        const isOut = !message.isPost && message.isOut;
        const hideAvatar = isOut || message.isPost || message.to instanceof UserPeer || message instanceof ServiceMessage;

        return vrdom_render(
            <div id={`cmsg${message.id}`} className={["bubble-group", isOut ? "out" : "in"]}>
                {!hideAvatar ? <MessageAvatarComponent message={message}/> : null}
                <div className="bubbles-list">
                    <MessageComponent message={message}/>
                </div>
            </div>
        );
    }

    cleanupTree = () => {
        vrdom_deleteInner(this.bubblesInnerRef.$el);
    }

    refresh = () => {
        this.cleanupTree();
        this.mainStream.refresh();
        this.secondStream.refresh();

        this.hasTopMessagesToLoad = true;
        this.hasBottomMessagesToLoad = false;

        this.isUsingSecondStream = false;
    }

    onChatSelect = () => {
        this.refresh();

        if (AppSelectedChat.isSelected) {
            AppSelectedChat.Current.api.fetchInitialMessages();
        }
    }

    onChatScrollBottomRequest = () => {
        if (this.virtual_isMainStreamFirstPage()) {
            this.isUsingSecondStream = false;
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
        } else {
            this.cleanupTree();
            this.isUsingSecondStream = false;
            this.secondStream.refresh();
            this.mainStream.offset = 0;
            this.bubblesInnerRef.$el.append(
                ...this.mainStream.next()
                    .map(this.renderMessage)
            );
            this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
        }
    }

    onChatShowMessageReady = event => {
        this.cleanupTree();
        this.secondStream.refresh();

        this.isUsingSecondStream = true;

        let messages = event.messages;

        const intersect = findIntersection(messages, this.mainStream.messages.slice(this.mainStream.messages.length - 1));

        if (intersect > -1) {
            this.isUsingSecondStream = false;

            messages = messages.slice(intersect + 1);

            this.mainStream.messages.push(...messages);

            messages = this.mainStream.messages.slice(this.mainStream.messages.length - this.mainStream.size);

            this.mainStream.offset = this.mainStream.messages.length;
        } else {
            this.secondStream.messages = messages.slice().reverse();
            this.secondStream.offset = messages.length;
        }

        const $messages = messages.map(this.renderMessage);

        this.bubblesInnerRef.$el.append(...$messages);

        const $message = $messages[messages.findIndex(msg => msg.id === event.offset_id)];

        if ($message) {
            scrollToAndHighlight(this.$el, $message);
        } else {
            console.error("funk no message");
        }
    }

    onChatShowMessage = message => {
        if (AppSelectedChat.check(message.to)) {
            let $message = this.$el.querySelector(`#cmsg${message.id}`); // dunno better way, sorry

            if (!$message) {
                const messageIndex = this.mainStream.messages.findIndex(m => m.id === message.id);

                if (messageIndex > -1) {
                    this.cleanupTree();

                    const $messages = this.mainStream.messages
                        .slice(messageIndex - this.mainStream.sizeDiv2, messageIndex + this.mainStream.sizeDiv2)
                        .map(this.renderMessage);

                    this.bubblesInnerRef.$el.append(...$messages);

                    $message = $messages[this.mainStream.sizeDiv2];

                    this.mainStream.offset = messageIndex + this.mainStream.sizeDiv2;
                } else {
                    AppSelectedChat.Current.api.fetchByOffsetId({
                        offset_id: message.id,
                        add_offset: -30,
                        limit: 60
                    });
                }
            }

            if ($message) {
                scrollToAndHighlight(this.$el, $message);
            } else {
                console.log("fuckcckcckckck")
            }
        }
    }

    onScroll = () => {
        const {scrollTop, scrollHeight, clientHeight} = this.$el;
        const isAtBottom = scrollHeight - scrollTop === clientHeight;
        const isAtTop = scrollTop === 0;

        if ((scrollHeight - scrollTop) >= (clientHeight - 20)) {
            UIEvents.General.fire("chat.scrollToBottom.show");
        }

        if (isAtTop) {
            this.virtual_onScrolledTop();
        } else if (isAtBottom) {
            if (this.virtual_isMainStreamFirstPage()) {
                UIEvents.General.fire("chat.scrollToBottom.hide");
            }
            this.virtual_onScrolledBottom();
        }
    }

    onInitialMessagesReady = (event) => {
        this.refresh();

        this.hasTopMessagesToLoad = event.messages.length === 60;

        this.mainStream.messages = event.messages;
        this.mainStream.offset = 0;
        this.bubblesInnerRef.$el.append(...this.mainStream.next().map(this.renderMessage));
        this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
    }

    onNewMessage = (event) => {
        const message = event.message;

        this.mainStream.messages.unshift(message);

        if (this.virtual_isMainStreamFirstPage()) {
            const {scrollTop, scrollHeight, clientHeight} = this.$el;
            const isAtBottom = scrollHeight - scrollTop === clientHeight;

            this.bubblesInnerRef.$el.prepend(this.renderMessage(message));
            vrdom_delete(this.bubblesInnerRef.$el.lastChild);

            if (isAtBottom) {
                this.$el.scrollTop = this.bubblesInnerRef.$el.clientHeight;
            } else {
                this.$el.scrollTop = scrollTop;
            }
        } else {
            this.mainStream.offset++;
        }
    }

    virtual_onScrolledTop = () => {
        if (this.currentStream.offset === this.currentStream.messages.length) {
            if (this.hasTopMessagesToLoad && !this.isLoadingNextPage) {
                this.isLoadingNextPage = true;
                AppSelectedChat.Current.api.fetchNextPage(this.currentStream.messages[this.currentStream.messages.length - 1].id);
            }
            return;
        }

        const $nodes = this.currentStream.next().map(this.renderMessage);

        this.bubblesInnerRef.$el.append(...$nodes);

        for (let i = 0; i < $nodes.length; i++) {
            vrdom_delete(this.bubblesInnerRef.$el.firstChild);
        }

        let $first: HTMLElement = $nodes[0];

        if ($first) {
            if ($first.previousElementSibling) {
                this.$el.scrollTop = $first.previousElementSibling.offsetTop;
            } else {
                this.$el.scrollTop = $first.offsetTop;
            }
        }
    }

    onNextPageMessagesReady = (event) => {
        this.isLoadingNextPage = false;

        this.hasTopMessagesToLoad = event.messages.length === 60;
        this.currentStream.messages.push(...event.messages);

        if (this.virtual_isCurrentStreamLastPage()) {
            this.virtual_onScrolledTop();
        }
    }

    virtual_onScrolledBottom = () => {
        if (this.isUsingSecondStream) {
            if (!this.isLoadingPrevPage) {
                this.isLoadingPrevPage = true;
                AppSelectedChat.Current.api.fetchPrevPage(this.secondStream.messages[this.secondStream.messages.length - 1].id);
            }

            return;
        }

        if (this.virtual_isMainStreamFirstPage()) {
            return;
        }

        const $nodes = this.mainStream.back().map(this.renderMessage);

        this.bubblesInnerRef.$el.prepend(...$nodes);

        for (let i = 0; i < $nodes.length; i++) {
            vrdom_delete(this.bubblesInnerRef.$el.lastChild);
        }
    }

    onPrevPageMessagesReady = (event) => {
        this.isLoadingPrevPage = false;

        const intersect = findIntersection(event.messages, this.mainStream.messages.slice(this.mainStream.messages.length - 1));

        let messages = event.messages;

        if (intersect > -1) {
            console.log("intersect found")
            this.isUsingSecondStream = false;

            messages = messages.slice(intersect + 1);

            this.mainStream.messages.push(...event.messages);

            messages = this.mainStream.messages.slice(this.mainStream.messages.length - this.mainStream.size);

            this.mainStream.offset = this.mainStream.messages.length;

            const $nodes = messages.slice(0, 30).map(this.renderMessage);

            this.bubblesInnerRef.$el.prepend(...$nodes);

            for (let i = 0; i < $nodes.length; i++) {
                vrdom_delete(this.bubblesInnerRef.$el.lastChild);
            }
        } else {
            this.secondStream.messages.push(...messages.reverse());

            const $nodes = messages.slice(0, 30).map(this.renderMessage);

            this.bubblesInnerRef.$el.prepend(...$nodes);

            for (let i = 0; i < $nodes.length; i++) {
                vrdom_delete(this.bubblesInnerRef.$el.lastChild);
            }
        }
    }

    virtual_isCurrentStreamFirstPage = () => {
        return this.currentStream.offset <= this.currentStream.size;
    }

    virtual_isMainStreamFirstPage = () => {
        return !this.isUsingSecondStream && this.mainStream.offset <= this.mainStream.size;
    }

    virtual_isCurrentStreamLastPage = () => {
        return this.currentStream.offset + this.currentStream.size >= this.currentStream.messages.length;
    }

    virtual_isMainStreamLastPage = () => {
        return !this.isUsingSecondStream && this.mainStream.offset + this.mainStream.size >= this.mainStream.messages.length;
    }
}

export default NextBubblesComponent;