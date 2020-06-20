/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../EventBus/UIEvents"
import SimpleVirtualList from "../../../V/VRDOM/list/SimpleVirtualList"
import {formatAudioTime} from "../../Utils/utils"
import AudioPlayer from "../../../Api/Media/AudioPlayer"
import AppEvents from "../../../Api/EventBus/AppEvents"
import DocumentParser from "../../../Api/Files/DocumentParser"
import API from "../../../Api/Telegram/API"

function AudioItem({message}) {
    const isPlaying = AudioPlayer.isCurrent(message);
    const {isPaused} = AudioPlayer.state;
    const audioInfo = DocumentParser.attributeAudio(message.raw.media.document);

    return (
        <div class="AudioItem">
            <div className={`play tgico tgico-${isPlaying && !isPaused ? 'pause' : 'play'} rp rps rp-white`}
                 onClick={() => AudioPlayer.toggle(message)}/>
            <div className="details">
                <span className="title">{audioInfo.title}</span>-<span
                className="performer">{audioInfo.performer}</span>
            </div>
        </div>
    )
}

// WIP
class AudioPlayerComponent extends StatefulComponent {
    state = {
        message: null,
        isShown: false,
        queue: [],
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("audio.showPlayer", this.onAudioShowPlayer);

        E.bus(AppEvents.Audio)
            .filter(event => event.state.message === this.state.message || this.isPlaying)
            .on("audio.play", this.onPlay)
            .updateOn("audio.paused")
            .updateOn("audio.loading")
            .updateOn("audio.buffered")
            .updateOn("audio.timeUpdate")
            .on("audio.stop", this.onStop)
            .updateOn("audio.ended");
    }

    render(props, {message, isShown, queue}) {
        if (!message) {
            return <div css-display="none"/>
        }

        const isPlaying = AudioPlayer.isCurrent(message);
        const {isPaused, currentTime, bufferedPercentage, isSeeking, audioInfo} = AudioPlayer.state;

        return (
            <div className={{
                "modal-wrapper": true,
                "AudioPlayer": true,
                "really-hidden": !isShown,
            }}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog scrollable" onClick={event => event.stopPropagation()}>

                        <div className="Head">
                            <div className="audio">
                                <div
                                    className={`play tgico tgico-${isPlaying && !isPaused ? 'pause' : 'play'} rp rps rp-white`}
                                    onClick={this.onClickPlay}/>
                                <div className="audio-wrapper rp rps">
                                    <div className="controls">
                                        <div className="audio-name">
                                            {audioInfo.title}
                                        </div>
                                        <div className="audio-artist">
                                            {audioInfo.performer}
                                        </div>

                                        <div className={[`progress-wrapper`, isPlaying || `hidden`]}
                                             onMouseEnter={this.onMouseEnter}
                                             onMouseLeave={this.onMouseLeave}
                                             onMouseDown={this.onMouseDown}>
                                            <div style={{
                                                width: `${bufferedPercentage}%`
                                            }} className="buffered"/>
                                            <div className="progress-line"/>
                                            <div className="listened-wrapper">
                                                <div style={{
                                                    width: `${currentTime / audioInfo.duration * 100}%`
                                                }} className="listened"/>
                                                <div className="control-ball"/>
                                            </div>
                                        </div>
                                        <div className="timer">
                                        <span className="played-wrapper">
                                            <span className="time-played">
                                                {isPlaying ? formatAudioTime(currentTime) : formatAudioTime(audioInfo.duration)}
                                            </span>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="List">
                            <SimpleVirtualList containerHeight={500}
                                               itemHeight={50}
                                               items={queue}
                                               template={(message) => <AudioItem message={message}/>}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onAudioShowPlayer = () => {
        const message = AudioPlayer.state.message;

        this.setState({
            message,
            isShown: true,
        });
        //
        // this.requeue(message);
    }

    close = () => {
        this.setState({
            isShown: false,
        });
    }

    onClickPlay = () => {
        AudioPlayer.toggle(this.props.message)
    }

    onMouseEnter = event => {
        event.target.addEventListener("mousemove", this.onMouseDown);
    }

    onMouseLeave = event => {
        event.target.removeEventListener("mousemove", this.onMouseDown);
    }

    onMouseDown = (event: MouseEvent) => {
        if (event.buttons === 1) {
            const box = event.target.getBoundingClientRect();
            const percent = (event.pageX - box.x) / box.width;
            AudioPlayer.updateTime(DocumentParser.attributeAudio(this.state.message.media.document).duration * percent)
        }
    }

    onPlay = ({state}) => {
        this.setState({
            message: state.message,
        });

        // if (state.message !== this.state.message) {
        //     this.setState({
        //         queue: []
        //     });
        //
        //     this.requeue(state.message);
        // }
    }

    onStop = ({state}) => {
        this.setState({
            message: null,
            queue: [],
        });
    }

    requeue(message) {
        API.messages.getHistory(message.dialogPeer, {
            offset_id: AudioPlayer.state.message.id,
            limit: 100,
            add_offset: -50,
        }).then(Messages => {

            if (this.state.message === message) {
                const messages = message.dialogPeer.messages.putRawMessages(Messages.messages);

                this.setState({
                    queue: messages,
                });
            }
        })
    }
}

export default AudioPlayerComponent;