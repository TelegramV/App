import Component from "../../../../../framework/vrdom/component"
import AppEvents from "../../../../../../api/eventBus/AppEvents"

export class MessageAvatarComponent extends Component {

    init() {
        this.appEvents = new Set([
            AppEvents.Peers.reactiveOnlySingle(this.props.message.from, "updatePhotoSmall").PatchOnly
        ])
    }

    h() {
        const hasAvatar = !this.props.message.from.photo.isEmpty

        const avatarClasses = `avatar` + (!hasAvatar ? ` placeholder-${this.props.message.from.photo.letter.num}` : "")
        const cssBackgroundImage = hasAvatar ? `url(${this.props.message.from.photo.smallUrl})` : "none"
        const letterText = !hasAvatar ? this.props.message.from.photo.letter.text : ""

        return (
            <div className={avatarClasses}
                 css-background-image={cssBackgroundImage}>
                {letterText}
            </div>
        )
    }
}