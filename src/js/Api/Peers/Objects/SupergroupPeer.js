import MTProto from "../../../MTProto/external"
import AppEvents from "../../EventBus/AppEvents"
import PeersManager from "./PeersManager"
import {ChannelPeer} from "./ChannelPeer";

export class SupergroupPeer extends ChannelPeer {

    constructor(rawPeer) {
        super(rawPeer)
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
        if (this.full) {
            const user = this.full.participants_count === 1 ? "member" : "members"

            // if (this.full.online_count > 0) { // implement online later
            //     status = `${this.full.participants_count} ${user}, ${this.full.online_count} online`
            // } else {
            status = `${this.full.participants_count} ${user}`
            // }

        } else {
            status = "loading info..."
        }

        return {
            text: status,
            online: false
        }
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            PeersManager.fillPeersFromUpdate(channelFull)

            this._full = channelFull.full_chat

            console.log(channelFull)

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
            this.findPinnedMessage()
        })
    }
}