import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer";
import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import V from "../../../../../v/VFramework"

class ChatInfoComponent extends VComponent {

    h() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <button class="responsive-only-mobile" onClick={this._backToMainPage}>
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
        AppSelectedInfoPeer.select(AppSelectedPeer.Current)
    }

    _backToMainPage = () => {
        V.router.replace("/")
    }
}

export default ChatInfoComponent