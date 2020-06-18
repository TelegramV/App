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
        hidden: false,
        unhidden: false,
        reallyHidden: true,
        body: "",
    }

    init() {
        VUI.Modal = this
    }

    // TODO fix loginscreen modal

    render() {
        return (
            <div
                // css-display={this.state.hidden && "none"}
                 className={classNames("modal-wrapper", classIf(this.state.hidden, "hidden"), classIf(this.state.unhidden, "unhidden"), classIf(this.state.reallyHidden, "really-hidden"))}
            onAnimationEnd={this.onTransitionEnd}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog scrollable" onClick={event => event.stopPropagation()}>
                        {this.state.body}
                    </div>
                </div>
            </div>
        )
    }

    onTransitionEnd = (ev) => {
        if(ev.animationName === "hidden-modal") {
            this.setState({
                reallyHidden: true,
                body: ""
            })
        }
    }

    close = () => {
        this.setState({
            hidden: true,
            unhidden: false
        })
    }

    open = (body) => {
        this.setState({
            reallyHidden: false,
            hidden: false,
            unhidden: true,
            body: body
        })
    }
}

export default ModalContainer;