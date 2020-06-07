// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import PeersStore from "../../Store/PeersStore"

export class ContactMessage extends AbstractMessage {

    type = MessageType.CONTACT

    get contact() {
        return PeersStore.get("user", this.media.user_id);
    }
}