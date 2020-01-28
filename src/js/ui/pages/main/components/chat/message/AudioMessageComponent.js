import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {FileAPI} from "../../../../../../api/fileAPI"

import AudioManager from "../../../../../audioManager"

class AudioMessageComponent extends GeneralMessageComponent {

	init() {
		this.message = this.props.message;
		console.log(this.message)

		let attrs = this.message.raw.media.document.attributes;
		for(const attr of attrs) {
			if(attr._=="documentAttributeAudio") {
				this.meta = {
					title: attr.title,
					artist: attr.performer
				}
				this.duration = attr.duration
			}
			if(attr._=="documentAttributeFilename") {
				if(!this.meta.title) {
					this.meta.title = attr.file_name;
				}
			}
		}
		this.textDuration = this._timeToFormat(this.duration);

		this.playing = false;

	}

    h() {
        return (
            <MessageWrapperFragment message={this.props.message}>
                <div class="audio">
                	{this.loading?<progress class="progress-circular"/> : ""}
                    <div class="play tgico tgico-play" onMouseDown={this._playButtonClick.bind(this)}/>
                    <div class="audio-wrapper">
                    	<div class="audio-name">{this.meta.title}</div>
						<div class="progress-container" onMouseEnter={this._handleEnter} onMouseLeave={this._handleLeave}
                             onMouseDown={this._handleMove}>
							{this.getProgress()}
						</div>
                        <div class="timer">
                            0:00 / {this.textDuration}
                            <span class="read"></span>
                        </div>
                    </div>
                </div>
                <TextWrapperComponent message={this.props.message}/>
            </MessageWrapperFragment>
        )
    }

    mounted() {
        this.progressContainer = this.$el.querySelector(".progress-container");
        this.progressEl = this.progressContainer.childNodes[0];
        this.playButton = this.$el.querySelector(".play");
        this.timer = this.$el.querySelector(".timer");
        this.progressMounted();
    }

    progressMounted() {
    	this.listened = this.progressEl.querySelector(".listened");
    }

    setPercent(percent) {
    	this.listened.style.width = percent*100+"%";
    }

    play() {
    	if(this.tryingPlay) return; //I got my audio played twice without this
    	this.playButton.classList.add("tgico-pause");
        this.playButton.classList.remove("tgico-play");
        this.playButton.classList.remove("tgico-close");
        if(!this.audio) {
    		this.downloadAndPlay();
    	} else {
    		this.tryingPlay = true;
	        this.audio.play().then(q=> {
	        	this.tryingPlay = false;
	        	this.playing = true;
	        	AudioManager.set(this);
	        });
    	}
    }

    downloadAndPlay() {
    	this.setLoading(true);
    	this.playButton.classList.remove("tgico-pause");
    	this.playButton.classList.remove("tgico-play");
        this.playButton.classList.add("tgico-close");
    	FileAPI.getFile(this.message.raw.media.document).then(url => {
    		this.audio = new Audio(url);
    		this.audio.addEventListener("timeupdate", this._audioTimeUpdate.bind(this));
        	this.audio.addEventListener("ended", this._playButtonClick.bind(this));
        	this.setLoading(false);
        	this.play()
    	})
    }

    pause() {
        this.playButton.classList.remove("tgico-pause");
        this.playButton.classList.add("tgico-play");
        this.audio.pause();
        this.playing = false;
        AudioManager.update();
    }

    setLoading(val) {
    	this.loading = !!val;
    	this.__patch();
    }

    isLoading() {
    	return this.loading;
    }

    isPlaying() {
        return this.playing;
    }

    getProgress() {
    	return (
    		<div class="progress-wrapper">
	    		<div class="progress-line"/>
	    		<div class="listened-wrapper">
	    			<div class="listened"/>
	    			<div class="control-ball"/>
	    		</div>
    		</div>
    		)
    }

    async getMeta() {
    	let doc = this.message.raw.media.document;
    	return {
    		title: this.meta.title,
    		artist: this.meta.artist,
    		album: "Telegram", //sorry, no data from TG on that
    		artwork: [{
    			src: undefined, //TODO FileAPI method
    			sizes: "192x192",
    			type: "application/jpeg"
    		}]
    	}
    }

    _audioTimeUpdate() {
        this.setPercent(this.audio.currentTime / this.audio.duration);
        this.timer.textContent = this._timeToFormat(this.audio.currentTime)+" / "+this.textDuration;
    }

    _timeToFormat(time) {
    	if(!time) return "0:00";
    	time = Math.floor(time);
	    let hours   = Math.floor(time / 3600)
	    let minutes = Math.floor(time / 60) % 60
	    let seconds = time % 60

	    let formatted= [hours,minutes,seconds]
	        .map(v => v < 10 ? "0" + v : v)
	        .filter((v,i) => v !== "00" || i > 0)
	        .join(":");
	    if(formatted.startsWith("0")) formatted = formatted.substr(1);
	    return formatted;
    }

    _handleEnter(e) {
        this.progressEl.addEventListener("mousemove", this.moveHandler);
    }

    _handleLeave(e) {
        this.progressEl.removeEventListener("mousemove", this.moveHandler);
    }

    _handleMove(e) {
        if (e.buttons === undefined ?
            e.which === 1 :
            e.buttons === 1) {
        	let box = this.progressEl.getBoundingClientRect();
            let percent = (e.pageX - box.x) / box.width;
            this.setPercent(percent);
            this.audio.currentTime = this.duration * percent;
        }
    }

    _playButtonClick(e) {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

}

export default AudioMessageComponent