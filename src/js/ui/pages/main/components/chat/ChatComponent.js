import {PinnedComponent} from "../../../../pinnedController"
import LoaderComponent from "../loading/LoaderComponent"
import ChatInfoComponent from "./chatInfo/ChatInfoComponent"
import BubblesComponent from "./BubblesComponent"
import {ChatInputComponent} from "./chatInput/ChatInputComponent";
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import VF from "../../../../v/VFramework"
import UIEvents from "../../../../eventBus/UIEvents"
import VComponent from "../../../../v/vrdom/component/VComponent"

/**
 * CRITICAL: never rerender this component!
 */
class ChatComponent extends VComponent {

    noChatRef = VComponent.createRef()
    chatRef = VComponent.createRef()
    chatLoaderRef = VComponent.createRef()
    messagesLoaderRef = VComponent.createRef()

    init() {
        this.callbacks = {
            peer: AppSelectedPeer.Reactive.FireOnly,
        }
    }

    h() {
        return (
            <div class="chat-wrapper">
                <div id="wallpaper" class="wallpaper blur"/>

                <div ref={this.noChatRef} id="noChat">
                    <LoaderComponent loaderRef={this.chatLoaderRef}
                                     id="chat-wrapper-loader"
                                     full={true}
                                     show={true}
                                     background={true}
                                     white={true}/>
                </div>

                <div ref={this.chatRef} id="chat" css-display="none">
                    <div id="topbar">
                        <ChatInfoComponent/>
                        <PinnedComponent/>
                        <div className="btn-icon rp rps tgico-search" onClick={this.openSearch}/>
                        <div className="btn-icon rp rps tgico-more"/>
                    </div>

                    <LoaderComponent loaderRef={this.messagesLoaderRef}
                                     id="messages-wrapper-messages-loader"
                                     full={true} white={true}
                                     show={true}
                                     background={true}/>

                    <BubblesComponent loaderRef={this.messagesLoaderRef}/>
                    <ChatInputComponent ref="chatInput"/>
                </div>
            </div>
        )
    }

    mounted() {
        if (!VF.router.activeRoute.queryParams.p) {
            this.noChatRef.$el.style.display = ""
            this.chatLoaderRef.$el.style.display = "none"
        }
    }

    callbackChanged(key: string, value) {
        if (key === "peer") {
            this.chatLoaderRef.$el.style.display = "none"

            if (value) {
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
    }

    openSearch = () => {
        UIEvents.RightSidebar.fire("show", {
            barName: "messages-search"
        })
    }
}

export default ChatComponent