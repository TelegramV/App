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
            <div id="chat">
                <LoaderComponent id="messages-wrapper-full-loader" full={true} show={false}/>

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
        )
    }

    reactiveChanged(key, value) {
        if (key === "dialog") {
            if (value) {
                this.$el.classList.add("responsive-selected-chat")
            } else {
                this.$el.classList.remove("responsive-selected-chat")
            }
        }
    }
}

export default ChatComponent