import MTProto from "../../../MTProto/External"
import PeersManager from "../PeersManager"
import {ChannelPeer} from "./ChannelPeer";
import Locale from "../../Localization/Locale"

export class SupergroupPeer extends ChannelPeer {

    channelParticipants = new Map();

    constructor(rawPeer) {
        super(rawPeer)
    }

    get canSendMessage() {
        return this.canPostMessages || !this.bannedRights.send_messages
    }

    /**
     * Get the type of peer
     * @returns {string}
     */
    get type() {
        return "channel"
    }

    get status() {
        if (!this.full) {
            return {
                key: "lng_profile_loading",
                //isLoading: true
            }
        }
        const participantsCount = this.full.participants_count
        const onlineCount = this.full.online_count
        const members = {
            key: "lng_chat_status_members",
            count: participantsCount,
            replaces: {
                count: participantsCount
            }
        }

        if (onlineCount > 0) {
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

    getPeerRank(peer) {
        let participant = this.channelParticipants.get(peer.id);
        if(participant) {
            let rank = "";
            if(participant._ === "channelParticipantCreator") rank = Locale.l("lng_owner_badge");
            if(participant._ === "channelParticipantAdmin") rank = Locale.l("lng_admin_badge");
            if(participant.rank) rank = participant.rank;
            return rank;
        } else {
            this.fetchPeer(peer);
            return "";
        }
    }

    fetchPeer(peer) {
        return MTProto.invokeMethod("channels.getParticipant", {
            channel: this.input,
            user_id: peer.input,
        }).then(part => {
            this.channelParticipants.set(peer.id, part.participant)
            this.fire("peer.updateRank", {
                user: peer
            })
            return part.participant;
        }).catch(ex => {
            this.channelParticipants.set(peer.id, null); //user not participant
        })
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        if(this._full) return Promise.resolve(this._full);
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            PeersManager.fillPeersFromUpdate(channelFull)

            this._full = channelFull.full_chat

            this.fire("fullLoaded")

            this.findPinnedMessage()
            this._photo.fillFull(this._full.chat_photo);

            return this._full;
        })
    }

    get isSupergroup() {
        return true
    }
}