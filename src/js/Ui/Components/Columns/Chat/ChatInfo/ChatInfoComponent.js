import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import VApp from "../../../../../V/vapp"

class ChatInfoComponent extends VComponent {

    render() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <button class="responsive-only-mobile btn btn-flat" onClick={this.backToMainPage}>
                        {"<-"}
                    </button>

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

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.Current)
    }

    backToMainPage = () => {
        VApp.router.replace("/")
    }
}

export default ChatInfoComponent