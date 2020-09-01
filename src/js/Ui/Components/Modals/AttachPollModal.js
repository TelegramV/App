/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {ModalHeaderFragment} from "./ModalHeaderFragment";
import VComponent from "../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../Reactive/SelectedChat";
import VCheckbox from "../../Elements/Input/VCheckbox";
import VUI from "../../VUI"
import VInput from "../../Elements/Input/VInput"
import TranslatableStatefulComponent from "../../../V/VRDOM/component/TranslatableStatefulComponent";
import VSlider from "../../Elements/Input/VSlider";
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import "./AttachPollModal.scss"

class OptionsFragment extends TranslatableStatefulComponent {
    state = {
        selected: 0,
        options: [""]
    }

    refs = []

    init() {
        super.init()
    }

    render() {
        if (this.state.options[this.state.options.length - 1].length > 0 && this.state.options.length < 10) {
            this.state.options.push("")
        }
        this.refs = [];
        return <div>
            {this.state.options.map((l, i) => this.createOption(l, i))}
        </div>
    }

    createOption(option, i) {
        const inputRef = TranslatableStatefulComponent.createRef();
        this.refs[i] = inputRef;
        return <div class="option">
            {nodeIf(<VCheckbox checked={i === this.state.selected} onClick={_ => this.select(i)}/>, this.props.quiz)}
            <VInput label={this.l("lng_polls_create_option_add")}
                    filledText={`Option ${i + 1}`}
                    onInput={ev => this.checkInput(i, ev)}
                    value={option}
                    width={null}
                    withButton={!!option}
                    onButtonClick={() => {
                        this.setState({
                            options: this.state.options.filter(el => el !== option) // remove option
                        })
                    }}
                    onKeyDown={ev => this.onKeyDown(i, ev)}
                    buttonIcon="close"
                    ref={inputRef}/>
        </div>
    }

    select(i) {
        this.setState({
            selected: i
        })
    }

    checkInput = (i, ev) => {
        if (ev.target.value.length === 0) { // not the best UX, but honest work
            this.state.options.splice(i, 1)
            this.forceUpdate()
            this.focus(i - 1);
            return
        }
        this.state.options[i] = ev.target.value
        this.forceUpdate()
        this.focus(i);
    }

    onKeyDown = (i, ev) => {
        if (ev.keyCode == 13) {
            this.focus(i + 1);
            ev.preventDefault();
        }
    }

    focus(i) {
        const input = this.refs[i]?.$el?.querySelector("input");
        if (!input) return;
        input.focus();
        // DO NOT TOUCH! Focus on the end of input
        const value = input.value;
        input.value = "";
        input.value = value;
    }

    get selected() {
        return this.state.selected
    }

    getAnswersInput() {
        return this.state.options.map((l, i) => {
            if (l === "") return null
            return {
                _: "pollAnswer",
                text: l,
                option: [i]
            }
        }).filter(l => l !== null)
    }
}

export class AttachPollModal extends TranslatableStatefulComponent {
    optionsRef = VComponent.createComponentRef()

    state = {
        anon: true,
        multiple: false,
        quiz: false,
        question: "",
        solution: "",
        timer: false,
        timerSeconds: 30
    }

    render() {
        return <div class="polls-modal">
            <ModalHeaderFragment title={this.l("lng_polls_create_title")} close
                                 actionText={this.l("lng_polls_create_button")} action={this.create.bind(this)}/>
            <div class="scrollable">
                <div className="padded">
                    <VInput label={this.l("lng_polls_create_question_placeholder")} onInput={this.onInputQuestion}
                            value={this.state.question}/>
                </div>
                <hr/>
                <div className="padded options scrollable">
                    <h5>{this.l("lng_polls_create_options")}</h5>
                    <OptionsFragment ref={this.optionsRef} quiz={this.state.quiz}/>
                </div>
                <hr/>
                <div className="checkboxes padded bottom">
                    <VCheckbox label={this.l("lng_polls_create_anonymous")} checked={this.state.anon}
                               input={this.toggleAnon}/>
                    <VCheckbox label={this.l("lng_polls_create_multiple_choice")} disabled={this.state.quiz}
                               checked={this.state.multiple} onClick={this.toggleMultiple}/>
                    <VCheckbox label={this.l("lng_polls_create_quiz_mode")} checked={this.state.quiz}
                               input={this.toggleQuiz}/>
                </div>
                {this.state.quiz && <>
                    <div class="padded timer">
                        <h5>Set a timer</h5>
                        <VCheckbox label="Quiz timer" input={() => this.setState({timer: !this.state.timer})}
                                   checked={this.state.timer}/>
                        {this.state.timer && <VSlider label="Seconds before closing" onInput={(event) => {
                            this.setState({
                                timerSeconds: event.currentTarget.value
                            })
                        }} value={this.state.timerSeconds} max={600} min={5} step={5}/>}
                    </div>
                    <div class="padded">
                        <h5>{this.l("lng_polls_solution_title")}</h5>
                        <VInput label={this.l("lng_polls_solution_placeholder")} width="100%"
                                onInput={this.onInputSolution} value={this.state.solution}/>
                    </div>
                </>}
            </div>
        </div>
    }

    componentDidMount() {
        console.log(<VCheckbox checked={this.state.anon}/>);
    }

    onInputSolution = (event) => {
        this.setState({
            solution: event.target.value
        })
    }

    onInputQuestion = (event) => {
        this.setState({
            question: event.target.value
        })
    }
    toggleMultiple = () => {
        this.setState({
            multiple: !this.state.multiple
        })
    }

    toggleQuiz = () => {
        this.setState({
            quiz: !this.state.quiz,
            multiple: false
        })
    }

    toggleAnon = () => {
        this.setState({
            anon: !this.state.anon
        })
        // if(!this.multipleRef.$el.querySelector("input").checked && !this.quizRef.$el.querySelector("input").checked) {
        //     return
        // }
        // if (ev.target.parentComponent.parentComponent === this.quizRef.$el) {
        //     this.multipleRef.$el.querySelector("input").checked = !this.quizRef.$el.querySelector("input").checked
        // } else {
        //     this.quizRef.$el.querySelector("input").checked = !this.multipleRef.$el.querySelector("input").checked
        // }
    }

    createPollInput() {
        return {
            _: "inputMediaPoll",
            poll: {
                _: "poll",
                id: [1, 2], // TODO generate random
                public_voters: !this.state.anon,
                multiple_choice: this.state.multiple,
                quiz: this.state.quiz,
                question: this.state.question,
                answers: this.optionsRef.component.getAnswersInput(),
                close_period: this.state.timer && this.state.timerSeconds
            },
            correct_answers: this.state.quiz ? [this.optionsRef.component.selected] : undefined,
            solution: this.state.quiz ? this.state.solution : undefined,
            solution_entities: []
        }
    }

    create() {
        AppSelectedChat.Current.api.sendMessage({media: this.createPollInput()})
        VUI.Modal.close()
    }
}