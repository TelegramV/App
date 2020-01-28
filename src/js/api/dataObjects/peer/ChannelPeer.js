import {Peer} from "./Peer";
import MTProto from "../../../mtproto";
import AppEvents from "../../eventBus/AppEvents";

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

    get statusString() {
        let status = ""
        if (this.full) {
            const user = this.full.participants_count === 1 ? "member" : "members"
            status = `${this.full.participants_count} ${user}`
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