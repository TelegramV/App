import { Peer } from "./Peer";
import MTProto from "../../../MTProto/External";
import PeersStore from "../../Store/PeersStore"
import { UserPeer } from "./UserPeer"
import PeersManager from "../PeersManager"

export class GroupPeer extends Peer {

    _onlineCount = 0

    _participants: Array < UserPeer > = []

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
        this.onlineCount = this._participants.filter(peer => peer.online).length
    }

    get participants(): Array < Peer > {
        return this._participants
    }

    set participants(peers: Array < UserPeer > ) {
        this._participants = peers
        //console.log(this._participants)
        this._participants.forEach(p => p && p.participateIn.add(this))
        this.refreshOnlineCount()
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        if (this._full) return Promise.resolve(this._full);
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
            this._photo.fillFull(this._full.chat_photo);

            return this._full;
        })
    }

    get status() {
        if (!this.full) {
            return {
                key: "lng_profile_loading",
                //isLoading: true
            }
        }
        const participantsCount = this.full.participants.participants.length
        const onlineCount = this.onlineCount

        const members = {
            key: "lng_chat_status_members",
            count: participantsCount,
            replaces: {
                count: participantsCount
            }
        }

        if (onlineCount > 0) {
            console.log(onlineCount)
            return {
                key: "lng_chat_status_members_online",
                replaces: {
                    members_count: members,
                    online_count: {
                        key: "lng_chat_status_online",
                        count: onlineCount,
                        replaces: {
                            count: onlineCount
                        }
                    }
                }
            }
        } else {
            return members;
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