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

import ChatInfoPinnedComponent from "./ChatInfo/ChatInfoPinnedComponent"
import ChatInfoComponent from "./ChatInfo/ChatInfoComponent"
import {ChatInputComponent} from "./ChatInput/ChatInputComponent";
import AppSelectedChat from "../../../Reactive/SelectedChat"
import UIEvents from "../../../EventBus/UIEvents"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import VApp from "../../../../V/vapp"
import VSpinner from "../../Elements/VSpinner"
import VirtualizedBubblesComponent from "./VirtualizedBubblesComponent"
import ChatInfoCallButtonComponent from "./ChatInfo/ChatInfoCallButtonComponent";
import StatelessComponent from "../../../../V/VRDOM/component/StatelessComponent"

/**
 * CRITICAL: never rerender this component!
 */
class ChatComponent extends StatelessComponent {

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

                    <VirtualizedBubblesComponent loaderRef={this.messagesLoaderRef}/>
                    {/*<DefaultBubblesComponent loaderRef={this.messagesLoaderRef}/>*/}

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
        // if(l.barName === "forward-message") return
        this.$el.classList.add("right-bar-open")
        this.rightSidebarOpen = true
    }

    onRightSidebarHide = l => {
        // if(l.barName === "forward-message") return

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