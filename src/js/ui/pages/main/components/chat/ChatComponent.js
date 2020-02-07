import {PinnedComponent} from "../../../../pinnedController"
import LoaderComponent from "../loading/LoaderComponent"
import ChatInfoComponent from "./chatInfo/ChatInfoComponent"
import Component from "../../../../v/vrdom/Component"
import BubblesComponent from "./BubblesComponent"
import {ChatInputComponent} from "./chatInput/ChatInputComponent";
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import VF from "../../../../v/VFramework"
import UIEvents from "../../../../eventBus/UIEvents"

/**
 * CRITICAL: never rerender this component!
 */
class ChatComponent extends Component {
    constructor(props) {
        super(props)
        this.reactive = {
            peer: AppSelectedPeer.Reactive.FireOnly,
        }
    }

    h() {
        return (
            <div class="chat-wrapper">
                <div id="wallpaper" class="wallpaper blur"></div>
                <div id="noChat">
                    <LoaderComponent id="chat-wrapper-loader" full={true} show={true}/>
                </div>
                <div id="chat" css-display="none">
                    <div id="topbar">
                        <ChatInfoComponent/>
                        <PinnedComponent/>
                        <div className="btn-icon rp rps tgico-search" onClick={this._openSearch}/>
                        <div className="btn-icon rp rps tgico-more"/>
                    </div>

                    <LoaderComponent id="messages-wrapper-messages-loader" full={true} white={true} show={true}
                                     background={true}/>

                    <BubblesComponent/>
                    <ChatInputComponent ref="chatInput"/>
                </div>
            </div>
        )
    }

    mounted() {
        this.$noChat = this.$el.querySelector("#noChat")
        this.$chat = this.$el.querySelector("#chat")
        this.$wrapperLoader = this.$el.querySelector("#chat-wrapper-loader")

        if (!VF.router.activeRoute.queryParams.p) {
            this.$noChat.style.display = ""
            this.$wrapperLoader.style.display = "none"
        }
    }

    reactiveChanged(key, value, event) {
        if (key === "peer") {
            this.$wrapperLoader.style.display = "none"

            if (value) {
                this.$noChat.style.display = "none"
                this.$chat.style.display = ""
                this.$chat.classList.add("responsive-selected-chat")
            } else {
                this.$noChat.style.display = ""
                this.$chat.style.display = "none"
                this.$chat.classList.remove("responsive-selected-chat")
            }

            this.$wrapperLoader.style.display = "none"
        }
    }

    _openSearch = () => {
        UIEvents.RightSidebar.fire("show", {
            barName: "messages-search"
        })
    }
}

export default ChatComponent