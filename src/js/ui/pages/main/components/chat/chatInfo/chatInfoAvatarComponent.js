import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"
import Component from "../../../../../framework/vrdom/component"

class ChatInfoAvatarComponent extends Component {
    constructor(props) {
        super(props)
    }

    h() {
        if (AppSelectedDialog.isNotSelected) {
            return (
                <div id="messages-photo"
                     className="avatar placeholder-1">
                    ...
                </div>
            )
        }

        const dialog = AppSelectedDialog.Dialog
        let hasAvatar = !dialog.peer.photo.isEmpty && !dialog.peer.photo._isFetchingSmall

        if (dialog.peer.isSelf) {
            return (
                <div className="avatar placeholder-saved placeholder-icon">
                    <i className="tgico tgico-avatar_savedmessages"/>
                </div>
            )
        }

        if (dialog.peer.isDeleted) {
            return (
                <div className={`avatar placeholder-${dialog.peer.photo.letter.num} placeholder-icon`}>
                    <i className="tgico tgico-avatar_deletedaccount"/>
                </div>
            )
        }
        if (hasAvatar) {
            return (
                <div id="messages-photo"
                     className="avatar"
                     style={`background-image: url(${dialog.peer.photo.smallUrl});`}>
                </div>
            )
        } else {
            return (
                <div className={`avatar placeholder-${dialog.peer.photo.letter.num}`}>
                    <span>{dialog.peer.photo.letter.text}</span>

                    <div className="avatar-outer" css-opacity="0">

                    </div>

                </div>
            )
        }
    }

    mounted() {
        AppEvents.Peers.subscribeAny(event => {
            if (AppSelectedDialog.check(event.peer.dialog)) {
                if (event.type === "updatePhoto" || event.type === "updatePhotoSmall") {
                    this.__patch()
                }
            }
        })
    }
}

export default ChatInfoAvatarComponent