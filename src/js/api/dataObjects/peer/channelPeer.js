import {Peer} from "./peer";
import MTProto from "../../../mtproto";
import AppEvents from "../../eventBus/appEvents";

export class ChannelPeer extends Peer {

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.inputPeer
        }).then(channelFull => {
            this._full = channelFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
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
}