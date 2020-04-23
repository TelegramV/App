import {Peer} from "./Peer";
import MTProto from "../../../MTProto/External";
import PeersStore from "../../Store/PeersStore"
import {UserPeer} from "./UserPeer"
import PeersManager from "../PeersManager"

export class GroupPeer extends Peer {

    _onlineCount = 0

    _participants: Array<UserPeer> = []

    constructor(rawPeer, dialog = undefined) {
        super(rawPeer, dialog)
    }

    set onlineCount(onlineCount) {
        if (onlineCount !== this._onlineCount) {
            this._onlineCount = onlineCount
            this.fire("updateChatOnlineCount")
        }
    }

    get onlineCount() {
        return this._onlineCount
    }

    refreshOnlineCount() {
        this.onlineCount = this._participants.filter(peer => peer.statusString.online).length
    }

    get participants(): Array<Peer> {
        return this._participants
    }

    set participants(peers: Array<UserPeer>) {
        this._participants = peers
        console.log(this._participants)
        this._participants.forEach(p => p && p.participateIn.add(this))
        this.refreshOnlineCount()
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("messages.getFullChat", {
            chat_id: this.id
        }).then(chatFull => {
            PeersManager.fillPeersFromUpdate(chatFull)

            this._full = chatFull.full_chat

            if (this.full.participants._ !== "chatParticipantsForbidden") {
                this.participants = this.full.participants.participants.map(ChatParticipant => {
                    return PeersStore.get("user", ChatParticipant.user_id)
                })
            }

            this.fire("fullLoaded")

            this.findPinnedMessage()
        })
    }

    get statusString() {
        let status = ""
        if (this.full) {
            const participantsCount = this.full.participants.participants.length
            const onlineCount = this.onlineCount

            const user = participantsCount === 1 ? "member" : "members"

            if (onlineCount > 0) {
                status = `${participantsCount} ${user}, ${onlineCount} online`
            } else {
                status = `${participantsCount} ${user}`
            }

        } else {
            status = "loading info..."
        }

        return {
            text: status,
            online: false
        }
    }

    /**
     * @return {string}
     */
    get name() {
        return this.raw.title || " "
    }

    /**
     * Get the type of peer
     * @returns {string}
     */
    get type() {
        return "chat"
    }
}