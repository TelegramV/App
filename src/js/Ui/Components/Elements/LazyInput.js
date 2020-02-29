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

// райтс https://github.com/HurricaneJames/lazy-input/blob/master/src/LazyInput.jsx

class LazyInput extends VComponent {

    procrastinating = false

    lazyLevel = this.props.lazyLevel || 1000

    state = {
        value: this.props.value,
        requestedValue: undefined
    }

    render() {
        return (
            <input type={this.props.type}
                   onInput={this.onInput}
                   onFocus={this.props.onFocus}
                   placeholder={this.props.placeholder}/>
        )
    }

    updateIfNotLazy = (newValue, event) => {
        if (!this.procrastinating) {
            if (this.state.value !== newValue) {
                this.state.value = newValue
                this.state.requestedValue = undefined
                this.props.onInput(event)
            }
        } else {
            this.state.requestedValue = newValue
        }
    }

    procrastinate = (event) => {
        if (this.state.value !== undefined && event.target.value.trim() !== this.state.value.trim()) {
            this.procrastinating = true
            this.clearTimeouts()
            this.withTimeout(() => this.ohAlrightAlready(event), this.lazyLevel)
        }
    }

    ohAlrightAlready = (event) => {
        this.procrastinating = false
        this.updateIfNotLazy(this.state.requestedValue, event)
    }

    onInput = (event) => {
        this.procrastinate(event)
        this.state.value = event.target.value
    }
}

LazyInput.defaultProps = {
    type: "text"
}

export default LazyInput