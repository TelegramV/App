import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import MTProto from "../../../../../MTProto/External"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import AvatarComponent from "../../../Basic/AvatarComponent"
import VRadio from "../../../../Elements/Input/VRadio"
import VCheckbox from "../../../../Elements/Input/VCheckbox"
import messages from "../../../../../Api/Telegram/messages"
import UIEvents from "../../../../EventBus/UIEvents"
import PeersStore from "../../../../../Api/Store/PeersStore"
import {parseMessageEntities} from "../../../../../Utils/htmlHelpers"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import VSpinner from "../../../../Elements/VSpinner"
import {formatAudioTime} from "../../../../Utils/utils"

export default class PollMessageComponent extends GeneralMessageComponent {

    state = {
        showingSolution: false
    }

    init() {
        super.init();

        let message = this.props.message;

        this.timerRef = VComponent.createFragmentRef();

        this.answers = [];

        this.prepareContextMenu()
    }

    prepareContextMenu = () => {
        let message = this.props.message;
        this.contextActions = [];
        if (!message.isQuiz && message.isVoted && !message.poll.closed) {
            this.contextActions.push({
                icon: "revote",
                title: "Revote",
                onClick: _ => this.cancelVote()
            })
        }

        if (message.isOut && !message.poll.closed) {
            this.contextActions.push({
                icon: "close",
                title: "Close voting",
                onClick: _ => this.closePoll()
            })
        }
    }

    reactive(R) {
        R.object(this.props.message)
            .on("pollEdit", this.onPollChange)
            .on("pollVote", this.onPollChange)
    }

    componentDidMount() {
        super.componentDidMount();

        this.actionButton = this.$el.querySelector(".action-button");

        if(this.props.message.poll.close_date) this.withInterval(this.updateTimer, 500);
    }

    render({ message, showDate }) {
        this.prepareContextMenu();
        let classes = {
            "poll": true,
            "voted": message.isVoted
        }
        return (
            <MessageWrapperFragment message={message} contextActions={this.contextActions} showDate={showDate}>
                <div class={classes}>
                    <div class="question">{message.poll.question}</div>
                    <div class="subtitle">
                        <div class="poll-type">{this.getPollType()}</div>
                        {message.poll.public_voters && <RecentVotersFragment recentVoters={message.results.recent_voters}/>}
                        <div class="filler"/>
                        {this.shouldShowTooltip() && <TipFragment click={_ => this.showSolution()}/>}
                        {(message.poll.close_period && !message.isVoted) && <TimerFragment ref={this.timerRef} left={0} total={0}/>}
                    </div>
                    {this.makeAnswerBlock()}
                    <FooterFragment message={message} actionClick={this.onActionClick}/>
                </div>
                <TextWrapperComponent message={message}/>
            </MessageWrapperFragment>
        )
    }

    getPollType = () => {
        let message = this.props.message;

        if(message.poll.closed) return "Final results";

        if(message.isPublic) {
            return message.isQuiz ? "Quiz" : "Public Poll";
        } else {
            return message.isQuiz ? "Anonymous Quiz" : "Anonymous Poll";
        }
    }

    sendVote = () => {
        let message = this.props.message;
        if (this.answers.length == 0) return;
        messages.sendVote(message, this.answers).then(response => {
            if(!message.isVotedCorrectly) {
                this.showSolution();
            } else {
                //fireworks?
            }
            this.answers = [];
        })
    }

