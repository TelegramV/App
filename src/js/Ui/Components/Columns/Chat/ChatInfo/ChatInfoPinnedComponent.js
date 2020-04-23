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

import AppEvents from "../../../../../Api/EventBus/AppEvents";
import UIEvents from "../../../../EventBus/UIEvents";
import {MessageParser} from "../../../../../Api/Messages/MessageParser";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import AppSelectedChat from "../../../../Reactive/SelectedChat";

class ChatInfoPinnedComponent extends VComponent {

    state = {
        audio: undefined,
        voice: undefined,
        message: undefined,
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("pinnedMessageFound", this.onPinnedMessageFound)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelected)
    }

    render() {
        if (this.state.audio || this.state.voice) {
            return (
                <div className="pin active-audio">
                    <div className="play">
                        <i class="tgico tgico-play"/>
                    </div>
                    <div className="audio-info">
                        <div className="title">Title</div>
                        <div className="description">Musician</div>
                    </div>
                </div>
            )
        } else if (this.state.message) {
            return (
                <div className="pin pinned-message"
                     onClick={event => UIEvents.General.fire("chat.showMessage", this.state.message)}>
                    <div className="title">Pinned message</div>
                    <div className="description">{MessageParser.getPrefixNoSender(this.state.message)}</div>
                </div>
            )
        } else {
            return <div className="pin"/>;
        }
    }

    onChatSelected = _ => {
        if (AppSelectedChat.isSelected) {
            this.setState({
                message: AppSelectedChat.Current._pinnedMessage
            })
        }
    }

    onPinnedMessageFound = event => {
        if (event.message && AppSelectedChat.check(event.message.to)) {
            this.setState({
                message: event.message
            })
        } else {
            this.setState({
                message: null
            })
        }
    }
}

export default ChatInfoPinnedComponent