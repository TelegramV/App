import {Peer} from "./Peer";
import AppEvents from "../../eventBus/AppEvents";
import {XProto} from "../../../mtproto/XProto"

export class GroupPeer extends Peer {

    constructor(rawPeer, dialog = undefined) {
        super(rawPeer, dialog)
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return XProto.invokeMethod("messages.getFullChat", {
            chat_id: this.id
        }).then(chatFull => {
            this.full = chatFull.full_chat

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