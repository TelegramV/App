import {Peer} from "./peer";
import MTProto from "../../../mtproto";
import AppEvents from "../../eventBus/appEvents";

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
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            this._full = channelFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }
}