import AppSelectedInfoPeer from "../../../Reactive/SelectedInfoPeer";
import VComponent from "../../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../../Api/EventBus/AppEvents";

class AvatarComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .condition(event => event.peer === this.props.peer)
            .on("updatePhoto")
            .on("updatePhotoSmall")
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
}

export default AvatarComponent