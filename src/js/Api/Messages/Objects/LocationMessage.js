// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class LocationMessage extends AbstractMessage {

    type = MessageType.GEO

    get geo() {
        return this.media?.geo
    }

    get zoom() {
        return 16; //idk if we need to adapt...
    }
}