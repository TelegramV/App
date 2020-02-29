import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import UIEvents from "../../../../EventBus/UIEvents"

export class DialogInfoAvatarComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => AppSelectedInfoPeer.check(event.peer))
            .on("updatePhoto")
            .on("updatePhotoSmall")

        E.bus(UIEvents.General)
            .on("info.select")
    }

    render() {
        const peer = AppSelectedInfoPeer.Current

        if (!peer) {
            return (
                <div className="photo-container">
                    <img class="photo" alt="no photo"/>
                </div>
            )
        }

        let hasAvatar = !peer.photo.isEmpty && !peer.photo._isFetchingSmall

        if (peer.isSelf) {
            return (
                <div className="photo-container">
                    <div className="photo avatar placeholder-saved placeholder-icon">
                        <i className="tgico tgico-avatar_savedmessages"/>
                    </div>
                </div>
            )
        }

        if (peer.isDeleted) {
            return (
                <div className="photo-container">
                    <div className={`photo avatar placeholder-${peer.photo.letter.num} placeholder-icon`}>
                        <i className="tgico tgico-avatar_deletedaccount"/>
                    </div>
                </div>
            )
        }

        if (hasAvatar) {
            return (
                <div className={`photo-container avatar`}>
                    <span/>

                    <div className="avatar-outer" css-opacity="1">
                        <img className="photo avatar-inner" src={peer.photo.smallUrl} alt={peer.photo.letter.text}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={`photo-container avatar placeholder-${peer.photo.letter.num}`}>
                    <span>{peer.photo.letter.text}</span>
                    <div className="photo avatar-outer" css-opacity="0"/>
                </div>
            )
        }
    }
}