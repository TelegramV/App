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
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import AudioPlayer from "../../../../../Api/Audio/AudioPlayer"

class ChatInfoPinnedComponent extends StatefulComponent {
    state = {
        audio: undefined,
        pause: undefined,
        meta: undefined,
        message: undefined,
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("pinnedMessageFound", this.onPinnedMessageFound)

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelected)

        E.bus(AppEvents.Audio)
            .updateOn("audio.play")
            .updateOn("audio.paused")
            .updateOn("audio.stop")
            .updateOn("audio.timeUpdate")
    }

    render() {
        if (AudioPlayer.state.message) {
            let playClasses = ["tgico", !AudioPlayer.state.isPaused ? "tgico-pause" : "tgico-play"];
            return (
                <div className="pin active-audio">
                    <div className="play rp rps" onClick={() => AudioPlayer.toggle()}>
                        <i class={playClasses}/>
                    </div>
                    <div className="audio-info"
                         onClick={() => UIEvents.General.$chat.showMessage(AudioPlayer.state.message)}>
                        <div
                            className="title">{AudioPlayer.state.isVoice ? AudioPlayer.state.message.from.name : AudioPlayer.state.audioInfo.title || AudioPlayer.state.fileName}</div>
                        <div
                            className="description">{AudioPlayer.state.isVoice ? "Voice message" : AudioPlayer.state.audioInfo.performer}</div>
                    </div>
                    <div class="close">
                        <i className="tgico tgico-close"/>
                    </div>
                </div>
            )
        } else if (this.state.message) {
            return (
                <div className="pin pinned-message"
                     onClick={event => UIEvents.General.$chat.showMessage(this.state.message)}>
                    <div class="message-info">
                        <div className="title">Pinned message</div>
                        <div className="description">{MessageParser.getPrefixNoSender(this.state.message)}</div>
                    </div>
                    <div class="close">
                        <i className="tgico tgico-close"/>
                    </div>
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

    onAudioPlay = event => {
        event.audio.getMeta().then(meta => {
            this.setState({
                audio: event.audio,
                meta: meta,
                pause: false
            })
        });
    }

    onAudioPause = event => {
        this.setState({
            pause: true
        })
    }

    onAudioRemove = event => {
        this.setState({
            audio: undefined,
            meta: undefined
        })
    }
}

export default ChatInfoPinnedComponent