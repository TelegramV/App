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
        return !!this.results.results?.find(res => res.chosen);
    }

    get isPublic() {
        return this.poll.public_voters;
    }

    get isMultiple() {
        return this.poll.multiple_choice;
    }

    get isVotedCorrectly() {
        return this.results?.results?.find(res => res.chosen)?.correct;
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
        if(this.results.total_voters === 0) return 0;
        return Math.round((pollAnswerVotes.voters/this.results.total_voters)*100)
    }

    calculateRelativePercent(pollAnswerVotes) {
        if(!pollAnswerVotes) return null;
        if(this.mostPopularAnswer.voters === 0) return 0;
        return (pollAnswerVotes.voters/this.mostPopularAnswer.voters)*100;
    }
 
    // legacy? (still needed though)
    fillPoll(poll, results) {
        if(poll) this.raw.media.poll = poll;

        if(results) this.raw.media.results = results;
    }

    fillPollVote(userId, options) {
        if(this.results.recent_voters) {
            this.results.recent_voters.unshift(userId);
            this.results.recent_voters.pop();
        }

        if(this.results.results) {
            this.results.results.filter(res => options.includes(res.option)).forEach(res => res.voters++);
        }
    }
}