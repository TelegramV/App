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

import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import DocumentParser from "../../../../../Api/Files/DocumentParser"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {formatAudioTime} from "../../../../Utils/utils"
import AudioPlayer from "../../../../../Api/Media/AudioPlayer"
import FileManager from "../../../../../Api/Files/FileManager"

class NewAudioMessageComponent extends GeneralMessageComponent {
    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Audio)
            .filter(event => event.state.message === this.props.message || this.isPlaying)
            .updateOn("audio.play")
            .updateOn("audio.paused")
            .updateOn("audio.loading")
            .updateOn("audio.buffered")
            .updateOn("audio.timeUpdate")
            .updateOn("audio.ended")
    }

    render({message, showDate}, state) {
        const isPlaying = AudioPlayer.isCurrent(message);
        const audioInfo = DocumentParser.attributeAudio(message.media.document);
        const {isPaused, currentTime, bufferedPercentage, isSeeking} = AudioPlayer.state;

        this.isPlaying = isPlaying // dirty hack, do not repeat

        return (
            <MessageWrapperFragment message={message} showUsername={false} showDate={showDate}>
                <div class="audio">
                    <div class={`play tgico tgico-${isPlaying && !isPaused ? 'pause' : 'play'} rp rps rp-white`}
                         onClick={this.onClickPlay}
                         onDoubleClick={event => event.stopPropagation()}>
                        <progress className={{
                            "progress-circular": true,
                            "visible": !FileManager.getPercentage(message.media.document) || isSeeking,
                        }}/>
                    </div>
                    <div class="audio-wrapper rp rps">
                        <div className="controls">
                            <div className="audio-name">
                                {audioInfo.title || DocumentParser.attributeFilename(message.media.document)}
                            </div>
                            <div className="audio-artist">{audioInfo.performer}</div>

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
                                {isPlaying && <span className="played-wrapper">
                                    <span className="time-played">{formatAudioTime(currentTime)}</span>
                                    /
                                </span>}
                                {formatAudioTime(audioInfo.duration)}
                            </div>
                        </div>

                    </div>
                </div>

                <TextWrapperComponent message={message}/>
            </MessageWrapperFragment>
        )
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
            AudioPlayer.updateTime(DocumentParser.attributeAudio(this.props.message.media.document).duration * percent)
        }
    }
}

export default NewAudioMessageComponent