import AppEvents from "../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../Reactive/SelectedChat"
import VComponent from "../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../Reactive/SelectedInfoPeer"
import UIEvents from "../../../EventBus/UIEvents"

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

        const peer = AppSelectedChat.Current
        let hasAvatar = !peer.photo.isEmpty && !peer.photo._isFetchingSmall

        if (peer.isSelf) {
            return (
                <div onClick={this.openPeerInfo} className="avatar placeholder-saved placeholder-icon">
                    <i className="tgico tgico-avatar_savedmessages"/>
                </div>
            )
        }

        if (peer.isDeleted) {
            return (
                <div className={`avatar placeholder-${peer.photo.letter.num} placeholder-icon`}>
                    <i className="tgico tgico-avatar_deletedaccount"/>
                </div>
            )
        }

        if (hasAvatar) {
            return (
                <div onClick={this.openPeerInfo}
                     id="messages-photo"
                     className="avatar"
                     css-background-image={`url(${peer.photo.smallUrl})`}>
                </div>
            )
        } else {
            return (
                <div onClick={this.openPeerInfo} className={`avatar placeholder-${peer.photo.letter.num}`}>
                    <span>{peer.photo.letter.text}</span>

                    <div className="avatar-outer" css-opacity="0">

                    </div>

                </div>
            )
        }
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(AppSelectedChat.Current)
    }
}

export default ChatInfoAvatarComponent