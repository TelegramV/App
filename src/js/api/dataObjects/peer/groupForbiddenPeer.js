import {Peer} from "./peer";

export class GroupForbiddenPeer extends Peer {

    constructor(rawPeer) {
        super(rawPeer)
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
        return "chatForbidden"
    }
}