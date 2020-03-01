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

import {InputComponent} from "../Elements/InputComponent";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import VComponent from "../../../V/VRDOM/component/VComponent"
import VUI from "../../VUI"

export class AttachLinkModal extends VComponent {
    render() {
        return <div className="attach-modal">
            <ModalHeaderFragment title="Create link" close actionText="Create" action={this.create}/>
            <div className="padded bottom">
                <InputComponent ref="createLinkText" label="Text" value={this.props.text || ""}/>
                <InputComponent ref="createLinkUrl" label="URL"/>
            </div>
        </div>
    }

    create() {
        const text = this.refs.get("createLinkText").getValue()
        const url = this.refs.get("createLinkUrl").getValue()
        this.props.close(text, url)
        VUI.Modal.close()
    }
}