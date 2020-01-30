// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PollMessage extends AbstractMessage {

    type = MessageType.POLL

    show() {
        super.show()
    }

    fillPoll(poll, results) {
        this.raw.media.poll = poll;
        this.raw.media.results = results;
    }
}