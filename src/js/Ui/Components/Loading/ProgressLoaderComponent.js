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

class ProgressLoaderComponent extends VComponent {

    render() {
        let progress = Number.isInteger(this.props.progress) ? this.props.progress : 0;
        return (
            <svg class="progress-ring">
                <circle class="progress-ring__circle"/>
            </svg>
        )
    }

    componentDidMount() {
        this.circle = this.$el.querySelector('.progress-ring__circle');  // dude what the fuck, there exist refs, did you know?) #1
        this.withTimeout(this._calculateSize, 0); // dude what the fuck?) #2
    }

    _calculateSize = () => {
        const radius = this.circle.getBBox().width / 2;
        this.circumference = 2 * Math.PI * radius;

        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;

        if (this.props.progress) {
            this.setProgress(this.props.progress / 100);
        }
    }

    /**
     0.0 - 1.0 percent
     **/

    setProgress = (percent) => {
        if (!percent) percent = 0;
        const offset = this.circumference - percent * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }
}

export default ProgressLoaderComponent;