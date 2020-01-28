import {Peer} from "./Peer";
import AppEvents from "../../eventBus/AppEvents";
import {XProto} from "../../../mtproto/XProto"

export class ChannelPeer extends Peer {

    constructor(rawPeer, dialog = undefined) {
        super(rawPeer, dialog)
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