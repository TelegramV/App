import Component from "../../../../../framework/vrdom/component"
import { FileAPI } from "../../../../../../api/fileAPI"
import MessageWrapperComponent from "./messageWrapperComponent"
import TextWrapperComponent from "./textWrapperComponent"

export default class VoiceMessageComponent extends Component {
    constructor(props) {
        super(props);
        let parse = this._parseMessage(this.props.message);
        this.audioPromise = parse.audio;
        this.heights = this._waveToArray(parse.waveform);
        this.duration = parse.duration || 0;

        this.playing = false;

        this.barWidth = 2;
        this.barMargin = 2;

        this.width = this.heights.length * (this.barWidth + this.barMargin) + this.barMargin * 2;

        this.enterHandler = this._handleEnter.bind(this);
        this.leaveHandler = this._handleLeave.bind(this);
        this.moveHandler = this._handleMove.bind(this);

        let onAudio = this._onAudioReady.bind(this);
        this.audioPromise.then(onAudio);
    }

    _parseMessage(message) {
    	console.log(message)
        let audio;
        let waveform;
        let duration;

        let doc = message.media.document;
        for (const attr of doc.attributes) {
            if (attr._ == "documentAttributeAudio" && attr.pFlags.voice) {
                waveform = attr.waveform;
                duration = attr.duration;
            }
        }
        audio = FileAPI.getFile(doc);
        return {
            audio: audio,
            waveform: waveform,
            duration: duration
        }
    }

    _onAudioReady(audio) {
        this.audio = new Audio(audio);
        this.audio.addEventListener("timeupdate", this._audioTimeUpdate.bind(this));
        this.audio.addEventListener("ended", this._playButtonClick.bind(this));
    }

    setPercent(percent) {
        this._setAttr(this.progress, "width", percent * this.width + "px");
    }

    play() {
        this.playing = true;
        this.audio.play();
    }

    pause() {
        this.playing = false;
        this.audio.pause();
    }

    h() {
        return (
            <MessageWrapperComponent message={this.props.message}>
        	<div class="message">
	        	<div class="audio">
		            <div class="play tgico tgico-play" onMouseDown={this._playButtonClick.bind(this)}/>
		            <div class="audio-wrapper">
		                <svg css-width={`${this.width}px`} css-transform="scale(1,-1)" 
		                onMouseEnter={this.enterHandler} onMouseLeave={this.leaveHandler} onMouseDown={this.moveHandler}>
		                    <defs>
		                        <mask id={`bars-${this.props.message.id}`}>
		                            {this._generateBars()}
		                        </mask>
		                    </defs>
		                    <rect class="back" x="0" y="0" width={this.width + "px"} height="100%" mask={`url(#bars-${this.props.message.id})`}/>
		                    <rect class="progress" x="0" y="0" width={this.width + "px"} height="100%" mask={`url(#bars-${this.props.message.id})`}/>
		                </svg>
		                <div class="timer">
		                    {this._timeToFormat(this.duration)}
		                    <span class="read"></span>
		                </div>
		            </div>
	            </div>
	            <TextWrapperComponent message={this.props.message}/>
        	</div>
        	</MessageWrapperComponent>
        );
    }

    _audioTimeUpdate() {
        this.setPercent(this.audio.currentTime / this.audio.duration);
        this.timer.textContent = this._timeToFormat(this.audio.currentTime);
    }

    _timeToFormat(time) {
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        let minutes = Math.floor((time - seconds) / 60);

        return minutes + ":" + seconds;
    }

    _handleEnter(e) {
        this.svgContainer.addEventListener("mousemove", this.moveHandler);
    }

    _handleLeave(e) {
        this.svgContainer.removeEventListener("mousemove", this.moveHandler);
    }

    _handleMove(e) {
        if (e.buttons === undefined ?
            e.which === 1 :
            e.buttons === 1) {
            let percent = (e.pageX - this._getVpPos(this.progress).x) / this.width;
            this.setPercent(percent);
            this.audio.currentTime = this.audio.duration * percent;
        }
    }

    _playButtonClick(e) {
        if (this.playing) {
            this.pause();
            this.playButton.classList.remove("tgico-pause");
            this.playButton.classList.add("tgico-play");
        } else {
            this.play();
            this.playButton.classList.add("tgico-pause");
            this.playButton.classList.remove("tgico-play");
        }
    }

    mounted() {
        this.timer = this.$el.querySelector(".timer");
        this.progress = this.$el.querySelector(".progress");
        this.svgContainer = this.$el.querySelector("svg");
        this.playButton = this.$el.querySelector(".play");
    }

    _generateBars() {
        let x = this.barMargin;
        let width = this.barWidth;
        let elemArr = [];
        for (let i = 0; i < this.heights.length; i++) {
            let value = this.heights[i];
            let rect = this._newBar(x, width, this._heightToPercent(value));
            elemArr.push(rect);
            x += width + this.barMargin;
        }
        return elemArr;
    }

    _heightToPercent(height) {
        return Math.min(((2 + height) / 33) * 100, 100) + "%";
    }

    _setAttr(elem, attr, value) {
        return elem.setAttributeNS(null, attr, value);
    }

    _newBar(x, width, height) {
        return <rect x={x + "px"}
                     rx={this.barWidth + "px"}
                     ry={this.barWidth + "px"}
                     width={width + "px"}
                     height={height} fill="white"/>
    }

    _newRect(x, y, width, height) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this._setAttr(rect, "x", x);
        this._setAttr(rect, "y", y);
        this._setAttr(rect, "width", width);
        this._setAttr(rect, "height", height);
        return rect;
    }

    _getVpPos(el) {
        if (el.parentNode.nodeName === 'svg') {
            return el.parentNode.getBoundingClientRect();
        }
        return getVpPos(el.parentNode);
    }

    _waveToArray(waveform) {
        let buf = "";
        let arr = [];
        let splitSize = 5;
        for (var i of waveform) {
            var n = (i >>> 0).toString(2).substr(-8);
            n = "00000000".substr(n.length) + n;
            buf += n;
            while (buf.length >= splitSize) {
                arr.push(parseInt(buf.substr(0,splitSize), 2));
                buf = buf.substr(splitSize);
            }
        }
        return arr;
    }
}