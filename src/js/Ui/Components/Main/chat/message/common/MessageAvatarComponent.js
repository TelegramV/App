import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer";
import type {Message} from "../../../../../../Api/Messages/Message"
import AppSelectedPeer from "../../../../../Reactive/SelectedPeer"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import VUI from "../../../../../VUI"

export class MessageAvatarComponent extends VComponent {

    init() {
        this.show = this.props.show === undefined ? true : this.props.show
        let message: Message = this.props.message
        this.from = message.from

        if (message.forwarded && message.raw.fwd_from && (message.raw.fwd_from.saved_from_peer || message.raw.fwd_from.saved_from_msg_id)) {
            this.from = message.forwarded
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("updatePhotoSmall", this.onPhotoUpdated)
            .on("updatePhoto", this.onPhotoUpdated)
    }

    render() {
        if (AppSelectedPeer.check(this.props.message.from) && !this.props.message.forwarded) {
            return <div/>
        }

        if (!this.show) {
            return <div id={this.props.id} className="avatar"/>
        }

        const hasAvatar = !this.from.photo.isEmpty

        const avatarClasses = `avatar` + (!hasAvatar ? ` placeholder-${this.from.photo.letter.num}` : "")
        const cssBackgroundImage = hasAvatar ? `url(${this.from.photo.smallUrl})` : undefined
        const letterText = !hasAvatar ? this.from.photo.letter.text : ""

        return (
            <div id={this.props.id}
                 className={avatarClasses}
                 css-background-image={cssBackgroundImage} onClick={this.openPeerInfo}>
                {letterText}
            </div>
        )
    }

    onPhotoUpdated = event => {
        if (event.peer === this.from) {
            this.forceUpdate()
        }
    }

    hide = () => {
        VUI.showElement(this.$el)
        this.show = false
    }

    openPeerInfo = () => {
        AppSelectedInfoPeer.select(this.from)
    }
}