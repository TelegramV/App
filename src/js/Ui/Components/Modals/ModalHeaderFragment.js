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
import VUI from "../../VUI"

export class ModalHeaderFragment extends VComponent {
    render() {
        return <div className="header">
            {
                this.props.close ? <i className="tgico tgico-close btn-icon" onClick={_ => VUI.Modal.close()}/> : ""
            }
            {this.props.title}
            {
                this.props.actionText ? <div className="modal-action-btn rp rps"
                                             onClick={this.props.action}>{this.props.actionText}</div> : ""
            }
        </div>
    }
}