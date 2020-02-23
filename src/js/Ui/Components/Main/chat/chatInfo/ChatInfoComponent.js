import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedPeer from "../../../../Reactive/SelectedPeer"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import ChatInfoAvatarComponent from "./ChatInfoAvatarComponent"
import VF from "../../../../../V/VFramework"

class ChatInfoComponent extends VComponent {

    render() {
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
        VF.router.replace("/")
    }
}

export default ChatInfoComponent