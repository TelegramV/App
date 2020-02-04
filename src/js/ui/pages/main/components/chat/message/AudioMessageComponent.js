import AudioComponent from "./common/AudioComponent"
import {FileAPI} from "../../../../../../api/fileAPI"
import {formatAudioTime} from "../../../../../utils"

import AudioManager from "../../../../../audioManager"

class AudioMessageComponent extends AudioComponent {

	constructor(props) {
		super(props);
		console.log(this.message.raw.media)
		let attrs = this.message.raw.media.document.attributes;
		this.meta = {};

		for(const attr of attrs) {
			if(attr._=="documentAttributeAudio") {
				this.meta = {
					title: attr.title,
					artist: attr.performer
				}
			}
			if(attr._=="documentAttributeFilename") {
				if(!this.meta.title) {
					this.meta.title = attr.file_name;
				}
			}
		}
	}

	init() {
		super.init();
		let file = this.message.raw.media.document

		if(file.thumbs) {
			FileAPI.getThumb(file, "max").then(l => {
				// Tint
				this.$el.querySelector(".play").style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${l})`
				this.thumb = l
			})
		}

	}

	getControls() {
		return (
			<div class="controls">
				<div class="audio-name">{this.meta.title}</div>
				<div class="audio-artist">{this.meta.artist}</div>
				<div class="progress-wrapper hidden" onMouseEnter={this._handleEnter.bind(this)} onMouseLeave={this._handleLeave.bind(this)}
	             onMouseDown={this._handleMove.bind(this)}>
		    		<div class="progress-line"/>
		    		<div class="listened-wrapper">
		    			<div class="listened"/>
		    			<div class="control-ball"/>
		    		</div>
				</div>
		        <div class="timer short">
		            <span class="played-wrapper"><span class="time-played"></span> / </span>{formatAudioTime(this.duration)}
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
	}

	updatePercent(percent) {
		this.listened.style.width = percent*100+"%";
	}

	async getMeta() {
    	let file = this.message.raw.media.document
		let size = FileAPI.getMaxSize(file)
		let src = this.thumb;
		const minSize = 114;
		if(size.w < minSize || size.h < minSize) {
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
    	this.artistEl.classList.add("hidden");
    	this.progressEl.classList.remove("hidden");
    	this.$el.querySelector(".timer").classList.remove("short");
    }

}

export default AudioMessageComponent