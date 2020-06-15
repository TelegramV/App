import { RightSidebar } from "../RightSidebar";
import UIEvents from "../../../../EventBus/UIEvents";
import { getPollVotes } from "../../../../../Api/Telegram/messages"

export class PollResultsSidebar extends RightSidebar {

    state = {
        pollMessage: null,
        pollVotes: null
    }

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("poll.showResults", this.onPollResults)
    }

    content(): * {
        return <this.contentWrapper>
            {this.state.pollVotes ? this.generateVotes() : "Loading..."}
        </this.contentWrapper>
    }

    get title() {
        return "Results"
    }

    generateVotes = () => {
        return (
            <div>Fetched</div>
        )
    }

    onPollResults = event => {
        UIEvents.Sidebars.fire("push", PollResultsSidebar);

        this.setState({
            pollMessage: event.pollMessage,
            pollVotes: null
        })
    }

    fetchPollVotes = pollMessage => {
        getPollResults(pollMessage).then(votes => {
        	console.log("Got votes");
            this.setState({
                pollMessage: event.pollMessage,
                pollVotes: votes
            })
        })
    }
}