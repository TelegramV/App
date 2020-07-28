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
import VComponent from "../../../V/VRDOM/component/VComponent"
import VUI from "../../VUI"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import VInput from "../../Elements/Input/VInput"
import ReactionsAddModal from "./ReactionsAddModal"
import API from "../../../Api/Telegram/API"

export default class ReactionsModal extends StatefulComponent {

    state = {
        list: []
    }

    render({message}) {
        return <div className="attach-modal">
            <ModalHeaderFragment title="Reactions" close actionText="Add" action={this.add}/>
            {this.state.list}
        </div>
    }

    componentDidMount() {
        let message = this.props.message;
        /*API.messages.getMessageReactionsList(message.from.inputPeer, message.id).then(list => {
            this.setState({
                list: list
            })
        })*/
    }

    add = () => {
        VUI.Modal.open(<ReactionsAddModal message={this.props.message}/>);
    }
}