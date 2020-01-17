import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"
import AppFramework from "../../../../../framework/framework"

const ChatInfoNameComponent = AppFramework.createComponent({
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
                {peer.name}
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
})

export default ChatInfoNameComponent