import MessageWrapperFragment from "./common/MessageWrapperFragment";
import MessageTimeComponent from "./common/MessageTimeComponent";
import VideoComponent from "./video/VideoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import { VComponent } from "../../../../../v/vrdom/component/VComponent"

class RoundVideoMessageComponent extends GeneralMessageComponent {

	init() {
		super.init();
		this.videoRef = VComponent.createComponentRef();
		this.muted = true;
	}

    h() {
        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                <VideoComponent ref={this.videoRef} message={this.message} controls={false} round loop autodownload autoplay muted={this.muted} click={this._click}/>
                <MessageTimeComponent message={this.message} bg={true}/>
            </MessageWrapperFragment>
        )
    }

    reactive(R) {
        super.reactive(R)

        R.object(this.message)
            .on("videoAppended", this.videoReady)
    }

    videoReady = () => {
    	this.video = this.$el.querySelector("video");
    	this.video.onended = ev => {
    		this.video.volume = 0;
    		this.muted = true;
    	}
    }

    _click = (ev) => {
    	if(!this.muted) {
    		this.muted = true;
    		this.video.volume = 0;
    	} else {
    		this.muted = false;
    		this.video.pause();
			this.video.currentTime = 0;
			this.video.play().then(_ => {
				this.video.volume = 1;
			});
    	}
    }
}

export default RoundVideoMessageComponent