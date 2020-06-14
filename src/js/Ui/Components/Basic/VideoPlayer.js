/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import VComponent from "../../../V/VRDOM/component/VComponent"
import {formatAudioTime} from "../../Utils/utils"
import {DocumentMessagesTool} from "../../Utils/document"

function onDrag(target: HTMLElement, innerTarget: HTMLElement, dir, listener) {
    const hasPointerEvent = undefined !== target.onpointerup;
    const hasTouchEvent = undefined !== target.ontouchstart;
    const pointerDown = hasPointerEvent ? 'pointerdown' : hasTouchEvent ? 'touchstart' : 'mousedown';
    const pointerMove = hasPointerEvent ? 'pointermove' : hasTouchEvent ? 'touchmove' : 'mousemove';
    const pointerUp = hasPointerEvent ? 'pointerup' : hasTouchEvent ? 'touchend' : 'mouseup';

    // ...
    const dirIsInline = /^(ltr|rtl)$/i.test(dir);
    const dirIsStart = /^(ltr|ttb)$/i.test(dir);

    // ...
    const axisProp = dirIsInline ? 'clientX' : 'clientY';

    let window, start, end;

    // on pointer down
    target.addEventListener(pointerDown, onpointerdown);

    function onpointerdown(event) {
        // window
        window = target.ownerDocument.defaultView;

        // client boundaries
        const rect = innerTarget.getBoundingClientRect();

        // the container start and end coordinates
        start = dirIsInline ? rect.left : rect.top;
        end = dirIsInline ? rect.right : rect.bottom;

        onpointermove(event);

        window.addEventListener(pointerMove, onpointermove);
        window.addEventListener(pointerUp, onpointerup);

        document.body.classList.add("global-grabbing")
    }

    function onpointermove(event) {
        // prevent browser actions on this event
        event.preventDefault();

        // the pointer coordinate
        const position = axisProp in event ? event[axisProp] : event.touches && event.touches[0] && event.touches[0][axisProp] || 0;

        // the percentage of the pointer along the container
        const percentage = (dirIsStart ? position - start : end - position) / (end - start);

        // call the listener with percentage
        listener(percentage);

        document.body.classList.add("global-grabbing")
    }

    function onpointerup() {
        window.removeEventListener(pointerMove, onpointermove);
        window.removeEventListener(pointerUp, onpointerup);

        document.body.classList.remove("global-grabbing")
    }
}

class VideoPlayer extends StatefulComponent {
    videoRef: { $el: HTMLVideoElement } = VComponent.createRef();
    timeWrapperRef = VComponent.createRef();
    timelineRef = VComponent.createRef();

    state = {
        showControls: true,
    }

    render({src, controls, containerWidth, containerHeight, bufferedSize, size, ...otherArgs}, {showControls}, globalState) {
        // https://ak.picdn.net/shutterstock/videos/31008538/preview/stock-footage-parrot-flies-alpha-matte-d-rendering-animation-animals.webm
        const isPaused = this.videoRef.$el?.paused ?? true;
        const time = this.videoRef.$el?.currentTime ?? 0;
        const duration = this.videoRef.$el?.duration ?? 0;
        const buffered = this.videoRef.$el?.buffered;
        let bufferedEnd

        try {
            bufferedEnd = buffered?.end(0);
        } catch (e) {
            bufferedEnd = 0;
        }

        const progress = bufferedEnd / duration * 100;

        return (
            <div css-width={containerWidth}
                 css-height={containerHeight}
                 className="VideoPlayer"
                 onMouseMove={this.onMouseMove}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
                <div className="player">
                    <video ref={this.videoRef}
                           src={src}
                           {...otherArgs}
                           onPlay={this.onPlay}
                           onPaste={this.onPause}
                           onTimeUpdate={this.onTimeUpdate}
                           onDurationChange={this.onDurationChange}
                           onProgress={this.onProgress}
                           onClick={this.onClickPause}
                    />

                    <div className={{
                        "controls": true,
                        "hidden": !showControls
                    }}>
                        {/*<div className="frame">*/}
                        {/*    <img*/}
                        {/*        src="https://12kanal.com/wp-content/uploads/2019/10/k-chemu-snitsya-popugay-zhenschine-ili-muzhchine-2.jpg"*/}
                        {/*        alt="Frame"/>*/}
                        {/*</div>*/}
                        <div className="progress" ref={this.timeWrapperRef}>
                            <div className="line"/>
                            <div className="time-wrapper" ref={this.timelineRef}>
                                <div className="time" style={{
                                    width: `${time / duration * 100}%`
                                }}/>
                                <div className="dot"/>
                            </div>
                            <div className="buffer" style={{
                                width: `${progress}%`
                            }}/>
                        </div>
                        <div className="buttons">
                            <div className="button pause">
                                <i className={`tgico tgico-${isPaused ? "play" : "pause"}`}
                                   onClick={this.onClickPause}/>
                            </div>
                            <div className="time">
                                {formatAudioTime(time)} / {formatAudioTime(duration)}
                            </div>
                            {size && bufferedSize && <div className="bytes">
                                {DocumentMessagesTool.formatSize(bufferedSize)}/{DocumentMessagesTool.formatSize(size)}
                            </div>}
                            <div className="button full">
                                <i className="tgico tgico-full_screen" onClick={this.onClickFull}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        onDrag(this.timeWrapperRef.$el, this.timelineRef.$el, "ltr", (percentage) => {
            this.videoRef.$el.currentTime = this.videoRef.$el.duration * Math.max(0, Math.min(1, percentage));
        });

        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onPlay = () => {
        this.forceUpdate();
    }

    onPause = () => {
        this.forceUpdate();
    }

    onTimeUpdate = () => {
        this.forceUpdate();
    }

    onDurationChange = () => {
        this.forceUpdate();
    }

    onProgress = () => {
        this.forceUpdate();
    }

    onClickPause = () => {
        const $video = this.videoRef.$el;

        if ($video.paused) {
            $video.play();
        } else {
            $video.pause();
        }
    }

    onClickFull = () => {
        const $video = this.videoRef.$el;

        if ($video.requestFullscreen) {
            $video.requestFullscreen();
        } else if ($video.mozRequestFullScreen) { /* Firefox */
            $video.mozRequestFullScreen();
        } else if ($video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            $video.webkitRequestFullscreen();
        } else if ($video.msRequestFullscreen) { /* IE/Edge */
            $video.msRequestFullscreen();
        }
    }

    onKeyDown = event => {
        const code = event.keyCode || event.which;

        if (code === 39) {
            event.stopPropagation();
            this.videoRef.$el.currentTime += 5;
        } else if (code === 37) {
            event.stopPropagation();
            this.videoRef.$el.currentTime -= 5;
        } else if (code === 32) {
            event.stopPropagation();
            this.onClickPause();
        }
    }

    onMouseOver = (event: MouseEvent) => {
        this.setState({
            showControls: true,
        });
        this.hideControls();
    }

    onMouseMove = (event: MouseEvent) => {
        this.setState({
            showControls: true,
            x: event.x,
            y: event.y,
        });

        this.hideControls();
    }

    onMouseLeave = (event: MouseEvent) => {
        this.hideControls();
    }

    hideControls = this.debounce(() => {
        this.setState({
            showControls: false,
        });
    }, 4000);
}

export default VideoPlayer;