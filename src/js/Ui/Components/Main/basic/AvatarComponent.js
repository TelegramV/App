import AppSelectedInfoPeer from "../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../../Api/EventBus/AppEvents";
import type {BusEvent} from "../../../../Api/EventBus/EventBus"

class AvatarComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            // .callbackCondition("peer")
            .on("updatePhoto", this.peersUpdatePhoto)
            .on("updatePhotoSmall", this.peersUpdatePhoto)
    }

    render() {
        const peer = this.props.peer
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

                    <div className="avatar-outer" css-opacity="0"/>
                </div>
            )
        }
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(this.props.peer)
    }

    peersUpdatePhoto = (event: BusEvent) => {
        this.forceUpdate()
    }
}

export default AvatarComponent