import {Peer} from "./peer";

export class GroupForbiddenPeer extends Peer {

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
        return "chatForbidden"
    }
}