import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import AvatarFragment from "../../../Basic/AvatarFragment"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

class ChatInfoAvatarComponent extends StatelessComponent {
    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => event.peer === AppSelectedChat.Current)
            .updateOn("updatePhoto")
            .updateOn("updatePhotoSmall")

        E.bus(UIEvents.General)
            .updateOn("chat.select")
    }

    render() {
        if (AppSelectedChat.isNotSelected) {
            return (
                <div id="messages-photo"
                     className="avatar placeholder-1">
                    ...
                </div>
            )
        }

        return <AvatarFragment peer={AppSelectedChat.Current} saved={true}/>
    }
}

export default ChatInfoAvatarComponent