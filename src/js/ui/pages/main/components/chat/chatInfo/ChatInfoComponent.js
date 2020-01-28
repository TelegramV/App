import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import Component from "../../../../../v/vrdom/Component"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer";

class ChatInfoComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            peer: AppSelectedPeer.Reactive.Default
        }
    }

    h() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info" onClick={this.openPeerInfo}>
                <div className="person">

                    <button class="responsive-only-mobile" onClick={this._backToMainPage}>
                        {"<-"}
                    </button>

                    <ChatInfoAvatarComponent/>

                    <div className="content">

                        <div className="top">
                            <ChatInfoNameComponent/>
                        </div>

                        <ChatInfoStatusComponent/>
                    </div>
                </div>
            </div>
        )
    }

    openPeerInfo() {
        AppSelectedInfoPeer.select(AppSelectedPeer.Current)
    }

    _backToMainPage() {
        V.router.replace("/")
    }
}

export default ChatInfoComponent