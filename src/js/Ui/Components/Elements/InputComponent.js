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

import VComponent from "../../../V/VRDOM/component/VComponent"
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"
import classNames from "../../../V/VRDOM/jsx/helpers/classNames"

/**
 * @deprecated
 */
export class InputComponent extends VComponent {

    inputRef = VComponent.createRef()

    state = {
        value: this.props.value
    }

    render() {
        const classes = classNames(
            "input-field",
            classIf(this.props.type === "password", "peekable", "password-input")
        )

        const peekClasses = classNames(
            "btn-icon", "rp", "rps", "tgico",
            classIf(!this.props.hide, "peek")
        )

        return (
            <div className={classes}>
                {
                    nodeIf(
                        <i id="peekButton"
                           className={peekClasses}
                           onClick={this.peek}/>,
                        this.props.type === "password"
                    )
                }

                <input onKeyDown={this.onKeyDown}
                       type={this.props.type === "password" && !this.props.hide ? "text" : this.props.type}
                       autoComplete="pls,no" placeholder={this.props.error || this.props.label}
                       value={this.props.error || this.props.value || ""}
                       onInput={event => this.onInput(event, this.props.filter, this.props.input)}
                       ref={this.inputRef}
                       className={classIf(this.props.error, "invalid")}/>

                <label>{this.props.error || this.props.label}</label>
            </div>
        )
    }

    set error(error) {
        this.props.error = error
        this.forceUpdate()
    }

    get error() {
        return this.props.error
    }

    onKeyDown = (ev) => {
        if ((ev.which === 13 || ev.which === 10) && !ev.shiftKey && !ev.ctrlKey) {
            ev.preventDefault()
            this.onInput(ev, this.props.filter, this.props.input)
        }
    }

    onInput = (ev, filter, input) => {
        const target = ev.target
        if (filter) {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if (!filter(target.value) || (input && !input(ev))) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            } else {
                if (this.error) {
                    this.error = undefined
                }
            }
            this.state.value = target.value

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        } else {
            const previousValue = target.previousValue || ""
            const previousSelectionStart = target.previousSelectionStart || 0
            const previousSelectionEnd = target.previousSelectionEnd || 0

            if (input && !input(ev)) {
                target.value = previousValue
                target.setSelectionRange(previousSelectionStart, previousSelectionEnd)
            } else {
                if (this.error) {
                    this.error = undefined
                }
            }
            this.state.value = target.value

            target.previousValue = target.value
            target.previousSelectionStart = target.selectionStart
            target.previousSelectionEnd = target.selectionEnd
        }
    }

    peek = () => {
        this.props.hide = !this.props.hide
        if (this.props.peekChange) {
            this.props.peekChange(this.props.hide)
        }
        this.forceUpdate()
    }

    getValue = () => {
        return this.state.value
    }

    setValue = (value) => {
        this.props.value = value
        this.forceUpdate()
        this.$el.querySelector("input").value = value
    }
}