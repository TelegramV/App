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
import VSpinner from "../../../Elements/VSpinner"
import VirtualizedBubblesComponent from "./VirtualizedBubblesComponent"
import ChatInfoCallButtonComponent from "./ChatInfo/ChatInfoCallButtonComponent";
import StatelessComponent from "../../../../V/VRDOM/component/StatelessComponent"
import SnackbarComponent from "../../Singleton/SnackbarComponent"
import {SearchSidebar} from "../../SidebarsNeo/Right/Search/SearchSidebar";
import {openedRightSidebars, RightSidebars} from "../../SidebarsNeo/Right/RightSidebars";
import {isDesktop, isMobile} from "../../../Utils/utils";
import {DialogInfoSidebar} from "../../SidebarsNeo/Right/DialogInfo/DialogInfoSidebar";
import nodeIf from "../../../../V/VRDOM/jsx/helpers/nodeIf";
import {SearchBarComponent} from "./Search/SearchBarComponent";
import VButton from "../../../Elements/Button/VButton"
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent"
import API from "../../../../Api/Telegram/API"
import AppEvents from "../../../../Api/EventBus/AppEvents"
import {RightSidebar} from "../../SidebarsNeo/Right/RightSidebar";

const useVirtualized = true || Boolean(localStorage.getItem("settings.messages.virtualized"))

class SubscribeButton extends StatefulComponent {
    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .updateOn("chat.select");

        E.bus(AppEvents.Peers)
            .filter(event => AppSelectedChat.check(event.peer))
            .updateOn("peers.joinLeave");
    }

    render() {
        if (AppSelectedChat.isNotSelected || AppSelectedChat.current.type !== "channel") {
            return <div/>
        }

        if (!AppSelectedChat.current.isLeft) {
            return (
                <VButton isFlat onClick={() => {
                    API.channels.leaveChannel(AppSelectedChat.current)
                }}>Leave</VButton>
            )
        }

        return (
            <VButton onClick={() => {
                API.channels.joinChannel(AppSelectedChat.current)
            }}>Subscribe</VButton>
        )
    }
}

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
            .on("chat.deselectMobile", this.onChatDeselectMobile)

        E.bus(UIEvents.Sidebars)
            .filter(l => l === DialogInfoSidebar || l.constructor === DialogInfoSidebar)
            .on("push", this.onInfoOpen)
            .on("pop", this.onInfoClosed)

        E.bus(UIEvents.Sidebars)
            // .filter(l => l instanceof RightSidebar || l.constructor instanceof RightSidebar)
            .on("openRightWrapper", this.onRightSidebarOpen)
            .on("closeRightWrapper", this.onRightSidebarClosed)


        // E.bus(UIEvents.Sidebars)
        //     .on("rightSidebarHidden", this.onRightSidebarHidden)
    }

    render() {
        return (
            <div class="chat-wrapper" onTransitionEnd={this.onTransitionEnd}>
                <div id="wallpaper" class="wallpaper"/>

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
                    <SearchBarComponent ref={this}/>
                    <div id="topbar">
                        <ChatInfoComponent/>
                        <SubscribeButton/>
                        <ChatInfoCallButtonComponent/>
                        <div className="btn-icon rp rps tgico-search" onClick={this.openSearch}/>
                        <div className="btn-icon rp rps tgico-more"/>
                    </div>
                    <ChatInfoPinnedComponent/>

                    <VSpinner loaderRef={this.messagesLoaderRef}
                              id="messages-wrapper-messages-loader"
                              full={true} white={true}
                              show={true}
                              background={true}/>


                    <div id="virt-el"/>
                    <VirtualizedBubblesComponent loaderRef={this.messagesLoaderRef}/>

                    <ChatInputComponent ref={this.chatInputRef}/>

                </div>
                <SnackbarComponent/>
                {/*{nodeIf(<RightSidebars/>, isDesktop())}*/}

            </div>
        )
    }


    componentDidMount() {
        if (!VApp.router.activeRoute.queryParams.p) {
            this.noChatRef.$el.style.display = ""
            this.chatLoaderRef.$el.style.display = "none"
        }
    }

    onRightSidebarOpen = () => {
        if(isDesktop()) {
            this.chatRef.$el.classList.add("right-sidebar-open")
        }
    }

    onRightSidebarClosed = () => {
        if(isDesktop()) {
            this.chatRef.$el.classList.remove("right-sidebar-open")
        }
    }

    onInfoOpen = () => {
        if (isMobile()) {
            this.$el.classList.toggle("fade-out", true)
        }
    }

    onInfoClosed = () => {
        if (isMobile()) {
            this.$el.classList.toggle("fade-out", false)
        }
    }

    onTransitionEnd = event => {
        if(event.target === this.$el && event.propertyName === "transform") {
            if(this.deselecting) {
                this.deselecting = false
                VApp.router.replace("/")
            } else if(this.opening) {
                this.opening = false
                UIEvents.General.fire("chat.openedMobile", {})
                this.messagesLoaderRef.$el.style.display = "none"
            }
        }

    }

    onChatDeselectMobile = _ => {
        // VApp.router.replace("/")
        this.deselecting = true
        this.$el.classList.toggle("shown", false)
        this.noChatRef.$el.style.display = ""
        if (isDesktop()) {
            this.chatRef.$el.style.display = "none"
            this.chatRef.$el.classList.remove("responsive-selected-chat")
        }
    }

    onChatSelect = _ => {
        this.chatLoaderRef.$el.style.display = "none"

        if (AppSelectedChat.isSelected) {
            this.$el.classList.toggle("shown", true)
            this.noChatRef.$el.style.display = "none"
            if(isMobile()) {
                this.opening = true
                this.messagesLoaderRef.$el.style.display = "block"
                // AppSelectedChat.
            }
            // TODO delay for mobile
            // if(isDesktop()) {
            this.chatRef.$el.style.display = ""
            this.chatRef.$el.classList.add("responsive-selected-chat")
            // }
        } else {
            this.$el.classList.toggle("shown", false)
            this.noChatRef.$el.style.display = ""
            if (isDesktop()) {
                this.chatRef.$el.style.display = "none"
                this.chatRef.$el.classList.remove("responsive-selected-chat")
            }
        }

        this.chatLoaderRef.$el.style.display = "none"
    }

    openSearch = () => {
        if (isDesktop()) {
            UIEvents.Sidebars.fire("push", SearchSidebar)
        } else {
            UIEvents.General.fire("search.open")
        }
    }
}

export default ChatComponent