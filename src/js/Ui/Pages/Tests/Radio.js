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

import VRadio from "../../Elements/Input/VRadio"
import VButton from "../../Elements/Button/VButton"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

export default function RadioButtonPage() {
    return (
        <div>
            <RadioTest/>
        </div>
    );
}

class RadioTest extends StatefulComponent {

	state = {
		checked: false
	}

	render({}, {checked}) {
		return (
			<div>
				<VRadio checked={checked}/>
				<VButton onClick={() => {this.setState({
					checked: true
				})}}>Checked: true</VButton>
				<VButton onClick={() => {this.setState({
					checked: false
				})}}>Checked: false</VButton>
				<VButton onClick={() => {this.forceUpdate()}}>forceUpdate</VButton>
			</div>
		)
	}
}