    showSolution = () => {
        if(this.props.message.results?.solution && !this.state.showingSolution) {
            UIEvents.General.fire("snackbar.show", {text: <SnackbarSolutionFragment message={this.props.message}/>, time: 5});
            this.setState({
                showingSolution: true
            })

            this.withTimeout(_ => {
                this.setState({showingSolution: false})
            }, 5000);
        }
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

    onPollChange = () => {
        this.forceUpdate();
        UIEvents.General.fire("pollUpdate", {message: this.props.message}); //update sidebar

        this.withTimeout(_ => this.forceUpdate(), 1000); // текст з обраного варіанту кудись зникає, дикий костиль, ДАВИД ФІКС!
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

    updateTimer = () => {
        let message = this.props.message;
        let left = message.poll.close_date - Date.now()/1000;
        if(left < 0) {
            this.clearIntervals();
            this.withTimeout(_=>messages.getPollResults(message), 1000);
        }
        this.timerRef.update({
            left: left,
            total: message.poll.close_period
        })
    }

    shouldShowTooltip = () => {
        let message = this.props.message;
        return message.isQuiz &&
         (message.poll.closed || message.isVoted) &&
          !this.state.showingSolution &&
          this.props.message.results?.solution
    }

    cancelVote = () => {
        messages.sendVote(this.props.message, []);
    }

    closePoll = () => {
        messages.closePoll(this.props.message);
    }

    showFullResults = () => {
        UIEvents.General.fire("poll.showResults",{pollMessage: this.props.message})
    }
}

const AnswerFragment = ({message, option, click}) => {
    let answer = message.poll.answers.find(answ => answ.option[0] === option);
    let result = message.results?.results?.find(res => res.option[0] === option);

    if(!message.isVoted && !message.poll.closed) {
        return (
            <div class="answer voting rp" option={answer.option} onClick={click}>
                <div class="vote">{message.isMultiple ? <VCheckbox/> : <VRadio/>}</div>
                <div class="answer-text">{answer.text}</div>
            </div>
        )
    } else {
        let relPercent = Math.max(message.calculateRelativePercent(result), 1); //0% doesn't show a bar
        let absPercent = message.calculateAbsolutePercent(result);
        if(absPercent === null) return undefined;

        let votedClass = {
            "tgico": true,
            "tgico-check": result.chosen || (message.isQuiz && result.correct),
            "tgico-close": (message.isQuiz && !result.correct)
        }

        let answerClasses = {
            answer: true,
            wrong: message.isQuiz && !result.correct && !message.isVotedCorrectly && result.chosen,
            right: message.isQuiz && result.correct,
            chosen: result.chosen
        }

        return (
            <div class={answerClasses} option={answer.option}>
                <div class="percent">{absPercent+"%"}</div>
                <div class="voted"><span class={votedClass}/></div>
                <div class="answer-text">{answer.text}</div>
                <div class="progress-wrapper">
                    <div class="progress" css-width={relPercent+"%"}></div>
                </div>
            </div>
        )
    }
}

const FooterFragment = ({ message, actionClick }) => {
    if (message.isVoted && message.isPublic) {
        return <div class="action-button" onClick={actionClick}>View results</div>;
    } else if (!message.isVoted && message.isMultiple) {
        return <div class="action-button disabled" onClick={actionClick}>Vote</div>;
    }
    return <div class="stats">{message.results.total_voters + (message.isQuiz ? " answered" : " voted")}</div>;
}

const TipFragment = ({click}) => {
    return (
        <div class="tip" onClick={click}>
            <i class="tgico tgico-tip"/>
        </div>
        )
}

const RecentVotersFragment = ({recentVoters}) => {
    let avatars = [];
    for(let id of recentVoters) {
        let user = PeersStore.get("user", id);
        avatars.push(<AvatarComponent peer={user}/>)
    }
    return (
        <div class="recent-voters">
            {avatars}
        </div>
        )
}

const SnackbarSolutionFragment = ({message}) => {
    let text = parseMessageEntities(message.results.solution, message.results.solution_entities);
    return (
        <div class="solution">
            <i class="tgico tgico-info2"/>
            <div class="text">
                {text}
            </div>
        </div>
        )
}

const TimerFragment = ({left, total}) => {
    if(total === 0) return <div class="timer"/>;
    if(left < 0) left = 0;
    let percent = left / total;
    left = Math.floor(left);
    let formatted = formatAudioTime(left);
    let color;
    if(left < 6) color = "#DF3F40";
    return (
        <div class="timer">
            <span class="time-left" css-color={color}>{formatted}</span>
            <VSpinner progress={percent} determinate={true} color={color}/>
        </div>
        )
}