
import {GroupPeer} from "./groupPeer";

// It should actually extend from channel but who cares
export class SupergroupPeer extends GroupPeer {
    /**
     * Get the type of peer
     * @returns {string}
     */
    get type() {
        return "channel"
    }
}