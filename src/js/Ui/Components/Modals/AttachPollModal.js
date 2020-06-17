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
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import VInput from "../../Elements/Input/VInput"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent";
import VSlider from "../../Elements/Input/VSlider";
import {Section} from "../SidebarsNeo/Fragments/Section";
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import VRadio from "../../Elements/Input/VRadio";

class OptionsFragment extends StatefulComponent {
    state = {
        selected: 0,
        options: [""]
    }
    init() {
        super.init()
    }

    render() {
        if(this.state.options[this.state.options.length - 1].length > 0 && this.state.options.length < 10) {
            this.state.options.push("")
        }
        return <div>
            {this.state.options.map((l, i) => this.createOption(l, i))}
            {/*{this.createOption(1)}*/}
        </div>
    }

    createOption(option, i) {
        return <div css-display="flex">
            {nodeIf(<VCheckbox checked={i === this.state.selected} onClick={_ => this.select(i)}/>, this.props.quiz)}
            <VInput label={`Option ${i + 1}`} onInput={ev => this.checkInput(i, ev)} value={option} width="100%"/>
        </div>
    }

    select(i) {
        this.setState({
            selected: i
        })
    }

    checkInput = (i, ev) => {
        this.state.options[i] = ev.target.value
        this.forceUpdate()
        // const index = Array.prototype.indexOf.call(this.$el.children, ev.target.parentNode.parentNode)
        // console.log("index", index, ev.target.value, this.optionCount)
        // if (ev.target.value.length > 0 && index === this.optionCount - 1) {
        //     console.log("addoption")
        //     this.addOption()
        // }
        // return true
    }

    // addOption() {
    //     if (this.optionCount >= 10) return
    //     this.optionCount++
    //     VRDOM.append(this.createOption(this.optionCount), this.$el)
    // }

    get selected() {
        return this.state.selected
    }

    getAnswersInput() {
        return this.state.options.map((l, i) => {
            if(l === "") return null
            return {
                _: "pollAnswer",
                text: l,
                option: [i]
            }
        }).filter(l => l !== null)
    }
}

export class AttachPollModal extends StatefulComponent {
    askQuestionRef = VComponent.createFragmentRef()
    optionsRef = VComponent.createComponentRef()
    anonymousRef = VComponent.createFragmentRef()
    multipleRef = VComponent.createFragmentRef()
    quizRef = VComponent.createFragmentRef()

    state = {
        anon: true,
        multiple: false,
        quiz: false,
        question: "",
        solution: ""
    }

    render() {
        return <div>
            <ModalHeaderFragment title="New Poll" close actionText="Create" action={this.create.bind(this)}/>
            <div className="padded">
                <VInput ref={this.askQuestionRef} label="Ask a Question" onInput={this.onInputQuestion} value={this.state.question}/>
            </div>
            <hr/>
            <div className="padded">
                <h5>Options</h5>
                <OptionsFragment ref={this.optionsRef} quiz={this.state.quiz}/>
            </div>
            <hr/>
            <div className="checkboxes padded bottom">
                <VCheckbox label="Anonymous Voting" checked={this.state.anon}
                           input={this.toggleAnon}/>
                <VCheckbox label="Multiple Answers" disabled={this.state.quiz} checked={this.state.multiple} onClick={this.toggleMultiple}/>
                <VCheckbox label="Quiz Mode" input={this.toggleQuiz} checked={this.state.quiz}/>

                {/*{nodeIf(<VSlider label="Second for quiz" value={30} max={600} min={5} step={5}/>, this.state.quiz)}*/}
                {nodeIf(<VInput label="Solution" width="100%" onInput={this.onInputSolution} value={this.state.solution}/>, this.state.quiz)}
            </div>
        </div>
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
                // close_period: 600
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