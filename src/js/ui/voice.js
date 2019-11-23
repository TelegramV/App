export default class Voice {
    constructor(audio, waveform, options = {}) {
        this.element = document.createElement("div");
        this.audio = audio;
        this.heights = this._waveToArray(waveform);

        this.playing = false;

        this.barWidth = 2;
        this.barMargin = 2;

        this.width = this.heights.length * (this.barWidth + this.barMargin) + this.barMargin * 2;

        this._initContainer();

        this._generateBars();

        this.enterHandler = this._handleEnter.bind(this);
        this.svgContainer.addEventListener("mouseenter", this.enterHandler);

        this.leaveHandler = this._handleLeave.bind(this);
        this.svgContainer.addEventListener("mouseleave", this.leaveHandler);

        this.moveHandler = this._handleMove.bind(this);
        this.svgContainer.addEventListener("mousedown", this.moveHandler);

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
        return (<div class="audio">
            <div class="play"/>
            <div class="audio-wrapper">
                <svg css-width={`${this.width}px`} css-transform="scale(1,-1)">
                    <defs>
                        <mask id="bars">
                            {this._generateBars()}
                        </mask>
                    </defs>
                    <rect x="0" y="0" width={this.width + "px"} height="100%" fill="grey" mask="url(#bars)"/>
                    <rect x="0" y="0" width={this.width + "px"} height="100%" fill="green" mask="url(#bars)"/>
                </svg>
                <div class="timer">
                    {this._timeToFormat(this.audio.duration)}
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

    _playButtonClick() {
        this.playButton.removeChild(this.playButton.firstElementChild);
        let text = document.createElement("span");
        if (this.playing) {
            this.pause();
            text.textContent = "Play";
        } else {
            this.play();
            text.textContent = "Pause";
        }
        this.playButton.appendChild(text);
    }

    _initContainer() {
        this.playButton = document.createElement("div");
        this.playButton.classList.add("play");
        let text = document.createElement("span");
        text.textContent = "Play";
        this.playButton.appendChild(text);
        this.element.appendChild(this.playButton);
        this.playButton.addEventListener("mousedown", this._playButtonClick.bind(this));

        let wrapper = document.createElement("div");
        wrapper.classList.add("voice-wrapper");
        this.element.appendChild(wrapper);

        this.svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svgContainer.style.width = this.width + "px";
        this.svgContainer.style.transform = "scale(1,-1)";
        wrapper.appendChild(this.svgContainer);

        this.timer = document.createElement("div");
        this.timer.textContent = "0:00";
        wrapper.appendChild(this.timer);

        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        this.svgContainer.appendChild(defs);
        this.mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
        this.mask.setAttributeNS(null, "id", "bars");
        defs.appendChild(this.mask);

        let back = this._newRect(0, 0, this.width + "px", "100%");
        this._setAttr(back, "fill", "grey");
        this._setAttr(back, "mask", "url(#bars)")
        this.svgContainer.appendChild(back);

        this.progress = this._newRect(0, 0, this.width + "px", "100%");
        this._setAttr(this.progress, "fill", "green");
        this._setAttr(this.progress, "mask", "url(#bars)")
        this.svgContainer.appendChild(this.progress);
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

    _heightToPercent(height) {
        return Math.min(((2 + height) / 33) * 100, 100) + "%";
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
