import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedPeer from "../../../../Reactive/SelectedPeer"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import type {BusEvent} from "../../../../../Api/EventBus/EventBus"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"

class ChatInfoAvatarComponent extends VComponent {

    callbacks = {
        peer: AppSelectedPeer.Reactive.Default
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            // .callbackCondition("peer")
            .on("updatePhoto", this.peersUpdatePhoto)
            .on("updatePhotoSmall", this.peersUpdatePhoto)
    }

    render() {
        if (AppSelectedPeer.isNotSelected) {
            return (
                <div id="messages-photo"
                     className="avatar placeholder-1">
                    ...
                </div>
            )
        }

        const peer = AppSelectedPeer.Current
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
        AppSelectedInfoPeer.select(AppSelectedPeer.Current)
    }

    peersUpdatePhoto = (event: BusEvent) => {
        if (AppSelectedPeer.check(event.peer)) {
            this.forceUpdate()
        }
    }
}

export default ChatInfoAvatarComponent