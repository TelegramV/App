import {Peer} from "./peer";

export class ChannelForbiddenPeer extends Peer {

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
        return "channelForbidden"
    }
}