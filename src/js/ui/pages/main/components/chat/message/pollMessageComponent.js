import Component from "../../../../../v/vrdom/component"
import MTProto from "../../../../../../mtproto"
import MessageWrapperComponent from "./messageWrapperComponent"
import RadioComponent from "../../input/radioComponent"

export default class PollMessageComponent extends Component {
    constructor(props) {
        super(props);
        let message = this.props.message;
        console.log(message);
        this.poll = message.media.poll;
        this.results = message.media.results;

        this.multiple = false;
        this.answers = [];
    }

    h() {
        return (
            <MessageWrapperComponent message={this.props.message}>
            	<div class="poll">
					<div class="question">{this.poll.question}</div>
					<div class="poll-type">Anonymous poll</div>
					{this._prepareAnswerBlock()}
					<div class="stats">{this.results.total_voters + " voted"}</div>
				</div>
			</MessageWrapperComponent>
        )
    }

    isVoted() {
    	if(!this.results.results) return false;
    	for(const result of this.results.results) {
    		if(result.pFlags.chosen) return true;
    	}
    	return false;
    }

    addAnswer(option) {
    	if(!option) return;
    	this.answers.push(Number.parseInt(option));
    	if(!this.multiple) this.sendVote();
    }

    sendVote() {
    	let message = this.props.message;
    	MTProto.invokeMethod("messages.sendVote",{
    		peer: message.from.inputPeer,
    		msg_id: message.id,
    		options: this.answers
    	}).then(response => {
    		console.log(response)
    		MTProto.UpdatesManager.process(response);
    	});
    }

    _getAnswers() {
        let answers = [];
        for (const answer of this.poll.answers) {
            answers.push(<PollAnswerComponent answer={answer}/>)
        }
        return answers;
    }

    _getResults() {
        let results = [];
        for (const result of this.results.results) {
            results.push(<PollAnswerComponent answer={answer}/>)
        }
        return results;
    }

    _prepareAnswerBlock() {
        let answers = [];
        if (!this.isVoted()) {
            for (const answer of this.poll.answers) {
                answers.push(<AnswerComponent answer={answer} input={this._answerInput} name={this.props.message.id}/>)
            }
        } else {
            for (const answer of this.poll.answers) {
                for (const result of this.results.results) {
                    if (answer.option[0] === result.option[0]) {
                        answers.push(<AnswerComponent answer={answer} result={result} total_voters={this.results.total_voters}/>);
                        break;
                    }
                }
            }
        }
        return answers;
    }

    _answerInput(event) {
    	let option = event.currentTarget.closest(".answer").getAttribute("option");
    	this.addAnswer(option);
    }
}

const AnswerComponent = ({answer, result, total_voters=0, name, input}) => {
    if (!result) {
            return (
                <div class="answer" option={answer.option}>
                    <div class="result-wrapper">
                        <RadioComponent name={name} input={input}/>
                    </div>
                    <div class="options-wrapper">
                        <div class="answer-text">{answer.text}</div>
                    </div>
                </div>
            )
        } else {
            let percent = (result.voters? (result.voters/total_voters)*100 : 0) + "%";
            return (
                <div class="answer" option={answer.option}>
                    <div class="result-wrapper">
                        <div class="percent">{percent}</div>
                        <div class="voted">{result.pFlags.chosen? <span class="tgico tgico-check"/> : ""}</div>
                    </div>
                    <div class="options-wrapper">
                        <div class="answer-text">{answer.text}</div>
                        <div class="progress-wrapper"><div class="progress" css-width={percent}></div></div>
                    </div>
                </div>
            )
        }
}