import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"

const ChatInfoAvatarComponent = {
    name: "ChatInfoAvatarComponent",
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
                 className={"avatar " + (!peer.hasAvatar ? `placeholder-${peer.avatarLetter.num}` : "")}
                 style={`background-image: url(${peer._avatar});`}>
                {!peer.hasAvatar ? peer.avatarLetter.text[0] : ""}
            </div>
        )
    },

    mounted() {
        AppEvents.Peers.listenAny(event => {
            if (AppSelectedDialog.check(event.peer.dialog)) {
                if (event.type === "updatePhoto") {
                    this.__patch()
                }
            }
        })
    },
}

export default ChatInfoAvatarComponent