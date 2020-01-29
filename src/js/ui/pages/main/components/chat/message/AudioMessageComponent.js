import AudioComponent from "./common/AudioComponent"
import {FileAPI} from "../../../../../../api/fileAPI"

import AudioManager from "../../../../../audioManager"

class AudioMessageComponent extends AudioComponent {

	constructor(props) {
		super(props);

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
		            <span class="played-wrapper"><span class="time-played"></span> / </span>{this._timeToFormat(this.duration)}
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
    	let doc = this.message.raw.media.document;
    	//TODO download thumb
    	return {
    		title: this.meta.title,
    		artist: this.meta.artist,
    		album: "Telegram", //sorry, no data from TG on that. Maybe replace with dialog name?
    		artwork: [{
    			src: undefined, //TODO FileAPI method
    			sizes: "192x192",
    			type: "application/jpeg"
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