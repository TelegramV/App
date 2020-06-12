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
import classNames from "../../../V/VRDOM/jsx/helpers/classNames"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

class ModalContainer extends StatefulComponent {
    state = {
        hidden: true,
        body: ""
    }

    init() {
        VUI.Modal = this
    }

    // TODO fix loginscreen modal

    render() {
        return (
            <div css-display={this.state.hidden && "none"}
                 className={classNames("modal-wrapper", classIf(this.state.hidden, "hidden"))}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog" onClick={event => event.stopPropagation()}>
                        {this.state.body}
                    </div>
                </div>
            </div>
        )
    }

    close = () => {
        this.setState({
            hidden: true,
            body: ""
        })
    }

    open = (body) => {
        this.setState({
            hidden: false,
            body: body
        })
    }
}

export default ModalContainer;