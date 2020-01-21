import AppEvents from "../../../../../../api/eventBus/appEvents"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"
import Component from "../../../../../framework/vrdom/component"

class ChatInfoNameComponent extends Component {
    constructor(props) {
        super(props)
    }

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
                {peer.isSelf ? "Saved Messages" : peer.name}
            </div>
        )
    }

    created() {
        console.log(`${this.name} created`)
    }

    mounted() {
        console.log(`${this.name} mounted`)

        AppEvents.Peers.subscribeAny(event => {
            if (AppSelectedDialog.check(event.peer.dialog)) {
                if (event.type === "updateName") {
                    this.__patch()
                }
            }
        })
    }
}

export default ChatInfoNameComponent