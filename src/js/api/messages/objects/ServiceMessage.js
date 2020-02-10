// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class ServiceMessage extends AbstractMessage {

    type = MessageType.SERVICE

    get text(): string {
        return "Service Message [IMPLEMENT ME]"
    }

    show() {
        super.show()
    }
}