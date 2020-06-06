import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PollMessage extends AbstractMessage {

    type = MessageType.POLL

    get poll() {
        return this.raw.media.poll;
    }

    get results() {
        return this.raw.media.results;
    }

    fillPoll(poll, results) {
        if (poll) {
            this.raw.media.poll = poll;
        }

        this.raw.media.results = results;
    }
}