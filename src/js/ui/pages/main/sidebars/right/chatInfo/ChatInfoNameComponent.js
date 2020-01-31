import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../v/vrdom/Component"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer";

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
            <div id="messages-title" className="title" onClick={this.openPeerInfo}>
                {peer.isSelf ? "Saved Messages" : peer.name}
            </div>
        )
    }

    openPeerInfo() {
        AppSelectedInfoPeer.select(AppSelectedPeer.Current)
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