import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"
import Component from "../../../../../framework/vrdom/component"

class ChatInfoAvatarComponent extends Component {
    h() {
        if (AppSelectedDialog.isNotSelected) {
            return (
                <div id="messages-photo"
                     className="avatar placeholder-1">
                    ...
                </div>
            )
        }

        const peer = AppSelectedDialog.Dialog.peer

        return (
            <div id="messages-photo"
                 className={"avatar " + (peer.photo.isEmpty ? `placeholder-${peer.photo.letter.num}` : "")}
                 style={`background-image: url(${peer.photo.smallUrl});`}>
                {peer.photo.isEmpty ? peer.photo.letter.text : ""}
            </div>
        )
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