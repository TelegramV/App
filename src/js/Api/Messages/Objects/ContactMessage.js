// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"
import PeersStore from "../../Store/PeersStore"

export class ContactMessage extends AbstractMessage {

    type = MessageType.CONTACT
    peer = undefined;

    show() {
        super.show()
    }

    get contact() {
    	return this.peer;
    }

    fillRaw(raw: Object): ContactMessage {
    	super.fillRaw(raw);

    	this.peer = PeersStore.get("user", raw.media.user_id);

    	return this;
    }
}