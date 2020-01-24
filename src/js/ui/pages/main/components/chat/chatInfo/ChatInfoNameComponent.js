import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../framework/vrdom/component"
import AppSelectedPeer from "../../../../../reactive/selectedPeer"

class ChatInfoNameComponent extends Component {
    constructor(props) {
        super(props)
    }

    h() {
        if (AppSelectedPeer.isNotSelected) {
            return (
                <div id="messages-title" className="title">
                    ...
                </div>
            )
        }

        const peer = AppSelectedPeer.Current

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
            if (AppSelectedPeer.check(event.peer)) {
                if (event.type === "updateName") {
                    this.__patch()
                }
            }
        })
    }
}

export default ChatInfoNameComponent