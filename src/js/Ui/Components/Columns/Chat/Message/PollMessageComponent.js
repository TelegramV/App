import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import MTProto from "../../../../../MTProto/External"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import VRadio from "../../../Elements/VRadio"
import VCheckbox from "../../../Elements/VCheckbox"
import messages from "../../../../../Api/Telegram/messages"

// TODO Big refractor, add closing, retracting votes
// Add state, make more useful fragments
// Currently, do not supports showing snackbar after voting
// works on 3 костилі і один велосипед
export default class PollMessageComponent extends GeneralMessageComponent {

    init() {
        super.init();

        let message = this.props.message;
        console.log(message);

        this.answers = [];

        this.contextActions = [];
        if (!message.isQuiz && message.isVoted && !message.poll.closed) {
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
        R.object(this.props.message)
            .on("pollEdit", this.onPollEdit)
    }

    componentDidMount() {
        super.componentDidMount();

        this.actionButton = this.$el.querySelector(".action-button");
    }

    render({ message }) {
        let classes = {
            "poll": true,
            "voted": message.isVoted
        }
        return (
            <MessageWrapperFragment message={message} contextActions={this.contextActions}>
                <div class={classes}>
                    <div class="question">{message.poll.question}</div>
                    <div class="poll-type">{this.getPollType()}</div>
                    {this.makeAnswerBlock()}
                    <FooterFragment message={message} actionClick={this.onActionClick}/>
                </div>
            </MessageWrapperFragment>
        )
    }

    getPollType = () => {
        let message = this.props.message;

        if(message.isPublic) {
            return message.isQuiz ? "Quiz" : "Public poll";
        } else {
            return message.isQuiz ? "Anonymous quiz" : "Anonymous poll";
        }
    }

    sendVote = () => {
        if (this.answers.length == 0) return;
        messages.sendVote(this.props.message, this.answers).then(response => {
            this.answers = [];
        })
    }

    addAnswer = (option) => {
        if (!option && option !== 0) return; //idk if this byte can be 0, but better be prepared
        this.answers.push(Number.parseInt(option));
        if (!this.props.message.isMultiple) this.sendVote();
    }

    cancelAnswer = (option) => {
        if (!option && option !== 0) return;
        option = Number.parseInt(option);
        this.answers = this.answers.filter(item => (item !== option)); //delete element from array
    }

    onPollEdit = () => {
        this.forceUpdate();
    }

    onActionClick = (event) => {
        if (event.currentTarget.classList.contains("disabled")) return;
        if (!this.props.message.isVoted) {
            this.sendVote(); // Vote
        } else {
            this.showFullResults(); // Results
        }
    }

    makeAnswerBlock = () => {
        let answers = [];
        for (const answer of this.props.message.poll.answers) {
            answers.push(<AnswerFragment message={this.props.message} option={answer.option[0]} click={this.onAnswerClick}/>)
        }
        return answers;
    }

    onAnswerClick = (event) => {
        let option = event.currentTarget.getAttribute("option");
        let elem = event.currentTarget.querySelector("input[type=radio],input[type=checkbox]");
        elem.checked = !elem.checked;
        if (elem.checked) {
            this.addAnswer(option);
        } else {
            this.cancelAnswer(option);
        }

        this.updateAction();
    }

    updateAction = () => {
        if (this.actionButton) {
            if (this.props.message.isMultiple && !this.props.message.isVoted) {
                this.actionButton.classList.toggle("disabled", this.answers.length === 0);
                this.actionButton.classList.toggle("rp", this.answers.length === 0);
            }
        }
    }

    cancelVote = () => {

    }

    closeVoting = () => {

    }
}

const AnswerFragment = ({message, option, click}) => {
    let answer = message.poll.answers.find(answ => answ.option[0] === option);
    let result = message.results?.results?.find(res => res.option[0] === option);

    if(!message.isVoted) {
        return (
            <div class="answer rp" option={answer.option} onClick={click}>
                <div class="result-wrapper">
                    {message.isMultiple ? <VCheckbox/> : <VRadio/>}
                </div>
                <div class="options-wrapper">
                    <div class="answer-text">{answer.text}</div>
                </div>
            </div>
        )
    } else {
        let relPercent = message.calculateRelativePercent(result);
        let absPercent = message.calculateAbsolutePercent(result);
        if(absPercent === null) return <div/>;

        let votedClass = {
            "tgico": true,
            "tgico-check": result.chosen || (message.isQuiz && result.correct),
            "tgico-close": (message.isQuiz && !result.correct)
        }

        let answerClasses = {
            answer: true,
            wrong: message.isQuiz && !result.correct,
            right: message.isQuiz && result.correct,
            chosen: result.chosen
        }

        return (
            <div class={answerClasses} option={answer.option}>
                <div class="result-wrapper">
                    <div class="percent">{absPercent+"%"}</div>
                    <div class="voted"><span class={votedClass}/></div>
                </div>
                <div class="options-wrapper">
                    <div class="answer-text">{answer.text}</div>
                    <div class="progress-wrapper">
                        <div class="progress" css-width={relPercent+"%"}></div>
                    </div>
                </div>
            </div>
        )
    }
}

const FooterFragment = ({ message, actionClick }) => {
    if (message.isVoted && message.isPublic) {
        return <div class="action-button" onClick={actionClick}>Results</div>;
    } else if (message.isMultiple) {
        return <div class="action-button disabled" onClick={actionClick}>Vote</div>;
    }
    return <div class="stats">{message.results.total_voters + " voted"}</div>;
}