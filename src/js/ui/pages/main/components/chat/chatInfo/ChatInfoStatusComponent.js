import {UserPeer} from "../../../../../../api/dataObjects/peer/UserPeer"
import {ChannelPeer} from "../../../../../../api/dataObjects/peer/ChannelPeer"
import {SupergroupPeer} from "../../../../../../api/dataObjects/peer/SupergroupPeer"
import {GroupPeer} from "../../../../../../api/dataObjects/peer/GroupPeer"
import {BotPeer} from "../../../../../../api/dataObjects/peer/BotPeer"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import Component from "../../../../../v/vrdom/component"
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

        let status = ""

        if (peer.id === 777000) {
            status = "service notifications"
        } else if (peer instanceof UserPeer) {
            if (peer.onlineStatus.status === "bot") {
                status = peer.onlineStatus.status
            } else {
                status = peer.onlineStatus.online ? "online" : "last seen " + peer.onlineStatus.status
            }
        } else if (peer instanceof ChannelPeer) {
            if (peer.full) {
                const user = peer.full.participants_count === 1 ? "member" : "members"
                status = `${peer.full.participants_count} ${user}`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof SupergroupPeer) {
            if (peer.full) {
                const user = peer.full.participants_count === 1 ? "member" : "members"
                status = `${peer.full.participants_count} ${user}, ${peer.full.online_count} online`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof GroupPeer) {
            if (peer.full) {
                const user = peer.raw.participants_count === 1 ? "member" : "members"
                status = `${peer.raw.participants_count} ${user}, ${peer.full.online_count} online`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof BotPeer) {
            status = "bot"
        }

        return status
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