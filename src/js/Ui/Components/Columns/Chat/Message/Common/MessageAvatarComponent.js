import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer";
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer"
import AppSelectedChat from "../../../../../Reactive/SelectedChat"
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"

export class MessageAvatarComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.message.from)
            .updateOn("updatePhotoSmall")
            .updateOn("updatePhoto")
    }

    render({message, show = true}) {
        let from = message.from

        if (message.forwarded && message.raw.fwd_from && (message.raw.fwd_from.saved_from_peer || message.raw.fwd_from.saved_from_msg_id)) {
            from = message.forwarded
        }

        if (message.to instanceof UserPeer) {
            return <div className="avatar remove"/>
        }

        if (AppSelectedChat.check(from) && !message.forwarded) {
            return <div className="avatar"/>
        }

        if (!show) {
            return <div className="avatar"/>
        }

        const hasAvatar = !from.photo.isEmpty

        const avatarClasses = `avatar` + (!hasAvatar ? ` placeholder-${from.photo.letter.num}` : "")
        const cssBackgroundImage = hasAvatar ? `url(${from.photo.smallUrl})` : undefined
        const letterText = !hasAvatar ? from.photo.letter.text : ""

        return (
            <div className={avatarClasses}
                 css-background-image={cssBackgroundImage} onClick={this.openPeerInfo}>
                {letterText}
            </div>
        )
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(this.props.message.from)
    }
}