export default class Voice {
    constructor(audio, waveform, options = {id: Math.random(), mainColor: "green", secondaryColor: "grey"}) {
        this.element = document.createElement("div");
        this.audio = audio;
        this.options = options;
        this.heights = this._waveToArray(waveform);

        this.playing = false;
        this.bind = false;

        this.barWidth = 2;
        this.barMargin = 2;

        this.width = this.heights.length * (this.barWidth + this.barMargin) + this.barMargin * 2;

        this.enterHandler = this._handleEnter.bind(this);
        this.leaveHandler = this._handleLeave.bind(this);
        this.moveHandler = this._handleMove.bind(this);

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

    setAudio(audio) {
        this.audio = audio;
    }

    getElement() {
        return this.element;
    }

    asJSX() {
        return (<div class="audio" id={"audio-"+this.options.id}>
            <div class="play tgico tgico-play" onMouseDown={this._playButtonClick.bind(this)}/>
            <div class="audio-wrapper">
                <svg css-width={`${this.width}px`} css-transform="scale(1,-1)" onMouseEnter={this.enterHandler} onMouseLeave={this.leaveHandler} onMouseDown={this.moveHandler}>
                    <defs>
                        <mask id="bars">
                            {this._generateBars()}
                        </mask>
                    </defs>
                    <rect x="0" y="0" width={this.width + "px"} height="100%" fill={this.options.secondaryColor} mask="url(#bars)"/>
                    <rect class="progress" x="0" y="0" width={this.width + "px"} height="100%" fill={this.options.mainColor} mask="url(#bars)"/>
                </svg>
                <div class="timer">
                    {this.options.duration ? this.options.duration : this._timeToFormat(this.audio.duration)}
                    <span class="read"></span>
                </div>
            </div>
        </div>);
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
    	if(!this.bind) this._boundElement(document.getElementById("audio-"+this.options.id));
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
    	if(!this.bind) this._boundElement(document.getElementById("audio-"+this.options.id));

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

    _boundElement(elem) { //Давид зроби івент
    	this.timer = elem.querySelector(".timer");
    	this.progress = elem.querySelector(".progress");
    	this.svgContainer = elem.querySelector("svg");
    	this.playButton = elem.querySelector(".play");

    	this.bind = true;
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

    _waveToArray(form) {
        var buf = "";
        var arr = [];
        for (var i in form) {
            var n = form[i].toString(2);
            n = "00000000".substr(n.length) + n;
            buf += n;
            while (buf.length > 5) {
                arr.push(parseInt(buf.substr(0, 5), 2));
                buf = buf.substr(5);
            }
        }
        return arr;
    }
}