import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import VApp from "../../../../../V/vapp"
import UIEvents from "../../../../EventBus/UIEvents"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

class ChatInfoComponent extends StatelessComponent {

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    render() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <div class="responsive-only-mobile btn-icon tgico-back" onClick={this.backToMainPage}/>

                    <ChatInfoAvatarComponent/>

                    <div className="content" onClick={this.openPeerInfo}>

                        <div className="top">
                            <ChatInfoNameComponent/>
                        </div>

                        <ChatInfoStatusComponent/>
                    </div>
                </div>
            </div>
        )
    }

    onChatSelect = () => {
        AppSelectedChat.current.fetchFull()
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.current)
    }

    backToMainPage = () => {
        VApp.router.replace("/")
    }
}

export default ChatInfoComponent