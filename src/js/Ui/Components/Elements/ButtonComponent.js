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
import className from "../../../V/VRDOM/jsx/helpers/className"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"

export class ButtonWithProgressBarComponent extends VComponent {

    state = {
        isLoading: false
    }

    render() {
        const className = className(
            classIf(this.props.disabled, "disabled"),
            classIf(this.state.isLoading, "loading"),
        )

        return (
            <button className={className} onClick={this.onClick}>
                <span className="button-text">{this.props.label}</span>
                <progress className="progress-circular white"/>
            </button>
        )
    }

    onClick = event => {
        if (this.props.disabled || this.state.isLoading) {
            return
        }

        this.props.click(event)
    }

    set isLoading(isLoading) {
        this.setState({
            isLoading
        })
    }

    set label(label) {
        // fuck fuck fuck
        this.props.label = label
        this.forceUpdate()
    }

    setDisabled = (disabled = true) => {
        this.setState({
            disabled
        })
    }
}