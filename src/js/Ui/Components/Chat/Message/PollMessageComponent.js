import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import MTProto from "../../../../MTProto/external"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import RadioFragment from "../../Elements/RadioFragment"
import CheckboxFragment from "../../Elements/CheckboxFragment"

export default class PollMessageComponent extends GeneralMessageComponent {
    constructor(props) {
        super(props);
        let message = this.props.message;

        this.poll = message.raw.media.poll;
        this.results = message.raw.media.results;

        this.multiple = this.poll.pFlags.multiple_choice;
        this.public = this.poll.pFlags.public_voters;
        this.quiz = this.poll.pFlags.quiz;

        this.answers = [];


        this.contextActions = [];
        if (!this.quiz && this.isVoted() && !this.poll.closed) {
            this.contextActions.push({
                icon: "revote",
                title: "Revote",
                onClick: _ => this.cancelVote()
            })
        }

        if (message.isOut) {
            this.contextActions.push({
                icon: "close",
                title: "Close voting",
                onClick: _ => this.closeVoting()
            })
        }
    }

    reactive(R) {
        R.object(this.message)
            .on("pollEdit", this.onPollEdit)
    }

    render() {
        let classes = "poll" + (this.isVoted() ? " voted" : "");
        let type = this.quiz ? "Quiz" : this.public ? "Public poll" : "Anonymous poll";
        return (
            <MessageWrapperFragment message={this.props.message} contextActions={this.contextActions}
                                    showUsername={false} bubbleRef={this.bubbleRef}>
                <div class={classes}>
                    <div class="question">{this.poll.question}</div>
                    <div class="poll-type">{type}</div>
                    {this._prepareAnswerBlock()}
                    {this._prepareFooter()}
                </div>
            </MessageWrapperFragment>
        )
    }

    _prepareFooter = () => {
        if (this.isVoted) {
            if (this.public) {
                return <div class="action-button" onClick={this._actionClick}>Results</div>;
            } else {
                return <div class="stats">{this.results.total_voters + " voted"}</div>
            }
        } else {
            if (this.multiple) {
                return <div class="action-button disabled" onClick={this._actionClick}>Vote</div>;
            } else {
                return <div class="stats">{this.results.total_voters + " voted"}</div>;
            }
        }
    }

    componentDidMount() {
        this.actionButton = this.$el.querySelector(".action-button");
        this._applyPercents();
    }

    isVoted = () => {
        if (!this.results.results) return false;
        for (const result of this.results.results) {
            if (result.pFlags.chosen) return true;
        }
        return false;
    }

    cancelVote = () => {

    }

    closeVoting = () => {
        MTProto.invokeMethod("messages.sendVote", {})
    }

    addAnswer = (option) => {
        if (option == undefined) return;
        this.answers.push(Number.parseInt(option));
        if (!this.multiple) this.sendVote();
    }

    cancelAnswer = (option) => {
        if (option == undefined) return;
        option = Number.parseInt(option);
        this.answers = this.answers.filter(item => (item !== option)); //delete element from array
    }

    sendVote = () => {
        if (this.answers.length == 0) return;
        let message = this.props.message;
        MTProto.invokeMethod("messages.sendVote", {
            peer: message.from.inputPeer,
            msg_id: message.id,
            options: this.answers
        }).then(response => {
            this.answers = [];
            MTProto.UpdatesManager.process(response);
        });
    }

    getWinningAnswer = () => {
        if (!this.results.results) return undefined;
        let best = this.results.results[0];
        for (const result of this.results.results) {
            if (result.voters > best.voters) best = result;
        }
        return best;
    }

    onPollEdit = () => {
        this.poll = this.props.message.raw.media.poll;
        this.results = this.props.message.raw.media.results;
        this._patchAnswers();
    }

    _patchAnswers = () => {
        this.forceUpdate();
        setTimeout(this._applyPercents, 0);
    }

    _applyPercents = () => {
        if (!this.isVoted()) return;
        let answers = this.$el.querySelectorAll(".answer");
        let most_voters = this.getWinningAnswer().voters;
        for (let i = 0; i < this.poll.answers.length; i++) {
            let result = this.results.results[i];
            if (this.poll.answers[i].option[0] !== result.option[0]) {
                console.log("POLL ANSWERS ORDER IS BROKEN!")
                return;
            }
            let barPercent = (result.voters ? (result.voters / most_voters) * 100 : 0);
            barPercent = Math.round(barPercent) + "%";
            answers[i].querySelector(".progress").style.width = barPercent;
        }
    }

    _prepareAnswerBlock = () => {
        let answers = [];
        if (!this.isVoted()) {
            for (const answer of this.poll.answers) {
                answers.push(<AnswerComponent answer={answer} message={this.props.message} click={this._answerClick}/>)
            }
        } else {
            for (const answer of this.poll.answers) {
                for (const result of this.results.results) {
                    if (answer.option[0] === result.option[0]) {
                        answers.push(<AnswerComponent answer={answer} result={result} message={this.props.message}/>);
                        break;
                    }
                }
            }
        }
        return answers;
    }

    _answerClick = (event) => {
        let option = event.currentTarget.getAttribute("option");
        let elem = event.currentTarget.querySelector("input[type=radio],input[type=checkbox]");
        elem.checked = !elem.checked;
        if (elem.checked) {
            this.addAnswer(option);
        } else {
            this.cancelAnswer(option);
        }

        this._updateAction();
    }

    _actionClick = (event) => {
        if (event.currentTarget.classList.contains("disabled")) return;
        if (!this.isVoted()) {
            this.sendVote();
        } else {
            this.showFullResults();
        }
    }

    _updateAction = () => {
        if (this.actionButton) {
            if (this.multiple && !this.isVoted()) {
                if (this.answers.length > 0) {
                    this.actionButton.classList.toggle("disabled");
                    this.actionButton.classList.toggle("rp");
                } else {
                    this.actionButton.classList.add("disabled");
                    this.actionButton.classList.remove("rp");
                }
            }
        }
    }
}

const AnswerComponent = ({answer, result, message, click}) => {
    let name = message.id;
    let total_voters = message.raw.media.results.total_voters;
    let multiple = message.raw.media.poll.pFlags.multiple_choice;
    let quiz = message.raw.media.poll.pFlags.quiz;

    if (!result) {
        return (
            <div class="answer rp" option={answer.option} onClick={click}>
                <div class="result-wrapper">
                    {multiple ? <CheckboxFragment/> : <RadioFragment name={name}/>}
                </div>
                <div class="options-wrapper">
                    <div class="answer-text">{answer.text}</div>
                </div>
            </div>
        )
    } else {
        let percent = (result.voters ? (result.voters / total_voters) * 100 : 0);
        percent = Math.round(percent) + "%";

        let votedClass = "tgico tgico-";
        if (!quiz) {
            if (result.pFlags.chosen) {
                votedClass += "check";
            } else {
                votedClass = undefined;
            }
        } else {
            if (result.pFlags.correct) {
                votedClass += "check";
            } else {
                votedClass += "close";
            }
        }
        let wrong = (quiz && !result.pFlags.correct);
        let answerClasses = "answer" + (wrong ? " wrong" : "");
        return (
            <div class={answerClasses} option={answer.option}>
                <div class="result-wrapper">
                    <div class="percent">{percent}</div>
                    <div class="voted">{votedClass ? <span class={votedClass}/> : ""}</div>
                </div>
                <div class="options-wrapper">
                    <div class="answer-text">{answer.text}</div>
                    <div class="progress-wrapper">
                        <div class="progress" css-width="1px"></div>
                    </div>
                </div>
            </div>
        )
    }
}