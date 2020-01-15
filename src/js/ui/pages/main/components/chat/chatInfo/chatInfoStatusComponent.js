import {UserPeer} from "../../../../../../api/dataObjects/peer/userPeer"
import {ChannelPeer} from "../../../../../../api/dataObjects/peer/channelPeer"
import {SupergroupPeer} from "../../../../../../api/dataObjects/peer/supergroupPeer"
import {GroupPeer} from "../../../../../../api/dataObjects/peer/groupPeer"
import {BotPeer} from "../../../../../../api/dataObjects/peer/botPeer"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"
import AppEvents from "../../../../../../api/eventBus/appEvents"

const ChatInfoStatusComponent = {
    name: "ChatInfoStatusComponent",

    simpleState: {
        patchEvents: new Set([
            "updateUserStatus",
            "fullLoaded",
        ]),
    },

    h() {
        return (
            <div className="bottom">
                <div id="messages-online" className="info">{this.statusLine}</div>
            </div>
        )
    },

    mounted() {
        AppEvents.Peers.listenAny(event => {
            if (AppSelectedDialog.check(event.peer.dialog)) {
                if (this.simpleState.patchEvents.has(event.type)) {
                    this.__patch()
                }
            }
        })
    },

    get statusLine() {
        if (AppSelectedDialog.isNotSelected) {
            return "..."
        }

        const peer = AppSelectedDialog.Dialog.peer

        let status = ""

        if (peer instanceof UserPeer) {
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
                const user = peer.peer.participants_count === 1 ? "member" : "members"
                status = `${peer.peer.participants_count} ${user}, ${peer.full.online_count} online`
            } else {
                status = "loading info..."
            }
        } else if (peer instanceof BotPeer) {
            status = "bot"
        }

        return status
    }
}

export default ChatInfoStatusComponent