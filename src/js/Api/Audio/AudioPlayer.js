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

class AudioPlayer {
    audio: HTMLAudioElement;
    mediaSource: MediaSource;

    state = {
        document: null,
        /**
         * @var {SourceBuffer}
         */
        sourceBuffer: null,
        duration: 0,
        timestamp: 0,
        buffered: 0,
        bufferedSize: 0,
        queue: [],
    };

    defaultState = {...this.state};

    constructor() {
        this.mediaSource = new MediaSource();
        this.audio = new Audio(URL.createObjectURL(this.mediaSource));

        AppEvents.Files.subscribe("download.start", event => {
            if (this.isCurrent(event.file)) {
                if (this.mediaSource.sourceBuffers[0]) {
                    this.mediaSource.removeSourceBuffer(this.mediaSource.sourceBuffers[0]);
                }

                this.state.sourceBuffer = this.mediaSource.addSourceBuffer(event.file.mime_type);

                this.internal_fireLoading();
            }
        });

        AppEvents.Files.subscribe("download.newPart", event => {
            if (this.isCurrent(event.file)) {
                this.state.buffered = event.percentage;

                if (!this.state.sourceBuffer.updating) {
                    this.state.sourceBuffer.appendBuffer(event.newBytes);
                } else {
                    this.state.queue.push(event.newBytes)
                }

                this.state.bufferedSize += event.newBytes.length;

                if (this.audio.paused) {
                    this.audio.play()
                }

                this.internal_fireBuffered();
            }
        });

        AppEvents.Files.subscribe("download.done", event => {
            if (this.isCurrent(event.file)) {

                if (this.state.sourceBuffer) {
                    event.blob.arrayBuffer().then(buff => {
                        const lastPart = buff.slice(this.state.bufferedSize);

                        if (!this.state.sourceBuffer.updating) {
                            this.state.sourceBuffer.appendBuffer(lastPart);
                        } else {
                            this.state.queue.push(lastPart)
                        }
                    });
                } else {
                    this.audio.src = event.url;

                    this.audio.play().then(() => {
                        this.internal_firePlay();
                    })
                }

            }
        });

        AppEvents.Files.subscribe("download.canceled", event => {

        });
    }

    isCurrent(document) {
        return this.state.document && this.state.document.id === document.id;
    }

    isPaused() {
        return this.audio.paused;
    }

    isLoading(document = null) {
        return document ? document.id === this.state.document?.id && this.state.status === "loading" : this.state.status === "loading";
    }

    play(document) {
        if (this.isCurrent(document)) {
            if (this.isLoading()) {
                FileManager.cancel(document);
            } else if (this.isPaused()) {
                this.audio.play();

                this.internal_firePlay();
            }
        } else {
            this.state.document = document;

            if (FileManager.isDownloaded(document)) {
                this.audio.play();

                this.internal_firePlay();
            } else {
                this.internal_fireLoading();

                FileManager.downloadDocument(document);
            }
        }
    }

    toggle(document) {
        if (this.isPaused()) {
            this.play(document);
        } else {
            this.pause();
        }
    }

    pause() {
        this.audio.pause();

        this.internal_firePaused();
    }

    internal_fireLoading() {
        this.state.status = "loading";

        AppEvents.General.fire("audio.loading", {
            state: this.state,
        });
    }

    internal_firePlay() {
        this.state.status = "playing";

        AppEvents.General.fire("audio.play", {
            state: this.state,
        });
    }

    internal_firePaused() {
        this.state.status = "paused";

        AppEvents.General.fire("audio.paused", {
            state: this.state,
        });
    }

    internal_fireBuffered() {
        AppEvents.General.fire("audio.buffered", {
            state: this.state,
        });
    }
}

export default new AudioPlayer();