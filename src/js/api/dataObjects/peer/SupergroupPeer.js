import {GroupPeer} from "./GroupPeer";
import AppEvents from "../../eventBus/AppEvents"
import {XProto} from "../../../mtproto/XProto"


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
        return XProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            this.full = channelFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }
}