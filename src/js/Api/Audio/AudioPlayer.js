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

import AppEvents from "../EventBus/AppEvents"
import FileManager from "../Files/FileManager"
import DocumentParser from "../Files/DocumentParser"

class AudioPlayer {
    audio: HTMLAudioElement;
    mediaSource: MediaSource;

    state = {
        document: null,
        /**
         * @var {SourceBuffer}
         */
        sourceBuffer: null,
        bufferedPercentage: 0,
        bufferedSize: 0,
        queue: [],
    };

    defaultState = {...this.state};

    constructor() {
        this.mediaSource = new MediaSource();
        this.audio = new Audio(URL.createObjectURL(this.mediaSource));

        this.audio.addEventListener("timeupdate", this.internal_fireTimeUpdate);
        this.audio.addEventListener("play", this.internal_firePlay);
        this.audio.addEventListener("playing", this.internal_firePlay);
        this.audio.addEventListener("pause", this.internal_firePaused);
        this.audio.addEventListener("progress", this.internal_fireBuffered);
        this.audio.addEventListener("ended", this.internal_fireEnded);

        AppEvents.Files.subscribe("download.start", event => {
            if (this.isCurrent(event.file)) {
                // if (this.mediaSource.sourceBuffers[0]) {
                //     this.mediaSource.removeSourceBuffer(this.mediaSource.sourceBuffers[0]);
                // }

                // this.state.sourceBuffer = this.mediaSource.addSourceBuffer(event.file.mime_type);

                this.internal_fireLoading();
            }
        });

        AppEvents.Files.subscribe("download.newPart", event => {
            // if (this.isCurrent(event.file)) {
            //     if (!this.state.bufferedPercentage) {
            //         this.audio.play()
            //     }
            //
            //     this.state.bufferedPercentage = event.percentage;
            //
            //     if (!this.state.sourceBuffer.updating) {
            //         this.state.sourceBuffer.appendBuffer(event.newBytes);
            //     } else {
            //         this.state.queue.push(event.newBytes)
            //     }
            //
            //     this.state.bufferedSize += event.newBytes.length;
            // }
        });

        AppEvents.Files.subscribe("download.done", event => {
            if (this.isCurrent(event.file)) {
                this.state.bufferedPercentage = 100;

                // if (this.state.sourceBuffer) {
                //     event.blob.arrayBuffer().then(buff => {
                //         const lastPart = buff.slice(this.state.bufferedSize);
                //
                //         if (!this.state.sourceBuffer.updating) {
                //             this.state.sourceBuffer.appendBuffer(lastPart);
                //         } else {
                //             this.state.queue.push(lastPart)
                //         }
                //     });
                // } else {
                this.audio.src = event.url;

                this.audio.play()
                // }
            }
        });

        AppEvents.Files.subscribe("download.canceled", event => {

        });
    }

    isCurrent(document) {
        return this.state.document && document && this.state.document.id === document.id;
    }

    isPaused() {
        return this.audio.paused;
    }

    isEnded() {
        return this.audio.ended || this.audio.currentTime >= this.audioInfo()?.duration;
    }

    isLoading(document = null) {
        return document ? document.id === this.state.document?.id && this.state.status === "loading" : this.state.status === "loading";
    }

    currentTime() {
        return this.audio.currentTime;
    }

    bufferedPercentage() {
        return this.state.bufferedPercentage;
    }

    audioInfo() {
        return DocumentParser.attributeAudio(this.state.document)
    }

    play(document = this.state.document) {
        if (this.isCurrent(document)) {
            if (this.isLoading()) {
                FileManager.cancel(document);
            } else if (this.isPaused()) {
                this.audio.play()
            }
        } else {
            this.state.document = document;

            if (FileManager.isDownloaded(document)) {
                this.pause();
                this.audio.src = FileManager.getUrl(document);
                this.audio.play();
            } else {
                this.internal_fireLoading();
                this.pause();
                this.audio.src = null;

                FileManager.downloadDocument(document);
            }
        }
    }

    toggle(document = this.state.document) {
        if (!this.isCurrent(document) || this.isPaused()) {
            this.play(document);
        } else {
            if (this.isEnded()) {
                this.audio.currentTime = 0;
            } else {
                this.pause();
            }
        }
    }

    pause() {
        this.audio.pause();
    }

    updateTime(time: number) {
        this.audio.currentTime = time;
    }

    internal_fireLoading = () => {
        AppEvents.General.fire("audio.loading", {
            state: this.state,
        });
    }

    internal_fireEnded = () => {
        AppEvents.General.fire("audio.ended", {
            state: this.state,
        });
    }

    internal_firePlay = () => {
        AppEvents.General.fire("audio.play", {
            state: this.state,
        });
    }

    internal_firePaused = () => {
        AppEvents.General.fire("audio.paused", {
            state: this.state,
        });
    }

    internal_fireBuffered = () => {
        AppEvents.General.fire("audio.buffered", {
            state: this.state,
        });
    }

    internal_fireTimeUpdate = () => {
        AppEvents.General.fire("audio.timeUpdate", {
            state: this.state,
        });
    }
}

const player = new AudioPlayer();

export default player;