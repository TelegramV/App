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
import {InputComponent} from "../Elements/InputComponent";
import VComponent from "../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../Reactive/SelectedChat";
import VCheckbox from "../Elements/VCheckbox";
import VUI from "../../VUI"

class OptionsFragment extends VComponent {
    init() {
        super.init()
        this.optionCount = 1
    }

    render() {
        return <div>
            {this.createOption(1)}
        </div>
    }

    createOption(i) {
        return <InputComponent label={`Option ${i}`} input={this.checkInput.bind(this)}/>
    }

    checkInput(ev) {
        const index = Array.prototype.indexOf.call(this.$el.children, ev.target.parentNode)
        if (ev.target.value.length > 0 && index === this.optionCount - 1) {
            this.addOption()
        }
        return true
    }

    addOption() {
        if (this.optionCount >= 10) return
        this.optionCount++
        VRDOM.append(this.createOption(this.optionCount), this.$el)
    }

    getAnswersInput() {
        return [...this.$el.childNodes].map((l, i) => {
            const val = l.__component.getValue()
            if (!val || val.length === 0) return null
            return {
                _: "pollAnswer",
                text: val,
                option: [i]
            }
        }).filter(l => l !== null)
    }
}

export class AttachPollModal extends VComponent {
    askQuestionRef = VComponent.createComponentRef()
    optionsRef = VComponent.createComponentRef()
    anonymousRef = VComponent.createFragmentRef()
    multipleRef = VComponent.createFragmentRef()
    quizRef = VComponent.createFragmentRef()

    render() {
        return <div>
            <ModalHeaderFragment title="New Poll" close actionText="Create" action={this.create.bind(this)}/>
            <div className="padded">
                <InputComponent ref={this.askQuestionRef} label="Ask a Question"/>
            </div>
            <hr/>
            <div className="padded">
                <h5>Options</h5>
                <OptionsFragment ref={this.optionsRef}/>
            </div>
            <hr/>
            <div className="padded">
                <VCheckbox ref={this.anonymousRef} label="Anonymous Voting" checked
                           input={this.checkboxUpdate.bind(this)}/>
                <VCheckbox ref={this.multipleRef} label="Multiple Answers"/>
                <VCheckbox ref={this.quizRef} label="Quiz Mode" input={this.checkboxUpdate.bind(this)}/>
            </div>
        </div>
    }

    checkboxUpdate(ev) {
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
        console.log(this.askQuestionRef)
        return {
            _: "inputMediaPoll",
            poll: {
                _: "poll",
                id: [1, 2], // TODO generate random
                public_voters: !this.anonymousRef.$el.querySelector("input").checked,
                multiple_choice: this.multipleRef.$el.querySelector("input").checked,
                quiz: this.quizRef.$el.querySelector("input").checked,
                question: this.askQuestionRef.component.getValue(),
                answers: this.optionsRef.component.getAnswersInput()
            }
        }
    }

    create() {
        AppSelectedChat.Current.api.sendMessage({media: this.createPollInput()})
        VUI.Modal.close()
    }
}