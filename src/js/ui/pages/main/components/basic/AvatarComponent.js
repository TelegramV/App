import AppSelectedInfoPeer from "../../../../reactive/SelectedInfoPeer";
import {VComponent} from "../../../../v/vrdom/component/VComponent";
import AppEvents from "../../../../../api/eventBus/AppEvents";

class AvatarComponent extends VComponent {

    patchingStrategy = VRDOM.COMPONENT_PATCH_FAST

    appEvents(E) {
        E.bus(AppEvents.Peers)
            // .callbackCondition("peer")
            .on("updatePhoto", this.peersUpdatePhoto)
            .on("updatePhotoSmall", this.peersUpdatePhoto)
    }

    h() {
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
                     style={`background-image: url(${peer.photo.smallUrl});`}>
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
        AppSelectedInfoPeer.select(this.props.peer)
    }

    peersUpdatePhoto = (event: BusEvent) => {
        this.__patch()
    }
}

export default AvatarComponent