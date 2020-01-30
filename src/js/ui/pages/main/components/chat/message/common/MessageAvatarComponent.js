import Component from "../../../../../../v/vrdom/Component"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import AppSelectedInfoPeer from "../../../../../../reactive/SelectedInfoPeer";
import type {Message} from "../../../../../../../api/messages/Message"
import {Peer} from "../../../../../../../api/dataObjects/peer/Peer"

export class MessageAvatarComponent extends Component {

    init() {
        let message: Message = this.props.message
        this.from = message.from

        if (message.forwarded && message.raw.fwd_from && (message.raw.fwd_from.saved_from_peer || message.raw.fwd_from.saved_from_msg_id)) {
            this.from = message.forwarded
        }

        this.appEvents = new Set([
            AppEvents.Peers.reactiveOnlySingle(this.from, "updatePhotoSmall").PatchOnly
        ])
    }

    h() {

        const hasAvatar = !this.from.photo.isEmpty

        const avatarClasses = `avatar` + (!hasAvatar ? ` placeholder-${this.from.photo.letter.num}` : "")
        const cssBackgroundImage = hasAvatar ? `url(${this.from.photo.smallUrl})` : "none"
        const letterText = !hasAvatar ? this.from.photo.letter.text : ""

        return (
            <div className={avatarClasses}
                 css-background-image={cssBackgroundImage} onClick={this.openPeerInfo}>
                {letterText}
            </div>
        )
    }

    openPeerInfo() {
        AppSelectedInfoPeer.select(this.from)
    }
}