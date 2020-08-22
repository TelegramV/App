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
import VSpinner from "../../Elements/VSpinner"
import UIEvents from "../../EventBus/UIEvents"

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
    previewVideoRef: { $el: HTMLVideoElement } = VComponent.createRef();
    timeWrapperRef = VComponent.createRef();
    timelineRef = VComponent.createRef();

    playPromise = Promise.resolve(); // avoid DOMException: The play() request was interrupted by a call to pause().

    state = {
        showControls: true,
        showPreview: false,
        previewPosition: 0,
    }

    render({src, previewSrc, controls, containerWidth, containerHeight, bufferedSize, isDownloaded, isStreamable, size, thumbUrl, ...otherArgs}, {showControls, previewPosition, showPreview}, globalState) {
        // https://ak.picdn.net/shutterstock/videos/31008538/preview/stock-footage-parrot-flies-alpha-matte-d-rendering-animation-animals.webm
        const isPaused = this.videoRef.$el?.paused ?? true;
        const time = this.videoRef.$el?.currentTime ?? 0;
        const duration = this.videoRef.$el?.duration ?? 0;
        const buffered = this.videoRef.$el?.buffered;
        const seeking = this.videoRef.$el?.seeking;
        let bufferedEnd

        try {
            bufferedEnd = buffered?.end(0);
        } catch (e) {
            bufferedEnd = 0;
        }

        let progress = bufferedEnd / duration * 100;

        if (this.videoRef.$el?.src !== src) {
            progress = 0;
        }

        let styleSize = {
            "width": containerWidth,
            "height": containerHeight,
        }

        if (typeof containerWidth === "number" && typeof containerHeight === "number") {
            if (containerWidth > containerHeight) {
                styleSize = {
                    "width": `${containerWidth}px`,
                    "max-height": `${containerHeight}px`,
                }
            } else {
                if (containerHeight > 800) {
                    styleSize = {
                        "width": `${containerWidth}px`,
                        "max-height": `800px`,
                    }
                } else {
                    styleSize = {
                        "width": `${containerWidth}px`,
                        "max-height": `${containerHeight}px`,
                    }
                }
            }
        }

        const isBuffering = this.videoRef.$el?.readyState < this.videoRef.$el?.HAVE_FUTURE_DATA;
        const hideThumb = progress || (src && !isStreamable);
        const hideLoading = hideThumb && !seeking && !isBuffering;

        return (
            <div style={styleSize}
                 className="VideoPlayer"
                 onMouseMove={this.onMouseMove}
                 onMouseOver={this.onMouseOver}
                 onMouseLeave={this.onMouseLeave}>
                <div className="player">
                    <img style={{
                        "display": hideThumb && "none",
                    }} className="thumbnail-img" src={thumbUrl} alt="Preview"/>

                    <div style={{
                        "display": hideLoading && "none",
                    }} className="video-button">
                        <div className="loading">
                            <VSpinner white big background/>
                        </div>
                    </div>

                    <video css-display={!progress && "none"}
                           ref={this.videoRef}
                           src={src}
                           {...otherArgs}
                           onPlay={this.onPlay}
                           onPause={this.onPause}
                           onDurationChange={this.onDurationChange}
                           onProgress={this.onProgress}
                           onClick={this.onClickPause}
                           onTimeUpdate={this.onTimeUpdate}
                           onEnterPictureInPicture={this.onEnterPictureInPicture}
                           onLeavePictureInPicture={this.onLeavePictureInPicture}
                           onSeeking={this.onSeeking}
                           playsinline={otherArgs.playsinline}
                           $recreate={this.videoRef.$el?.src !== src /* THIS IS VERY BAD КОСТИЛЬ, but now idk how to do it better, NEVER REPEAT THIS!!!!*/}
                    />

                    <div className={{
                        "controls": true,
                        "hidden": !buffered || !controls || !showControls
                    }}>
                        <div style={{
                            "margin-left": `calc(${previewPosition}% - calc(170px / 2))`,
                            "display": !showPreview && "none",
                        }} className="frame">
                            {/*<img*/}
                            {/*    src="https://12kanal.com/wp-content/uploads/2019/10/k-chemu-snitsya-popugay-zhenschine-ili-muzhchine-2.jpg"*/}
                            {/*    alt="Frame"/>*/}
                            <video ref={this.previewVideoRef}
                                   src={previewSrc}
                                   $recreate={this.videoRef.$el?.src !== src}/>
                        </div>
                        <div className="progress"
                             ref={this.timeWrapperRef}
                             onMouseOver={this.onPreviewMouseOver}
                             onMouseMove={this.onPreviewMouseMove}
                             onMouseLeave={this.onPreviewMouseLeave}>
                            <div className="line"/>
                            <div className="time-wrapper"
                                 ref={this.timelineRef}>
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
                            {size && !isDownloaded &&/*bufferedSize != null &&*/ <div className="bytes">
                                {DocumentMessagesTool.formatSize(bufferedSize || 0)}/{DocumentMessagesTool.formatSize(size)}
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
        // console.log("did mount", this.$el)
        onDrag(this.timeWrapperRef.$el, this.timelineRef.$el, "ltr", (percentage) => {
            this.videoRef.$el.currentTime = this.videoRef.$el.duration * Math.max(0, Math.min(1, percentage));
        });

        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        // console.warn("will unmount")

        window.removeEventListener("keydown", this.onKeyDown);
    }

    componentWillUpdate(nextProps, nextState) {
        // console.warn("will update")

        if (nextProps.src !== this.props.src) {
            if (nextProps.src) {
                nextState.shouldRecreate = true;
            }
        }
    }

    componentDidUpdate() {
        // console.warn("did unmount")

        if (this.state.shouldRecreate) {
            this.state.shouldRecreate = false;

            if (this.videoRef.$el) {
                this.videoRef.$el.currentTime = 0;
            }
        }
    }

    onPlay = () => {
        this.forceUpdate();

        this.toggleControls();
    }

    onPause = () => {
        this.forceUpdate();

        this.toggleControls();
    }

    onTimeUpdate = (event) => {
        this.forceUpdate();
    }

    onPreviewMouseOver = (event: MouseEvent) => {
        this.onMouseMove(event);
    }

    onPreviewMouseLeave = (event: MouseEvent) => {
        this.setState({
            showPreview: false,
        });
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
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.playPromise = this.videoRef.$el.play();
    }

    pause() {
        this.playPromise.then(() => {
            this.videoRef.$el.pause();
        })
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

            this.toggleControls();
        } else if (code === 37) {
            event.stopPropagation();
            this.videoRef.$el.currentTime -= 5;

            this.toggleControls();
        } else if (code === 32) {
            event.stopPropagation();
            this.onClickPause();
        }
    }

    onMouseOver = (event: MouseEvent) => {
        this.toggleControls();
    }

    onMouseMove = (event: MouseEvent) => {
        this.toggleControls();
    }

    onMouseLeave = (event: MouseEvent) => {
        this.hideControls();
    }

    onSeeking = (event: Event) => {
    }

    toggleControls = () => {
        this.setState({
            showControls: true,
        });

        this.hideControls();
    }

    hideControls = this.debounce(() => {
        this.setState({
            showControls: false,
            showPreview: false
        });
    }, 4000);

    onEnterPictureInPicture = (event) => {
        console.log(event)
        // cool feature, but no time to implement
        UIEvents.General.fire("pip.show", {$el: this.$el});
    }

    onLeavePictureInPicture = (event) => {
        console.log(event)
    }
}

export default VideoPlayer;