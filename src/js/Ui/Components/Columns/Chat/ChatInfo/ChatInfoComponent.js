import ChatInfoStatusComponent from "./ChatInfoStatusComponent"
import ChatInfoNameComponent from "./ChatInfoNameComponent"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import VApp from "../../../../../V/vapp"
import UIEvents from "../../../../EventBus/UIEvents"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AvatarComponent from "../../../Basic/AvatarComponent"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";

class ChatInfoComponent extends StatelessComponent {

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
        E.bus(AppEvents.Dialogs)
            .updateOn("gotMany")
            .updateOn("gotNewMany")
    }

    render() {
        const unreadCount = FoldersManager.getBadgeCount(null)?.count
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <div class="responsive-only-mobile btn-icon tgico-back" onClick={this.backToMainPage}>
                        {unreadCount && <div class="unread-badge">{unreadCount}</div>}
                    </div>

                    <AvatarComponent peer={AppSelectedChat.current}/>

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
        if (!AppSelectedChat.current?.full) {
            AppSelectedChat.current?.fetchFull()
        }
        this.forceUpdate();
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.current)
    }

    backToMainPage = () => {
        UIEvents.General.fire("chat.deselectMobile", {})
        // VApp.router.replace("/")
    }
}

export default ChatInfoComponent