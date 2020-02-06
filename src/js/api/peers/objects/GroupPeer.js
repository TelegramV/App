import {Peer} from "./Peer";
import MTProto from "../../../mtproto/external";
import AppEvents from "../../eventBus/AppEvents";

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
            this.full = chatFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }

    get statusString() {
        let status = ""
        if (this.full) {
            const user = this.full.participants_count === 1 ? "member" : "members"
            status = `${this.full.participants_count} ${user}, ${this.full.online_count} online`
        } else {
            status = "loading info..."
        }

        return {
            text: status,
            online: false
        }
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