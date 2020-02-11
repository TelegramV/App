import {Peer} from "./Peer";
import MTProto from "../../../mtproto/external";
import AppEvents from "../../eventBus/AppEvents";
import PeersManager from "./PeersManager"

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

    get adminRights() {
        return (this.raw.admin_rights && this.raw.admin_rights.pFlags) || {}
    }

    get isCreator(): boolean {
        return !!this.raw.pFlags.creator
    }

    get canPostMessages(): boolean {
        return this.isCreator || !!this.adminRights.post_messages
    }

    get canChangeInfo(): boolean {
        return this.isCreator || !!this.adminRights.change_info
    }

    get canEditMessages(): boolean {
        return this.isCreator || !!this.adminRights.edit_messages
    }

    get canDeleteMessages(): boolean {
        return this.isCreator || !!this.adminRights.delete_messages
    }

    get canPinMessages(): boolean {
        return this.isCreator || !!this.adminRights.pin_messages
    }

    get canBanUsers(): boolean {
        return this.isCreator || !!this.adminRights.ban_users
    }

    get canInviteUsers(): boolean {
        return this.isCreator || !!this.adminRights.invite_users
    }

    get canAddAdmins(): boolean {
        return this.isCreator || !!this.adminRights.add_admins
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            PeersManager.fillPeersFromUpdate(channelFull)

            this._full = channelFull.full_chat

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }
}