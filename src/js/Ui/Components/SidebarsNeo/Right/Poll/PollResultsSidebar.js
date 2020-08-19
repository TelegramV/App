import { RightSidebar } from "../RightSidebar";
import UIEvents from "../../../../EventBus/UIEvents";
import messages from "../../../../../Api/Telegram/messages"
import { Section } from "../../Fragments/Section"
import PeersStore from "../../../../../Api/Store/PeersStore"
import PeersManager from "../../../../../Api/Peers/PeersManager"
import AvatarComponent from "../../../Basic/AvatarComponent"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import "./PollResultsSidebar.scss"

const PREFETCH_COUNT = 5;

export class PollResultsSidebar extends RightSidebar {

    state = {
        pollMessage: null,
        pollVotes: null
    }

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("poll.showResults", this.onPollResults)
            .on("pollUpdate", this.onPollUpdate)
    }

    content(): * {
        return <this.contentWrapper class="poll-results">
        	<div class="poll-results">
	        	<div class="question">{this.state.pollMessage?.poll?.question ?? "Loading..."}</div>
	            {this.generateVotes()}
            </div>
        </this.contentWrapper>
    }

    get title() {
        return "Results"
    }

    get leftButtonIcon() {
        return "back"
    }

    generateVotes = () => {
        let options = [];
        if(!this.state.pollVotes) {
        	return <div class="info">Loading...</div>;
        }
        for (let option of this.state.pollVotes) {
            if (option.count === 0) continue;
            options.push(
                <VotersSection pollMessage={this.state.pollMessage} option={option} requestAll={this.fetchAllVotes}/>
            )
        }
        if (options.length === 0 && this.state.pollVotes) {
            return <div class="info">Nobody voted yet!</div>
        }
        return options;
    }

    onPollResults = event => {
        UIEvents.Sidebars.fire("push", PollResultsSidebar);
        this.setState({
            pollMessage: event.pollMessage,
            pollVotes: null
        })

        this.fetchPollVotes(event.pollMessage);
    }

    // very stupid way to do this, TODO update that contains difference
    onPollUpdate = event => {
    	if(event.message === this.state.pollMessage && this.state.pollVotes) {
    		let fetchedOptions = this.state.pollVotes.filter(voteList => voteList.voters.length > PREFETCH_COUNT);
    		this.setState({
    			pollVotes: null //reset
    		})
    		this.fetchPollVotes(this.state.pollMessage).then(_ => {
    			for(let option of fetchedOptions) {
	    			this.fetchAllVotes(option);
	    		}
    		});
    	}
    }

    /**
		Fetches PREFETCH_COUNT of voters for each options and updates state
    **/

    fetchPollVotes = pollMessage => {
        let promises = [];
        pollMessage.poll.answers.forEach(answer => {
            let option = answer.option[0];
            let promise = messages.getPollVotes(pollMessage, option, null, PREFETCH_COUNT).then(votesList => {
            	PeersManager.fillPeersFromUpdate(votesList);
                return {
                    option: option,
                    count: votesList.count,
                    voters: votesList.votes.map(userVote => userVote.user_id),
                }
            });
            promises.push(promise);
        })
        return Promise.all(promises).then(array => {
        	array.sort((one, two) => one.option-two.option); //sort like in poll
            this.setState({
                pollVotes: array
            })
        })
    }
    /**
		Fetches all voters for one option and updates state
		TODO: test on big poll, maybe pagination is required
    **/
    fetchAllVotes = option => {
    	return messages.getPollVotes(this.state.pollMessage, option.option, null, option.count).then(votesList => {
    		let newVotes = this.state.pollVotes.filter(votes => votes.option!==option.option);
    		newVotes.push({
                    option: option.option,
                    count: votesList.count,
                    voters: votesList.votes.map(userVote => userVote.user_id),
                });
    		PeersManager.fillPeersFromUpdate(votesList);
    		newVotes.sort((one, two) => one.option-two.option);
    		this.setState({
    			pollVotes: newVotes
    		})
    	})
    }
}

const VotersSection = ({pollMessage, option, requestAll}) => {
	//console.log(pollMessage)
	let percent = pollMessage.calculateAbsolutePercent({voters: option.count});
	let header = (
		<div class="voters-header">
		<div class="name">{pollMessage.poll.answers.find(answer => answer.option[0]===option.option).text}</div>
		<div class="percent">{percent+"%"}</div>
		</div>
		)
	let voters = [];
	for(let userId of option.voters) {
		if(option.voters.length===PREFETCH_COUNT && voters.length===(PREFETCH_COUNT-1) && option.count > PREFETCH_COUNT) {
			voters.push(<div class="more" onClick={_ => requestAll(option)}>
							<i class="tgico tgico-down"/>
							<div class="text">Show {option.count-PREFETCH_COUNT+1} more voters</div>
						</div>);
			break;
		}

		let peer = PeersStore.get("user", userId);
		if(peer) {
			voters.push(<div class="voter rp" onClick={_=>AppSelectedInfoPeer.select(peer)}>
							<AvatarComponent peer={peer} noSaved/>
							<div class="text">{peer.name}</div>
						</div>)
		}
	}
    return (
    	<Section title={header}>
			{voters}
		</Section>
		)
}
