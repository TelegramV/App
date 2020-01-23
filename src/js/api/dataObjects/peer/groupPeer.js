import {Peer} from "./peer";
import MTProto from "../../../mtproto";
import AppEvents from "../../eventBus/appEvents";

export class GroupPeer extends Peer {

    constructor(rawPeer, dialog = undefined) {
        super(rawPeer, dialog)
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("messages.getFullChat", {
            chat_id: this.id
        }).then(chatFull => {
            this._full = chatFull.full_chat

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
        return "chat"
    }
}