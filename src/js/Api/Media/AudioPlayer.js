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

    cleanSource(source) {
        URL.revokeObjectURL(source.url)
    }

    useSource(document) {
        if (!document) {
            return null;
        }

        const setSource = () => {
            const mediaSource = new MediaSource();

            const source = {
                document: document,
                mediaSource,
                bufferQueue: [],
                bufferedSize: 0,
                bufferedPercentage: 0,
            };

            if (FileManager.isPending(document)) {
                const pending = FileManager.getPending(document);
                source.bufferQueue = [pending._downloadedBytes];
                source.bufferedSize = pending._downloadedBytes.length;
                source.bufferedPercentage = pending._percentage;
            }

            mediaSource.onsourceopen = () => {
                const sourceBuffer = mediaSource.addSourceBuffer(document.mime_type);
                mediaSource.duration = DocumentParser.attributeAudio(document).duration;

                if (!sourceBuffer.updating) {
                    if (source.bufferQueue.length) {
                        sourceBuffer.appendBuffer(source.bufferQueue.shift());
                    }
                }

                sourceBuffer.addEventListener("updateend", () => {
                    if (source.bufferQueue.length) {
                        sourceBuffer.appendBuffer(source.bufferQueue.shift());
                    }
                });

                this.audio.play();
            }

            source.url = URL.createObjectURL(source.mediaSource);

            this.source = source;
        }

        if (!this.isCurrent(document)) {
            this.cleanSource(this.source);
            setSource();
        } else {
            if (this.source) {
                if (this.source.document.id !== document.id) {
                    this.cleanSource(this.source);
                    setSource();
                }
            } else {
                setSource();
            }
        }

        return this.source;
    }

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
            if (this.isCurrent(event.file) && this.state.supportStreaming) {
                let source = this.useSource(event.file);

                this.audio.src = source.url;
                this.audio.play();

                this.internal_fireLoading();
            }
        });

        AppEvents.Files.subscribe("download.newPart", event => {
            if (this.isCurrent(event.file) && this.state.supportStreaming) {
                const source = this.useSource(event.file);
                const {mediaSource, bufferQueue} = source;

                const sourceBuffer = mediaSource.sourceBuffers[0];

                source.bufferedPercentage = event.percentage;

                if (sourceBuffer && !sourceBuffer.updating) {
                    sourceBuffer.appendBuffer(event.newBytes);
                } else {
                    bufferQueue.push(event.newBytes);
                }

                source.bufferedSize += event.newBytes.length;
            }
        });

        AppEvents.Files.subscribe("download.done", event => {
            if (this.isCurrent(event.file)) {
                if (!this.state.supportStreaming) {
                    this.audio.src = event.url;
                    this.audio.play();
                } else {
                    const source = this.useSource(event.file);

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
                        this.audio.play();
                    }
                }
            }
        });

        AppEvents.Files.subscribe("download.canceled", event => {
            this.cleanSource(this.source) // todo: should probably clean sourceBuffer etc.
        });
    }

    get state() {
        const fileName = DocumentParser.attributeFilename(this.currentMessage?.media.document);
        const info = DocumentParser.attributeAudio(this.currentMessage?.media.document);
        const source = this.useSource(this.currentMessage?.media.document);
        const isVoice = info?.voice;

        return {
            message: this.currentMessage,
            isPaused: this.audio.paused || this.audio.ended || (info?.duration && this.audio.currentTime >= info?.duration),
            isEnded: this.audio.ended || this.audio.currentTime >= info?.duration,
            isLoading: false,
            currentTime: this.audio.currentTime,
            duration: info?.duration,
            bufferedPercentage: isVoice || FileManager.isDownloaded(this.currentMessage?.media.document) ? 100 : source?.bufferedPercentage ?? 100,
            audioInfo: info,
            isVoice,
            fileName,
            isSeeking: this.audio.seeking,
            supportStreaming: !__IS_IOS__ && !isVoice && MediaSource.isTypeSupported(this.currentMessage?.media.document.mime_type)
        }
    }

    isCurrent(messageOrDocument) {
        return this.currentMessage && messageOrDocument && (this.currentMessage === messageOrDocument || this.currentMessage.media.document.id === messageOrDocument.id);
    }

    play(message = this.currentMessage) {
        if (this.isCurrent(message)) {
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

                if (FileManager.isPending(message.media.document)) {
                    this.audio.src = this.useSource(message.media.document).url;
                    this.audio.currentTime = 0;
                    this.audio.play();
                } else {
                    this.pause();
                    this.audio.src = null;
                }

                FileManager.downloadDocument(message.media.document, null, {
                    limit: 512 * 512, // 256K
                });
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
        this.source = null;
        this.internal_fireStop();
        this.audio.pause();
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