import AudioComponent from "./Common/AudioComponent"
import {FileAPI} from "../../../../../Api/Files/FileAPI"
import {formatAudioTime} from "../../../../Utils/utils"

class AudioMessageComponent extends AudioComponent {

    constructor(props) {
        super(props);
        let attrs = this.props.message.raw.media.document.attributes;
        this.meta = {};

        for (const attr of attrs) {
            if (attr._ == "documentAttributeAudio") {
                this.meta = {
                    title: attr.title,
                    artist: attr.performer || " "
                }
            }
            if (attr._ == "documentAttributeFilename") {
                if (!this.meta.title) {
                    this.meta.title = attr.file_name;
                }
            }
        }
    }

    addCover = () => {
        let file = this.props.message.raw.media.document

        if (file.thumbs) {
            FileAPI.getThumb(file, "max").then(l => {
                if (this.__.destroyed) return;
                // Tint
                this.$el.querySelector(".play").style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${l})`

                // uncomment these to make bg cover
                // this.$el.querySelector(".bubble").style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9)), url(${l})`
                // this.$el.querySelector(".bubble").style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${l})`
                // this.$el.querySelector(".message").style.backdropFilter = 'blur(20px)'

                this.thumb = l
            })
        }

    }

    getControls() {
        return (
            <div class="controls">
                <div class="audio-name">{this.meta.title}</div>
                <div class="audio-artist">{this.meta.artist}</div>
                <div class="progress-wrapper hidden" onMouseEnter={this._handleEnter.bind(this)}
                     onMouseLeave={this._handleLeave.bind(this)}
                     onMouseDown={this._handleMove.bind(this)}>
                    <div class="progress-line"/>
                    <div class="listened-wrapper">
                        <div class="listened"/>
                        <div class="control-ball"/>
                    </div>
                </div>
                <div class="timer short">
                    <span class="played-wrapper"><span class="time-played"/> / </span>
                    {formatAudioTime(this.duration)}
                </div>
            </div>
        )
    }

    controlsMounted() {
        this.timer = this.$el.querySelector(".time-played");
        this.setTimerElement(this.timer);
        this.progressEl = this.$el.querySelector(".progress-wrapper");
        this.setProgressElement(this.progressEl);

        this.listened = this.$el.querySelector(".listened");
        this.artistEl = this.$el.querySelector(".audio-artist");

        this.addCover();
    }

    updatePercent(percent) {
        if (this.__.destroyed) return;
        this.listened.style.width = percent * 100 + "%";
    }

    async getMeta() {
        let file = this.props.message.raw.media.document
        let size = FileAPI.getMaxSize(file)
        let src = this.thumb;
        const minSize = 114;
        if (size.w < minSize || size.h < minSize) {
            src = undefined; //won't show in tab
        }
        return {
            title: this.meta.title,
            artist: this.meta.artist,
            album: "Telegram", //sorry, no data from TG on that. Maybe replace with dialog name?
            artwork: [{
                src: src,
                sizes: size.w + "x" + size.h,
            }]
        }
    }

    _onDownload() {
        if (this.__.destroyed) return;
        this.artistEl.classList.add("hidden");
        this.progressEl.classList.remove("hidden");
        this.$el.querySelector(".timer").classList.remove("short");
    }

}

export default AudioMessageComponent