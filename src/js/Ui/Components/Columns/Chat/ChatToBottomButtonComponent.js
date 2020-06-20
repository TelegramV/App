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

import UIEvents from "../../../EventBus/UIEvents";
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent"

class ChatToBottomButtonComponent extends StatefulComponent {
    state = {
        isShown: false,
    };

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("chat.scrollBottom.show", this.onShow)
            .on("chat.scrollBottom.hide", this.onHide);
    }

    render() {
        let style = {
            "bottom": "0px",
            "box-shadow": "none",
        };

        if (this.state.isShown) {
            style = {
                "bottom": "70px",
                "box-shadow": "0 2px 3px 0 rgba(16, 35, 47, .15)",
            };
        }

        return (
            <div className="chat-scroll-bottom rp rps"
                 style={style}
                 onClick={this.onClick}>
                <i className="tgico tgico-down"/>
            </div>
        );
    }

    onClick = () => {
        UIEvents.General.fire("chat.scrollBottom");
    }

    onShow = () => {
        if (!this.state.isShown) {
            this.setState({
                isShown: true,
            });
        }
    }

    onHide = () => {
        if (this.state.isShown) {
            this.setState({
                isShown: false,
            });
        }
    }
}

export default ChatToBottomButtonComponent;