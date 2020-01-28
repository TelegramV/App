import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../v/vrdom/Component"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

class ChatInfoNameComponent extends Component {
    constructor(props) {
        super(props)

        this.appEvents = new Set([
            AppEvents.Peers.reactiveAny().FireOnly
        ])
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

    eventFired(bus, event) {
        if (bus === AppEvents.Peers) {
            if (AppSelectedPeer.check(event.peer)) {
                if (event.type === "updateName") {
                    this.__patch()
                }
            }
        }
    }
}

export default ChatInfoNameComponent