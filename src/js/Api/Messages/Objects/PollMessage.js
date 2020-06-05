// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class PollMessage extends AbstractMessage {

    type = MessageType.POLL

    get poll() {
        return this.raw.media.poll;
    }

    get isQuiz() {
        return this.poll.quiz;
    }

    get results() {
        return this.raw.media.results;
    }

    get isVoted() {
        return this.results?.results?.find(res => res.chosen);
    }

    get isPublic() {
        return this.poll.public_voters;
    }

    get isMultiple() {
        return this.poll.multiple_choice;
    }

    /**
        returns first most popular answer
    **/
    get mostPopularAnswer() {
        if(!this.results.results) return null;
        let best = this.results.results[0];
        for (const result of this.results.results) {
            if (result.voters > best.voters) best = result;
        }
        return best;
    }

    calculateAbsolutePercent(pollAnswerVotes) {
        if(!pollAnswerVotes) return null;
        return Math.round((pollAnswerVotes.voters/this.results.total_voters)*100)
    }

    calculateRelativePercent(pollAnswerVotes) {
        if(!pollAnswerVotes) return null;
        return (pollAnswerVotes.voters/this.mostPopularAnswer.voters)*100;
    }
 
    // legacy? (still needed though)
    fillPoll(poll, results) {
        if (poll) {
            this.raw.media.poll = poll;
        }
        this.raw.media.results = results;
    }
}