import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import AudioPlayer from "../../../../../../Api/Media/AudioPlayer"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"
import {formatAudioTime} from "../../../../../Utils/utils"
import FileManager from "../../../../../../Api/Files/FileManager"
import AppSelectedChat from "../../../../../Reactive/SelectedChat"

// copypasteeeeeee (we should create state for such components)
export class DialogInfoAudioComponent extends StatefulComponent {
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

    render({message}) {
        const isPlaying = AudioPlayer.isCurrent(message);
        const audioInfo = DocumentParser.attributeAudio(message.media.document);
        const {isPaused, currentTime, bufferedPercentage, isSeeking} = AudioPlayer.state;

        this.isPlaying = isPlaying // dirty hack, do not repeat

        return (
            <div className="audio rp">
                <div className={`play tgico tgico-${isPlaying && !isPaused ? 'pause' : 'play'} rp rps rp-white`}
                     onClick={this.onClickPlay}>
                    <progress className={{
                        "progress-circular": true,
                        "visible": !FileManager.getPercentage(message.media.document) || isSeeking,
                    }}/>
                </div>
                <div className="details" onClick={this.onClick}>
                    <span className="title">
                        {audioInfo.title || DocumentParser.attributeFilename(message.media.document)}
                    </span>
                    <span className="description">{audioInfo.performer}</span>
                    <span className="time">
                        {isPlaying ? formatAudioTime(currentTime) : formatAudioTime(audioInfo.duration)}
                    </span>
                </div>
            </div>
        )
    }

    onClick = (event) => {
        if (!event.target.classList.contains("play")) {
            AppSelectedChat.showMessage(this.props.message);
        }
    }

    onClickPlay = (event) => {
        console.log("WAT THE FUCK")
        AudioPlayer.toggle(this.props.message);
    }
}