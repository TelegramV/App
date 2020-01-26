// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PhoneCallMessage extends AbstractMessage {

    type = MessageType.PHONE_CALL

    show() {
        //
    }
}