import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"

const ChatInfoNameComponent = {
    name: "ChatInfoAvatarComponent",
    h() {
        if (AppSelectedDialog.isNotSelected) {
            return (
                <div id="messages-title" className="title">
                    ...
                </div>
            )
        }

        const peer = AppSelectedDialog.Dialog.peer

        return (
            <div id="messages-title" className="title">
                {peer.peerName}
            </div>
        )
    },

    mounted() {
        AppEvents.Peers.listenAny(event => {
            if (AppSelectedDialog.check(event.peer.dialog)) {
                if (event.type === "updateName") {
                    this.__patch()
                }
            }
        })
    },
}

export default ChatInfoNameComponent