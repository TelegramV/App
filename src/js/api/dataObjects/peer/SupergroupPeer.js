
import {GroupPeer} from "./GroupPeer";
import MTProto from "../../../mtproto"
import AppEvents from "../../eventBus/AppEvents"

// It should actually extend from channel but who cares
export class SupergroupPeer extends GroupPeer {

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
            status = `${this.full.participants_count} ${user}, ${this.full.online_count} online`
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
            this.full = channelFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }
}