import {convertBits} from "../../../../Utils/utils"
import {formatTime} from "../../../../../Utils/date"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import DocumentParser from "../../../../../Api/Files/DocumentParser"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import AudioPlayer from "../../../../../Api/Media/AudioPlayer"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import FileManager from "../../../../../Api/Files/FileManager"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

function largestTriangleThreeBuckets(data, threshold) {
    const data_length = data.length
    if (threshold >= data_length || threshold === 0) {
        return data;
    }
    let sampled = [],
        sampled_index = 0

    const every = (data_length - 2) / (threshold - 2)

    let a = 0,
        max_area_point,
        max_area,
        area,
        next_a

    sampled[sampled_index++] = data[a];

    for (let i = 0; i < threshold - 2; i++) {
        let avg_x = 0,
            avg_y = 0,
            avg_range_start = Math.floor((i + 1) * every) + 1,
            avg_range_end = Math.floor((i + 2) * every) + 1
        avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

        const avg_range_length = avg_range_end - avg_range_start

        for (; avg_range_start < avg_range_end; avg_range_start++) {
            avg_x += avg_range_start;
            avg_y += data[avg_range_start] * 1;
        }

        avg_x /= avg_range_length;
        avg_y /= avg_range_length;

        let range_offs = Math.floor((i + 0) * every) + 1,
            range_to = Math.floor((i + 1) * every) + 1

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

function average(data) {
    const sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum / data.length;
}

function smooth(values, alpha) {
    const weighted = average(values) * alpha
    const smoothed = []
    for (const i in values) {
        const curr = values[i]
        const prev = smoothed[i - 1] || values[values.length - 1]
        const next = curr || values[0]
        const improved = Number(average([weighted, prev, curr, next]).toFixed(2))
        smoothed.push(improved);
    }
    return smoothed;
}

function heightToPx(height) {
    return Math.max(2, height * (25 / 32)) + "px";
}

class NewVoiceMessageComponent extends GeneralMessageComponent {
    svgRef = VComponent.createRef();
    controlsRef = VComponent.createRef();

    bars = []
    barsWidth = 0
    barsCount = 0
    recalculatingWidth = false

    appEvents(E) {
        super.appEvents(E)

        E.bus(AppEvents.Audio)
            .filter(event => event.state.message === this.props.message || this.isPlaying)
            .updateOn("audio.play")
            .updateOn("audio.play")
            .updateOn("audio.paused")
            .updateOn("audio.loading")
            .updateOn("audio.buffered")
            .updateOn("audio.timeUpdate")
            .updateOn("audio.ended")
    }

    render({message}) {
        const isPlaying = AudioPlayer.isCurrent(message);
        const {isPaused, currentTime, duration} = AudioPlayer.state;
        this.isPlaying = isPlaying;

        

        return (
            <MessageWrapperFragment message={message} showUsername={false}>
                <div class="audio">
                    <div class={`play tgico tgico-${isPlaying && !isPaused ? 'pause' : 'play'} rp rps rp-white`}
                         onClick={this.onClickPlay}
                         onDoubleClick={event => event.stopPropagation()}/>
                    <progress className={{
                        "progress-circular": true,
                        "visible": FileManager.isPending(message.media.document)
                    }}/>
                    <div class="audio-wrapper">
                        <div className="controls">
                            <div className="controls rp rps" style={{cursor: "pointer"}} ref={this.controlsRef}>
                                <svg css-width={`${this.barsWidth}px`}
                                     css-transform="scaleY(-1)"
                                     onMouseEnter={this.onMouseEnter}
                                     onMouseLeave={this.onMouseLeave}
                                     onMouseDown={this.onMouseDown}>

                                    <defs>
                                        <mask id={`bars-${message.id}`}>
                                            {this.bars}
                                        </mask>
                                    </defs>
                                    <rect className="back"
                                          x="0"
                                          y="0"
                                          width={`${this.barsWidth}px`}
                                          height="100%"
                                          mask={`url(#bars-${message.id})`}/>
                                    <rect className="progress"
                                          x="0"
                                          y="0"
                                          width={`${(currentTime || 0) / (duration || 1) * 100}%`}
                                          height="100%"
                                          mask={`url(#bars-${message.id})`}/>
                                </svg>
                                <div className="timer">
                                    <span className="time-played">{isPlaying && `${formatTime(currentTime)}/`}{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TextWrapperComponent message={message}/>
            </MessageWrapperFragment>
        );
    }

    componentDidMount() {
        this.generateBars(this.calculateBarsCount());
        this.forceUpdate();
    }

    componentDidUpdate() {
        const currentCount = this.barsCount;
        const newCount = this.calculateBarsCount();
        if(newCount !== currentCount) {
            this.generateBars(newCount);
            this.forceUpdate();
        } else {
            if(this.recalculatingWidth) { // recalculation happens higher
                this.recalculatingWidth = false;
                return;
            }
            this.recalculatingWidth = true //try to shunk
            if(this.prevBarsCount !== 1){
                this.generateBars(1); 
                this.forceUpdate();
            }
        }
    }

    calculateBarsCount = () => {
        const el = this.controlsRef.$el;
        if(!el) return 50;
        let width = el.getBoundingClientRect().width;
        return Math.floor((width-4)/4);
    }

    generateBars = (barsCount = 50) => {
        let waveform = DocumentParser.attributeAudio(this.props.message.media.document).waveform;

        if (!waveform) {
            waveform = new Array(100).fill(0);
        }

        let heights = convertBits(waveform, 8, 5);
        heights = smooth(heights, 0.05);
        heights = largestTriangleThreeBuckets(heights, barsCount);

        const width = heights.length * 4 + 4;

        const bars = [];
        for (let i = 0, x = 2; i < heights.length; i++, x += 4) {
            bars.push(
                <rect x={`${x}px`}
                      rx={`2px`}
                      ry={`2px`}
                      width={`2px`}
                      height={heightToPx(heights[i])}
                      fill="white"/>
            );
        }
        this.bars = bars;
        this.barsWidth = width;
        this.barsCount = barsCount;
    }

    onClickPlay = () => {
        AudioPlayer.toggle(this.props.message)
    }

    onMouseEnter = event => {
        if (!AudioPlayer.isCurrent(this.props.message.media.document)) {
            return;
        }

        event.target.addEventListener("mousemove", this.onMouseDown);
    }

    onMouseLeave = event => {
        if (!AudioPlayer.isCurrent(this.props.message.media.document)) {
            return;
        }

        event.target.removeEventListener("mousemove", this.onMouseDown);
    }

    onMouseDown = (event: MouseEvent) => {
        if (!AudioPlayer.isCurrent(this.props.message.media.document)) {
            return;
        }

        if (event.buttons === 1) {
            const box = event.target.getBoundingClientRect();
            const percent = (event.pageX - box.x) / box.width;
            AudioPlayer.updateTime((DocumentParser.attributeAudio(this.props.message.media.document).duration || AudioPlayer.state.duration) * percent)
        }
    }
}

export default NewVoiceMessageComponent