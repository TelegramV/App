// @flow

import {AbstractMessage} from "./AbstractMessage"

export class UnsupportedMessage extends AbstractMessage {
    get text() {
        return "Unsupported Message"
    }
}