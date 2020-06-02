// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import PeersStore from "../../Store/PeersStore"

export class ContactMessage extends AbstractMessage {

    type = MessageType.CONTACT
    peer = null;

    _contact = null;

    get contact() {
        if (!this._contact) {
            this._contact = PeersStore.get("user", this.raw.media.user_id);
        }

        return this._contact;
    }
}