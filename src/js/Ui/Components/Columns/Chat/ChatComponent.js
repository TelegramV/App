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

import ChatInfoPinnedComponent from "./ChatInfo/ChatInfoPinnedComponent"
import ChatInfoComponent from "./ChatInfo/ChatInfoComponent"
import {ChatInputComponent} from "./ChatInput/ChatInputComponent";
import AppSelectedChat from "../../../Reactive/SelectedChat"
import UIEvents from "../../../EventBus/UIEvents"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import {CallsManager} from "../../../../Api/Calls/CallManager";
import VApp from "../../../../V/vapp"
import VSpinner from "../../Elements/VSpinner"
import NextBubblesComponent from "./NextBubblesComponent"
import ChatInfoCallButtonComponent from "./ChatInfo/ChatInfoCallButtonComponent";

/**
 * CRITICAL: never rerender this component!
 */
class ChatComponent extends VComponent {

    noChatRef = VComponent.createRef()
    chatRef = VComponent.createRef()
    chatLoaderRef = VComponent.createRef()
    messagesLoaderRef = VComponent.createRef()
    chatInputRef = VComponent.createComponentRef()

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)


        E.bus(UIEvents.RightSidebar)
            .on("show", this.onRightSidebarShow)
            .on("hide", this.onRightSidebarHide)
    }

    render() {
        return (
            <div class="chat-wrapper">
                <div id="wallpaper" class="wallpaper blur"/>

                <div ref={this.noChatRef} id="noChat">
                    <VSpinner loaderRef={this.chatLoaderRef}
                              id="chat-wrapper-loader"
                              full={true}
                              big={true}
                              show={true}
                              background={true}
                              white={true}/>
                </div>

                <div ref={this.chatRef} id="chat" css-display="none">
                    <div id="topbar">
                        <ChatInfoComponent/>
                        <ChatInfoPinnedComponent/>
                        <ChatInfoCallButtonComponent/>
                        <div className="btn-icon rp rps tgico-search" onClick={this.openSearch}/>
                        <div className="btn-icon rp rps tgico-more"/>
                    </div>

                    <VSpinner loaderRef={this.messagesLoaderRef}
                              id="messages-wrapper-messages-loader"
                              full={true} white={true}
                              show={true}
                              background={true}/>

                    <NextBubblesComponent loaderRef={this.messagesLoaderRef}/>

                    {/*<BubblesComponent loaderRef={this.messagesLoaderRef}/>*/}
                    <ChatInputComponent ref={this.chatInputRef}/>

                </div>
            </div>
        )
    }


    componentDidMount() {
        if (!VApp.router.activeRoute.queryParams.p) {
            this.noChatRef.$el.style.display = ""
            this.chatLoaderRef.$el.style.display = "none"
        }
    }


    onRightSidebarShow = l => {
        this.$el.classList.add("right-bar-open")
        this.rightSidebarOpen = true
    }

    onRightSidebarHide = l => {
        this.$el.classList.remove("right-bar-open")
        this.rightSidebarOpen = false
    }

    onChatSelect = _ => {
        this.chatLoaderRef.$el.style.display = "none"

        if (AppSelectedChat.isSelected) {
            this.noChatRef.$el.style.display = "none"
            this.chatRef.$el.style.display = ""
            this.chatRef.$el.classList.add("responsive-selected-chat")
        } else {
            this.noChatRef.$el.style.display = ""
            this.chatRef.$el.style.display = "none"
            this.chatRef.$el.classList.remove("responsive-selected-chat")
        }

        this.chatLoaderRef.$el.style.display = "none"
    }

    openSearch = () => {
        UIEvents.RightSidebar.fire("show", {
            barName: "messages-search"
        })
    }
}

export default ChatComponent