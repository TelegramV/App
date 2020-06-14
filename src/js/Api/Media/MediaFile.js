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

import DocumentParser from "../Files/DocumentParser";
import AppEvents from "../EventBus/AppEvents"
import {concatUint8} from "../../Utils/byte"

class MP4StreamingFile {
    url: string = "";
    bufferOffset: number = 0;

    document;
    videoInfo;
    mediaSource: MediaSource;
    mp4box: ISOFile;

    queues: Map<SourceBuffer, Array<Uint8Array>> = new Map();
    parts: Uint8Array[] = [];

    constructor(document) {
        this.document = document;
        this.mediaSource = new MediaSource();
        this.url = URL.createObjectURL(this.mediaSource);
        this.videoInfo = DocumentParser.attributeVideo(document);

        const condition = event => event.file.id === this.document.id;
        AppEvents.Files.withFilter(condition, "download.done", this.onDownloadDone);
        AppEvents.Files.withFilter(condition, "download.newPart", this.onDownloadNewPart);
    }

    init = (): Promise => {
        return new Promise((resolve, reject) => {
            if (this.canceled) {
                return;
            }

            this.mediaSource.onsourceclose = ev => reject(ev);

            this.mediaSource.onsourceopen = () => {
                import("mp4box").then(({default: MP4Box}) => {
                    if (this.canceled) {
                        return;
                    }

                    this.mp4box = MP4Box.createFile();

                    this.mp4box.onSegment = (id, sourceBuffer, buffer, sampleNum, is_last) => {
                        sourceBuffer.segmentIndex++;
                        sourceBuffer.pendingAppends.push({id, buffer, sampleNum, is_last});
                        this.onUpdateEnd(sourceBuffer, true, false);
                    }

                    this.mp4box.onReady = info => {
                        this.mediaSource.duration = this.videoInfo.duration;

                        info.tracks.forEach(this.initTrack);

                        const initSegments = this.mp4box.initializeSegmentation();
                        initSegments.forEach(this.initSegment);

                        this.mp4box.start();
                    }

                    resolve(this.mediaSource)
                })
            }
        })
    }

    initTrack = track => {
        if (this.canceled) {
            return;
        }

        const mime = `${this.document.mime_type}; codecs="${track.codec}"`;
        const sourceBuffer = this.mediaSource.addSourceBuffer(mime);
        sourceBuffer.id = track.id;

        this.mp4box.setSegmentOptions(track.id, sourceBuffer, {nbSamples: 100});

        sourceBuffer.pendingAppends = [];
    }

    initSegment = segment => {
        if (this.canceled) {
            return;
        }

        const {id, user: sourceBuffer, buffer} = segment;

        sourceBuffer.addEventListener("updateend", this.onInitAppended);
        sourceBuffer.appendBuffer(buffer);

        sourceBuffer.segmentIndex = 0;
    }

    onInitAppended = event => {
        if (this.canceled) {
            return;
        }

        const sourceBuffer = event.target;

        if (this.mediaSource.readyState === "open") {
            sourceBuffer.sampleNum = 0;
            sourceBuffer.removeEventListener("updateend", this.onInitAppended);
            sourceBuffer.addEventListener("updateend", () => this.onUpdateEnd(sourceBuffer, true, true));

            this.onUpdateEnd(sourceBuffer, false, true);
        }
    }

    onUpdateEnd = (sourceBuffer, isNotInit, isEndOfAppend) => {
        if (this.canceled) {
            return;
        }

        if (isEndOfAppend === true) {
            if (sourceBuffer.sampleNum) {
                this.mp4box.releaseUsedSamples(sourceBuffer.id, sourceBuffer.sampleNum);
                delete sourceBuffer.sampleNum;
            }

            if (sourceBuffer.is_last) {
                this.mediaSource.endOfStream();
            }
        }

        if (this.mediaSource.readyState === "open" && !sourceBuffer.updating && sourceBuffer.pendingAppends.length > 0) {
            const part = sourceBuffer.pendingAppends.shift();

            sourceBuffer.sampleNum = part.sampleNum;
            sourceBuffer.is_last = part.is_last;
            sourceBuffer.appendBuffer(part.buffer);
        }
    }

    onDownloadNewPart = ({newBytes, totalBytes}) => {
        if (this.canceled) {
            return;
        }
        
        if (this.mp4box) {
            if (this.parts.length) {
                const all = concatUint8(...this.parts, newBytes).buffer;
                all.fileStart = 0;
                this.mp4box.appendBuffer(all);
                this.parts = [];
            } else {
                const part = newBytes.buffer;
                part.fileStart = this.bufferOffset;
                this.mp4box.appendBuffer(part);
            }
        } else {
            this.parts.push(newBytes);
        }

        this.bufferOffset += newBytes.byteLength;
    }

    onDownloadDone = ({blob, url}) => {
        if (this.canceled || this.isDone) {
            return;
        }

        blob.arrayBuffer().then(buff => {
            const lastPart = buff.slice(this.bufferOffset);
            lastPart.fileStart = this.bufferOffset;
            this.mp4box.appendBuffer(lastPart, true);
            this.mp4box.flush();
            this.isDone = true;
        });

        URL.revokeObjectURL(this.url);
    }

    cancel() {
        this.canceled = true;

        AppEvents.Files.unsubscribe("download.done", this.onDownloadDone);
        AppEvents.Files.unsubscribe("download.newPart", this.onDownloadNewPart);

        // todo: clean-up everything
    }
}

export default MP4StreamingFile;