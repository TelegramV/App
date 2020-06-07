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
import AudioPlayer from "../../../../../Api/Audio/AudioPlayer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {formatAudioTime} from "../../../../Utils/utils"

class NewAudioMessageComponent extends GeneralMessageComponent {
    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.General)
            .filter(event => event.state.document.id === this.props.message.media.document.id || this.isPlaying)
            .updateOn("audio.play")
            .updateOn("audio.paused")
            .updateOn("audio.loading")
            .updateOn("audio.buffered")
            .updateOn("audio.timeUpdate")
            .updateOn("audio.ended")
    }

    render({message}, state) {
        const document = message.media.document
        const audio = DocumentParser.attributeAudio(document)
        const isPlaying = AudioPlayer.isCurrent(document)
        const isPaused = AudioPlayer.isPaused()
        const isEnded = AudioPlayer.isEnded()
        const timestamp = AudioPlayer.currentTime()
        const bufferedPercentage = AudioPlayer.bufferedPercentage()

        this.isPlaying = isPlaying // dirty hack, do not repeat

        return (
            <MessageWrapperFragment message={message} showUsername={false}>
                <div class="audio">
                    <div
                        class={`play tgico tgico-${isPlaying && !isPaused && !isEnded ? 'pause' : 'play'} rp rps rp-white`}
                        onClick={this.onClickPlay}
                        onDoubleClick={event => event.stopPropagation()}/>

                    <div class="audio-wrapper rp rps">
                        <div className="controls">
                            <div className="audio-name">
                                {audio.title || DocumentParser.attributeFilename(message.media.document)}
                            </div>
                            <div className="audio-artist">{audio.performer}</div>

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
                                        width: `${timestamp / audio.duration * 100}%`
                                    }} className="listened"/>
                                    <div className="control-ball"/>
                                </div>
                            </div>
                            <div className="timer">
                                {isPlaying && <span className="played-wrapper">
                                    <span className="time-played">{formatAudioTime(timestamp)}</span>
                                    /
                                </span>}
                                {formatAudioTime(audio.duration)}
                            </div>
                        </div>

                    </div>
                </div>

                <TextWrapperComponent message={message}/>
            </MessageWrapperFragment>
        )
    }

    onClickPlay = () => {
        AudioPlayer.toggle(this.props.message.media.document)
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