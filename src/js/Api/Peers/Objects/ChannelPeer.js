import {Peer} from "./Peer";
import MTProto from "../../../MTProto/External";
import PeersManager from "../PeersManager"

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

    get status() {
        if (!this.full) {
            return {
                key: "lng_profile_loading",
                //isLoading: true
            }
        }
        let subscribers = this.full.participants_count;
        return {
            key: "lng_chat_status_subscribers",
            count: subscribers,
            replaces: {
                count: subscribers
            }
        }

    }

    get bannedRights() {
        return this.raw.bannedRights || this.raw.bannedRights || {}
    }

    get adminRights() {
        return (this.raw.admin_rights && this.raw.admin_rights) || {}
    }

    get isCreator(): boolean {
        return !!this.raw.creator
    }

    get canPostMessages(): boolean {
        return (this.isCreator || !!this.adminRights.post_messages) && !this.isLeft
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

    get canSendMessage() {
        return this.canPostMessages
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        if(this._full) return Promise.resolve(this._full);
        return MTProto.invokeMethod("channels.getFullChannel", {
            channel: this.input
        }).then(channelFull => {
            PeersManager.fillPeersFromUpdate(channelFull)

            this._full = channelFull.full_chat

            this.fire("fullLoaded")

            this.findPinnedMessage()
            this._photo.fillFull(this._full.chat_photo);

            return this._full;
        })
    }

    get isSupergroup() {
        return false
    }
}