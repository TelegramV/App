// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class LocationMessage extends AbstractMessage {

    type = MessageType.GEO

    show() {
        super.show()
    }
}