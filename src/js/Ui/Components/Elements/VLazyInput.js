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

class VLazyInput extends VComponent {
    lazyLevel = this.props.lazyLevel || 1000;
    value = this.props.value;

    render() {
        return (
            <input type={this.props.type}
                   onInput={this.onInput}
                   onFocus={this.props.onFocus}
                   placeholder={this.props.placeholder}/>
        );
    }

    onInput = (event) => {
        this.clearTimeouts();

        if (!this.value !== event.value) {
            this.withTimeout(() => {
                if (!this.value !== event.value) {
                    this.props.onInput(event);
                }
            }, this.lazyLevel);
        }
    }
}

VLazyInput.defaultProps = {
    type: "text"
}

export default VLazyInput