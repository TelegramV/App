import Component from "../../../v/vrdom/Component";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import {InputComponent} from "../components/input/inputComponent";
import VComponent from "../../../v/vrdom/component/VComponent";
import AppSelectedPeer from "../../../reactive/SelectedPeer";
import {createNonce} from "../../../../mtproto/utils/bin";
import {ModalManager} from "../../../modalManager";
import CheckboxComponent from "../components/input/checkboxComponent";

class OptionsFragment extends VComponent {
    init() {
        super.init()
        this.optionCount = 1
    }

    h() {
        return <div>
            {this.createOption(1)}
        </div>
    }

    createOption(i) {
        return <InputComponent label={`Option ${i}`} input={this.checkInput.bind(this)}/>
    }

    checkInput(ev) {
        const index = Array.prototype.indexOf.call(this.$el.children, ev.target.parentNode)
        if(ev.target.value.length > 0 && index === this.optionCount - 1) {
            this.addOption()
        }
        return true
    }

    addOption() {
        if(this.optionCount >= 10) return
        this.optionCount++
        VRDOM.append(this.createOption(this.optionCount), this.$el)
    }

    getAnswersInput() {
        return [...this.$el.childNodes].map((l, i) => {
            const val = l.__component.getValue()
            if(!val || val.length === 0) return null
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

    h() {
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
                <CheckboxComponent ref={this.anonymousRef} label="Anonymous Voting" checked input={this.checkboxUpdate.bind(this)}/>
                <CheckboxComponent ref={this.multipleRef} label="Multiple Answers"/>
                <CheckboxComponent ref={this.quizRef} label="Quiz Mode" input={this.checkboxUpdate.bind(this)}/>
            </div>
        </div>
    }

    checkboxUpdate(ev) {
        // if(!this.multipleRef.$el.querySelector("input").checked && !this.quizRef.$el.querySelector("input").checked) {
        //     return
        // }
        // if (ev.target.parentNode.parentNode === this.quizRef.$el) {
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
                pFlags: {
                    public_voters: !this.anonymousRef.$el.querySelector("input").checked,
                    multiple_choice: this.multipleRef.$el.querySelector("input").checked,
                    quiz: this.quizRef.$el.querySelector("input").checked
                },
                question: this.askQuestionRef.component.getValue(),
                answers: this.optionsRef.component.getAnswersInput()
            }
        }
    }

    create() {
        AppSelectedPeer.Current.api.sendMessage({media: this.createPollInput()})
        ModalManager.close()
    }
}