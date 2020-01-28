import Component from "../../../../../v/vrdom/Component"
import {FileAPI} from "../../../../../../api/fileAPI"
import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent"

import AudioManager from "../../../../../audioManager"
import PeersStore from "../../../../../../api/store/PeersStore"

export default class VoiceMessageComponent extends Component {
    constructor(props) {
        super(props);
        let parse = this._parseMessage(this.props.message);
        this.audioPromise = parse.audio;
        this.heights = this._waveToArray(parse.waveform);
        //maybe try another smooth functions?
        this.heights = this._smooth(this.heights, 0.05);
        //TODO adaptive bars count
        this.heights = this._largestTriangleThreeBuckets(this.heights, 50);

        this.duration = parse.duration || 0;

        this.playing = false;

        this.barWidth = 2;
        this.barMargin = 2;

        this.skipAnim = false;

        this.width = this.heights.length * (this.barWidth + this.barMargin) + this.barMargin * 2;

        this.enterHandler = this._handleEnter.bind(this);
        this.leaveHandler = this._handleLeave.bind(this);
        this.moveHandler = this._handleMove.bind(this);

        let onAudio = this._onAudioReady.bind(this);
        this.audioPromise.then(onAudio);
    }

    _parseMessage(message) {
        let audio;
        let waveform;
        let duration;

        let doc = message.raw.media.document;
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
        this.audioURL=audio;
        this.audio = new Audio(audio);
        this.audio.addEventListener("timeupdate", this._audioTimeUpdate.bind(this));
        this.audio.addEventListener("ended", this._playButtonClick.bind(this));
    }

    setPercent(percent) {
        this._setAttr(this.progress, "width", percent * this.width + "px");
    }

    play() {
        if(!this.audio || this.audio.ended || this.audio.played.length==0) {
            this.skipAnim = true;
            this.progress.setAttribute("style", "transition: all 0s ease 0s !important;");
            this.setPercent(0);
        }
        this.playButton.classList.add("tgico-pause");
        this.playButton.classList.remove("tgico-play");
        this.playing = true;
        this.audio.play();
        AudioManager.set(this);
    }

    pause() {
        this.playing = false;
        this.playButton.classList.remove("tgico-pause");
        this.playButton.classList.add("tgico-play");
        this.audio.pause();
    }

    isPlaying() {
        return this.playing;
    }

    h() {
        return (
            <MessageWrapperFragment message={this.props.message}>
                <div class="audio">
                    <div class="play tgico tgico-play" onMouseDown={this._playButtonClick.bind(this)}/>
                    <div class="audio-wrapper">
                        <svg css-width={`${this.width}px`} css-transform="scale(1,-1)"
                             onMouseEnter={this.enterHandler} onMouseLeave={this.leaveHandler}
                             onMouseDown={this.moveHandler}>
                            <defs>
                                <mask id={`bars-${this.props.message.id}`}>
                                    {this._generateBars()}
                                </mask>
                            </defs>
                            <rect class="back" x="0" y="0" width={this.width + "px"} height="100%"
                                  mask={`url(#bars-${this.props.message.id})`}/>
                            <rect class="progress" x="0" y="0" width={this.width + "px"} height="100%"
                                  mask={`url(#bars-${this.props.message.id})`}/>
                        </svg>
                        <div class="timer">
                            {this._timeToFormat(this.duration)}
                            <span class="read"></span>
                        </div>
                    </div>
                </div>
                <TextWrapperComponent message={this.props.message}/>
            </MessageWrapperFragment>
        );
    }

    getURL() {
        return this.audioURL;
    }

    getMeta() {
        return new Promise(async (resolve, reject) => {
            let message = this.props.message;
            let peer = message.raw.fwd_from ? await PeersStore.get("user", message.raw.fwd_from.from_id) : message.from;
            console.log(message);

            let chatName = message.dialog.peer.type != "user" ? message.dialog.peer.name : "";
            let avatar = await peer.photo.fetchBig();
            resolve ({
                title: peer.name || "Unknown user",
                artist: "Voice message",
                album:  chatName,
                artwork: [{
                    src: avatar,
                    type: "image/png",
                    sizes: "640x640" //hardcoded, todo: get image size
                }]
            })
        })
    }

    _audioTimeUpdate() {
        if (this.skipAnim) {
            this.skipAnim = false;
            this.progress.removeAttribute("style");
        }

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
            if (!this.playing) {
                this.skipAnim = true;
                this.progress.setAttribute("style", "transition: all 0s ease 0s !important;");
            }
            let percent = (e.pageX - this._getVpPos(this.progress).x) / this.width;
            this.setPercent(percent);
            this.audio.currentTime = this.audio.duration * percent;
        }
    }

    _playButtonClick(e) {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
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
                arr.push(parseInt(buf.substr(0, splitSize), 2));
                buf = buf.substr(splitSize);
            }
        }
        return arr;
    }

    _smooth(values, alpha) {
        var weighted = this._average(values) * alpha;
        var smoothed = [];
        for (var i in values) {
            var curr = values[i];
            var prev = smoothed[i - 1] || values[values.length - 1];
            var next = curr || values[0];
            var improved = Number(this._average([weighted, prev, curr, next]).toFixed(2));
            smoothed.push(improved);
        }
        return smoothed;
    }

    _average(data) {
        var sum = data.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        var avg = sum / data.length;
        return avg;
    }

    _largestTriangleThreeBuckets(data, threshold) {
        var data_length = data.length;
        if (threshold >= data_length || threshold === 0) {
            return data;
        }
        var sampled = [],
            sampled_index = 0;

        var every = (data_length - 2) / (threshold - 2);

        var a = 0,
            max_area_point,
            max_area,
            area,
            next_a;

        sampled[sampled_index++] = data[a];

        for (var i = 0; i < threshold - 2; i++) {
            var avg_x = 0,
                avg_y = 0,
                avg_range_start = Math.floor((i + 1) * every) + 1,
                avg_range_end = Math.floor((i + 2) * every) + 1;
            avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

            var avg_range_length = avg_range_end - avg_range_start;

            for (; avg_range_start < avg_range_end; avg_range_start++) {
                avg_x += avg_range_start;
                avg_y += data[avg_range_start] * 1;
            }

            avg_x /= avg_range_length;
            avg_y /= avg_range_length;

            var range_offs = Math.floor((i + 0) * every) + 1,
                range_to = Math.floor((i + 1) * every) + 1;

            var point_a_x = a * 1,
                point_a_y = data[a] * 1;

            max_area = area = -1;

            for (; range_offs < range_to; range_offs++) {
                area = Math.abs((point_a_x - avg_x) * (data[range_offs] - point_a_y) -
                    (point_a_x - range_offs) * (avg_y - point_a_y)
                ) * 0.5;
                if (area > max_area) {
                    max_area = area;
                    max_area_point = data[range_offs];
                    next_a = range_offs;
                }
            }

            sampled[sampled_index++] = max_area_point;
            a = next_a;
        }

        sampled[sampled_index++] = data[data_length - 1];
        return sampled;
    }
}