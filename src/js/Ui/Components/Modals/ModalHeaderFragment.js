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

import VUI from "../../VUI"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import VButton from "../../Elements/Button/VButton"

export class ModalHeaderFragment extends StatelessComponent {
    render() {
        return <div className="header">
            {
                this.props.close ? <i className="tgico tgico-close btn-icon" onClick={_ => VUI.Modal.close()}/> : ""
            }
            {this.props.title}
            {
                this.props.actionText && <VButton onClick={this.props.action}>{this.props.actionText}</VButton>
            }
        </div>
    }
}