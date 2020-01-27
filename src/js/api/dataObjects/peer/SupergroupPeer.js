
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