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
    sources: Map<string, {
        mediaSource: MediaSource;
        bufferQueue: Uint8Array[];
        bufferedSize: number;
        bufferedPercentage: number;
        url: string;
    }>;

    state = {
        document: null,
        bufferedPercentage: 0,
    };

    defaultState = {...this.state};

    constructor() {
        this.audio = new Audio();
        this.sources = new Map();

        this.audio.addEventListener("timeupdate", this.internal_fireTimeUpdate);
        this.audio.addEventListener("play", this.internal_firePlay);
        this.audio.addEventListener("playing", this.internal_firePlay);
        this.audio.addEventListener("pause", this.internal_firePaused);
        this.audio.addEventListener("progress", this.internal_fireBuffered);
        this.audio.addEventListener("ended", this.internal_fireEnded);

        AppEvents.Files.subscribe("download.start", event => {
            if (this.isCurrent(event.file)) {
                let source = this.sources.get(event.file.id);
                if (!source) {
                    source = {
                        mediaSource: new MediaSource(),
                        bufferQueue: [],
                        bufferedSize: 0,
                        bufferedPercentage: 0,
                    };
                    source.url = URL.createObjectURL(source.mediaSource);

                    this.sources.set(event.file.id, source);
                }

                const {mediaSource, bufferQueue, url} = source;

                this.audio.src = url;

                if (mediaSource.readyState !== "open") {
                    mediaSource.onsourceopen = () => {
                        const sourceBuffer = mediaSource.addSourceBuffer(event.file.mime_type);
                        mediaSource.duration = DocumentParser.attributeAudio(event.file).duration;

                        sourceBuffer.addEventListener("updateend", () => {
                            if (bufferQueue.length) {
                                sourceBuffer.appendBuffer(bufferQueue.shift());
                            }
                        });
                    }
                }

                this.internal_fireLoading();
            }
        });

        AppEvents.Files.subscribe("download.newPart", event => {
            if (this.isCurrent(event.file)) {
                const source = this.sources.get(event.file.id);
                const {mediaSource, bufferQueue, url} = source;
                const sourceBuffer = mediaSource.sourceBuffers[0];

                if (!source.bufferedPercentage) {
                    this.audio.play();
                }

                source.bufferedPercentage = event.percentage;

                if (!sourceBuffer || !sourceBuffer.updating) {
                    sourceBuffer.appendBuffer(event.newBytes);
                } else {
                    bufferQueue.push(event.newBytes)
                }

                source.bufferedSize += event.newBytes.length;
            }
        });

        AppEvents.Files.subscribe("download.done", event => {
            if (this.isCurrent(event.file)) {
                const source = this.sources.get(event.file.id);

                source.bufferedPercentage = 100;

                if (source) {
                    const {mediaSource, bufferQueue, url} = source;
                    const sourceBuffer = mediaSource.sourceBuffers[0];

                    event.blob.arrayBuffer().then(buff => {
                        const lastPart = buff.slice(source.bufferedSize);

                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(lastPart);
                        } else {
                            bufferQueue.push(lastPart)
                        }
                    });
                } else {
                    this.audio.src = event.url;

                    this.audio.play()
                }
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
        return this.current()?.bufferedPercentage ?? 100;
    }

    current() {
        return this.sources.get(this.state.document?.id)
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