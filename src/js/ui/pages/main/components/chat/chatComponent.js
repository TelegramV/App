import {Pinned} from "../../../../pinnedController"
import LoaderComponent from "../loading/loader"
import ChatInfoComponent from "./chatInfo/chatInfoComponent"
import Component from "../../../../framework/vrdom/component"
import BubblesComponent from "./bubblesComponent"
import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"
import {ChatInputComponent} from "./chatInput/chatInputComponent";

/**
 * CRITICAL: never rerender this component!
 */
class ChatComponent extends Component {
    constructor(props) {
        super(props)
        this.reactive = {
            dialog: AppSelectedDialog.Reactive.FireOnly,
        }
    }

    h() {
        return (
            <div class="chat-wrapper">
                <div id="noChat">
                    <div className="placeholder tgico tgico-chatsplaceholder"/>
                    <div className="text"><p>Open Chat</p> <p>or create a new one</p></div>
                    <div className="buttons">
                        <div className="button-wrapper">
                            <div className="button rp"><i className="tgico tgico-newprivate"/></div>
                            <p>Private</p>
                        </div>
                        <div className="button-wrapper">
                            <div className="button rp"><i className="tgico tgico-newgroup"/></div>
                            <p>Group</p>
                        </div>
                        <div className="button-wrapper">
                            <div className="button rp"><i className="tgico tgico-newchannel"/></div>
                            <p>Channel</p>
                        </div>
                    </div>
                </div>
                <div id="chat" css-display="none">
                    <div id="topbar">
                        <ChatInfoComponent/>
                        <Pinned/>
                        <div className="btn-icon rp rps tgico-search"/>
                        <div className="btn-icon rp rps tgico-more"/>
                    </div>

                    <LoaderComponent id="messages-wrapper-messages-loader" full={true} show={true}/>

                    <BubblesComponent/>
                    <ChatInputComponent/>
                </div>
            </div>
        )
    }

    mounted() {
        this.$noChat = this.$el.querySelector("#noChat")
        this.$chat = this.$el.querySelector("#chat")
    }

    reactiveChanged(key, value) {
        if (key === "dialog") {
            if (value) {
                this.$noChat.style.display = "none"
                this.$chat.style.display = ""
                this.$chat.classList.add("responsive-selected-chat")
            } else {
                this.$noChat.style.display = ""
                this.$chat.style.display = "none"
                this.$chat.classList.remove("responsive-selected-chat")
            }
        }
    }
}

export default ChatComponent