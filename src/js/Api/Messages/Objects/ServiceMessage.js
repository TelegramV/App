// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class ServiceMessage extends AbstractMessage {

    type = MessageType.SERVICE

    get action(): string {
        return this.raw.action;
    }
}