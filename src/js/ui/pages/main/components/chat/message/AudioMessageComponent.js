import MessageWrapperComponent from "./common/MessageWrapperComponent"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {FileAPI} from "../../../../../../api/fileAPI"

import AudioManager from "../../../../../audioManager"

class AudioMessageComponent extends GeneralMessageComponent {

	init() {
		this.message = this.props.message;

		FileAPI.getFile(this.message.raw.media.document).then(data => {
			this.message.raw.media.document.real= {
				url: data
			}
			this.__patch();
		})
	}

    h() {
        let audioSrc = this.message.raw.media.document.real ? this.message.raw.media.document.real.url : "";
        return (
            <MessageWrapperComponent message={this.message}>
                <audio controls src={audioSrc} type={this.message.raw.media.document.mime_type} onPlay={this.onPlay}/>
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }

    onPlay() {
    	this.audio = this.$el.querySelector("audio");
    	AudioManager.set(this);
    }

    play() {
    	this.audio.play();
    }

    isPlaying() {
    	return this.audio.isPlaying;
    }

    pause() {
    	this.audio.pause();
    }

    getURL() {
    	return this.message.raw.media.document.real? this.message.raw.media.document.real.url : "";
    }
}

export default AudioMessageComponent