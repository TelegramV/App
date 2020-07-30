import MTProto from "../../../MTProto/External"
import PeersManager from "../PeersManager"
import {ChannelPeer} from "./ChannelPeer";

export class SupergroupPeer extends ChannelPeer {

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

    get statusString() {
        let status = ""
        let isLoading = false
        if (this.full) {
            const user = this.full.participants_count === 1 ? "member" : "members"

            // if (this.full.online_count > 0) { // implement online later
            //     status = `${this.full.participants_count} ${user}, ${this.full.online_count} online`
            // } else {
            status = `${this.full.participants_count} ${user}`
            // }

        } else {
            status = "loading info"
            isLoading = true
        }

        return {
            text: status,
            online: false,
            isLoading
        }
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