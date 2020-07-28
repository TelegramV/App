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

import { ModalHeaderFragment } from "./ModalHeaderFragment";
import VComponent from "../../../V/VRDOM/component/VComponent"
import VUI from "../../VUI"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import VInput from "../../Elements/Input/VInput"
import API from "../../../Api/Telegram/API"

export default class ReactionsAddModal extends StatefulComponent {

    state = {
        emoji: ""
    }

    render({ message }) {
        return (<div className="attach-modal">
            <ModalHeaderFragment title="Add reaction" close actionText="Add" action={this.add}/>
            <VInput label="Enter Emoji" onInput={this.onInput.bind(this)} value={this.state.emoji}/>
        </div>)
    }

    onInput = (ev) => {
		this.setState({
    		emoji: ev.currentTarget.value
    	})
    }

    add = () => {
        let message = this.props.message;
        API.messages.sendReaction(message.to.inputPeer, message.id, this.state.emoji);
        VUI.Modal.close();
    }
}