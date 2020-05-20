import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";
import UIEvents from "../../../../EventBus/UIEvents"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

class ChatInfoNameComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedChat.check(event.peer))
            .updateOn("updateName")

        E.bus(UIEvents.General)
            .updateOn("chat.select")
    }

    render() {
        if (AppSelectedChat.isNotSelected) {
            return <div className="title">...</div>
        }

        return (
            <div className="title" onClick={this.openPeerInfo}>
                {AppSelectedChat.Current.isSelf ? "Saved Messages" : AppSelectedChat.Current.name}
            </div>
        )
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.Current)
    }
}

export default ChatInfoNameComponent