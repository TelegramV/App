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
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"
import className from "../../../V/VRDOM/jsx/helpers/className"

export class FlatButtonComponent extends VComponent {

    render() {
        const className = className(
            "btn-flat",
            "rp",
            classIf(this.props.disabled, "disabled"),
            classIf(this.props.red, "red"),
        )

        return (
            <button className={className} onClick={this.onClick}>
                <span className="button-text">{this.props.label}</span>
            </button>
        )
    }

    onClick = (event) => {
        if (this.props.disabled) {
            return
        }

        this.props.click(event)
    }

    set label(label) {
        this.props.label = label
        this.forceUpdate()
    }

    setDisabled = (value = true) => {
        this.props.disabled = value
        this.forceUpdate()
    }
}