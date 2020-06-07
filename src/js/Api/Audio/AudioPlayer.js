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
                if (this.state.isVoice) {
                    // this.audio.play();
                } else {
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

                    this.audio.src = url;
                    this.audio.play();

                    this.internal_fireLoading();
                }
            }
        });

        AppEvents.Files.subscribe("download.newPart", event => {
            if (this.isCurrent(event.file) && !this.state.isVoice) {
                const source = this.sources.get(event.file.id);
                const {mediaSource, bufferQueue} = source;
                const sourceBuffer = mediaSource.sourceBuffers[0];

                source.bufferedPercentage = event.percentage;

                if (!sourceBuffer || !sourceBuffer.updating) {
                    sourceBuffer.appendBuffer(event.newBytes);
                } else {
                    bufferQueue.push(event.newBytes);
                }

                source.bufferedSize += event.newBytes.length;
            }
        });

        AppEvents.Files.subscribe("download.done", event => {
            if (this.isCurrent(event.file)) {
                if (this.state.isVoice) {
                    this.audio.src = event.url;
                    this.audio.play();
                } else {
                    const source = this.sources.get(event.file.id);

                    source.bufferedPercentage = 100;
                    const {mediaSource, bufferQueue, url} = source;
                    const sourceBuffer = mediaSource.sourceBuffers[0];

                    if (sourceBuffer) {
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
            }
        });

        AppEvents.Files.subscribe("download.canceled", event => {
            this.sources.delete(event.file.id) // todo: should probably clean sourceBuffer etc.
        });
    }

    get state() {
        const info = DocumentParser.attributeAudio(this.currentMessage?.media.document);
        const source = this.sources.get(this.currentMessage?.media.document.id);
        const isVoice = info?.voice;

        return {
            message: this.currentMessage,
            isPaused: this.audio.paused || this.audio.ended || (info?.duration && this.audio.currentTime >= info?.duration),
            isEnded: this.audio.ended || this.audio.currentTime >= info?.duration,
            isLoading: false,
            currentTime: this.audio.currentTime,
            duration: info?.duration,
            bufferedPercentage: isVoice ? 100 : source?.bufferedPercentage ?? 100,
            audioInfo: info,
            isVoice,
        }
    }

    isCurrent(messageOrDocument) {
        return this.currentMessage && messageOrDocument && (this.currentMessage === messageOrDocument || this.currentMessage.media.document.id === messageOrDocument.id);
    }

    play(message = this.currentMessage) {
        if (this.isCurrent(message)) {
            // if (this.isLoading()) {
            //     FileManager.cancel(message.media.document);
            // } else
            if (this.state.isPaused) {
                if (this.state.isEnded) {
                    this.audio.currentTime = 0;
                }

                this.audio.play()
            }
        } else {
            this.currentMessage = message;

            if (FileManager.isDownloaded(message.media.document)) {
                this.pause();
                this.audio.src = FileManager.getUrl(message.media.document);
                this.audio.play();
            } else {
                this.internal_fireLoading();
                this.pause();
                this.audio.src = "";

                FileManager.downloadDocument(message.media.document);
            }
        }
    }

    toggle(message = this.currentMessage) {
        if (!this.isCurrent(message) || this.state.isPaused) {
            this.play(message);
        } else {
            this.pause();
        }
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.currentMessage = null;
        this.audio.src = "";
        this.audio.pause();
        this.internal_fireStop();
    }

    updateTime(time: number) {
        this.audio.currentTime = time;
    }

    internal_fireLoading = () => {
        AppEvents.Audio.fire("audio.loading", {
            state: this.state,
        });
    }

    internal_fireStop = () => {
        AppEvents.Audio.fire("audio.stop", {
            state: this.state,
        });
    }

    internal_fireEnded = () => {
        AppEvents.Audio.fire("audio.ended", {
            state: this.state,
        });
    }

    internal_firePlay = () => {
        AppEvents.Audio.fire("audio.play", {
            state: this.state,
        });
    }

    internal_firePaused = () => {
        AppEvents.Audio.fire("audio.paused", {
            state: this.state,
        });
    }

    internal_fireBuffered = () => {
        AppEvents.Audio.fire("audio.buffered", {
            state: this.state,
        });
    }

    internal_fireTimeUpdate = () => {
        AppEvents.Audio.fire("audio.timeUpdate", {
            state: this.state,
        });
    }
}

const player = new AudioPlayer();

export default player;