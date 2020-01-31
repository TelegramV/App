import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../v/vrdom/Component"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

class ChatInfoAvatarComponent extends Component {
    constructor(props) {
        super(props)
    }

    h() {
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
                <div className="avatar placeholder-saved placeholder-icon">
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
                <div id="messages-photo"
                     className="avatar"
                     style={`background-image: url(${peer.photo.smallUrl});`}>
                </div>
            )
        } else {
            return (
                <div className={`avatar placeholder-${peer.photo.letter.num}`}>
                    <span>{peer.photo.letter.text}</span>

                    <div className="avatar-outer" css-opacity="0">

                    </div>

                </div>
            )
        }
    }

    mounted() {
        console.log(`${this.name} mounted`)

        AppEvents.Peers.subscribeAny(event => {
            if (AppSelectedPeer.check(event.peer)) {
                if (event.type === "updatePhoto" || event.type === "updatePhotoSmall") {
                    this.__patch()
                }
            }
        })
    }
}

export default ChatInfoAvatarComponent