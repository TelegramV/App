import AppEvents from "../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../EventBus/UIEvents"
import AvatarFragment from "../../Basic/AvatarFragment"

class ChatInfoAvatarComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => event.peer === AppSelectedChat.Current)
            .on("updatePhoto")
            .on("updatePhotoSmall")

        E.bus(UIEvents.General)
            .on("chat.select")
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