import {UserPeer} from "../../../../../../api/dataObjects/peer/UserPeer"
import {ChannelPeer} from "../../../../../../api/dataObjects/peer/ChannelPeer"
import {SupergroupPeer} from "../../../../../../api/dataObjects/peer/SupergroupPeer"
import {GroupPeer} from "../../../../../../api/dataObjects/peer/GroupPeer"
import {BotPeer} from "../../../../../../api/dataObjects/peer/BotPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../v/vrdom/Component"
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"

const patchEvents = new Set([
    "updateUserStatus",
    "fullLoaded",
])

class ChatInfoStatusComponent extends Component {
    constructor(props) {
        super(props)

        this.appEvents = new Set([
            AppEvents.Peers.reactiveAny().FireOnly
        ])
    }

    get statusLine() {
        if (AppSelectedPeer.isNotSelected) {
            return "..."
        }

        const peer = AppSelectedPeer.Current

        return peer.statusString.text
    }

    h() {
        return (
            <div className="bottom">
                <div css-display={AppSelectedPeer.isSelected && AppSelectedPeer.isSelf ? "none" : ""}
                     id="messages-online" className="info">{this.statusLine}</div>
            </div>
        )
    }

    eventFired(bus, event) {
        if (bus === AppEvents.Peers) {
            if (AppSelectedPeer.check(event.peer)) {
                if (patchEvents.has(event.type)) {
                    this.__patch()
                }
            }
        }
    }
}

export default ChatInfoStatusComponent