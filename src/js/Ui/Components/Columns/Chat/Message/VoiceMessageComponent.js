import AudioComponent from "./Common/AudioComponent"
import PeersStore from "../../../../../Api/Store/PeersStore"
import {convertBits, formatAudioTime} from "../../../../Utils/utils"

export default class VoiceMessageComponent extends AudioComponent {
    constructor(props) {
        super(props);
        let doc = this.props.message.raw.media.document;
        for (const attr of doc.attributes) {
            if (attr._ == "documentAttributeAudio" && attr.voice) {
                this.waveform = attr.waveform;
            }
        }

        if(!this.waveform) this.waveform = [].fill(0,0,99);

        this.heights = convertBits(this.waveform, 8, 5);
        //maybe try another smooth functions?
        this.heights = this._smooth(this.heights, 0.05);
        //TODO adaptive bars count
        this.heights = this._largestTriangleThreeBuckets(this.heights, 50);

        this.barWidth = 2;
        this.barMargin = 2;

        this.width = this.heights.length * (this.barWidth + this.barMargin) + this.barMargin * 2;
    }

    updatePercent(percent) {
        if (this.__.destroyed) return;
        this._setAttr(this.progress, "width", percent * this.width + "px");
    }

    getMeta() {
        return new Promise(async (resolve, reject) => {
            let message = this.props.message;
            let peer = message.raw.fwd_from ? await PeersStore.get("user", message.raw.fwd_from.from_id) : message.from;

            let chatName = message.dialog.peer.type != "user" ? message.dialog.peer.name : "";
            let avatar = peer.photo.bigUrl || (await peer.photo.fetchBig());
            resolve({
                title: peer.name,
                artist: "Voice message",
                album: chatName,
                artwork: [{
                    src: avatar,
                    type: "image/png",
                    sizes: "640x640" //hardcoded, todo: get image size
                }]
            })
        })
    }

    getControls() {
        return (
            <div class="controls rp rps">
                <svg css-width={`${this.width}px`} css-transform="scaleY(-1)"
                     onMouseEnter={this._handleEnter.bind(this)} onMouseLeave={this._handleLeave.bind(this)}
                     onMouseDown={this._handleMove.bind(this)}>
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
                    <span class="time-played">{formatAudioTime(this.duration)}</span>
                </div>
            </div>
        )
    }

    controlsMounted() {
        this.svgContainer = this.$el.querySelector("svg");
        this.progress = this.svgContainer.querySelector(".progress")

        this.timer = this.$el.querySelector(".time-played");
        this.setTimerElement(this.timer);
        this.setProgressElement(this.progress);

        this.download();
    }

    _handleMove(e) {
        if (!this.audio) return;
        if (e.buttons === undefined ?
            e.which === 1 :
            e.buttons === 1) {
            let box = this.svgContainer.getBoundingClientRect();
            let percent = (e.pageX - box.x) / box.width;
            this.updatePercent(percent);
            this.audio.currentTime = this.audio.duration * percent;
        }
    }

    //own methods

    _generateBars() {
        let x = this.barMargin;
        let width = this.barWidth;
        let elemArr = [];
        for (let i = 0; i < this.heights.length; i++) {
            let value = this.heights[i];
            let rect = this._newBar(x, width, this._heightToPx(value));
            elemArr.push(rect);
            x += width + this.barMargin;
        }
        return elemArr;
    }

    _heightToPx(height) {
        return Math.max(2, height * (25 / 32)) + "px";
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