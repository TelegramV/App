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
import FileManager from "../Files/FileManager"
import {FileAPI} from "../Files/FileAPI"


// currently there can be only one file per document
const files = new Map();


// if such file already exists - recreate it
export function getMediaFile(document) {
    files.get(document.id)?.cancel();

    const file = new MP4StreamingFile(document);
    files.set(document.id, file);
    return file;
}

class MP4StreamingFile {
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
        this.videoInfo = DocumentParser.attributeVideo(document);
        this.url = URL.createObjectURL(this.mediaSource)

        if (FileManager.isPending(document) && FileManager.getPending(document)?._downloadedBytes) {
            this.parts = [FileManager.getPending(document)?._downloadedBytes];
        }

        const condition = event => event.file.id === this.document.id && !this.seeked;
        AppEvents.Files.withFilter(condition, "download.done", this.onDownloadDone);
        AppEvents.Files.withFilter(condition, "download.newPart", this.onDownloadNewPart);
        AppEvents.Files.withFilter(condition, "download.canceled", this.onDocumentCanceled);

        this.init().then(() => {
            if (this.canceled) {
                return;
            }

            FileManager.downloadDocument(document);
        });

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

    onDownloadNewPart = ({newBytes}) => {
        if (this.canceled) {
            return;
        }

        if (this.mp4box) {
            if (this.parts.length) {
                const all = concatUint8(...this.parts, newBytes).buffer;
                console.log(all)
                all.fileStart = this.bufferOffset;
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

        this.bufferOffset += newBytes.length;
    }

    onDownloadDone = ({blob}) => {
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
    }

    seek = async (time: number) => {
        this.seeked = true;
        this.seekedTime = time;

        const seekInfo = this.mp4box.seek(time, true);

        const offset = seekInfo.offset;
        let newOffset = seekInfo.offset;
        let offsetDiff = offset - newOffset;

        while (newOffset % (1024 * 1024) !== 0.0) {
            newOffset--;
        }

        this.bufferOffset = newOffset;

        const file = await FileAPI.downloadDocumentPart(this.document, null, 1024 * 1024, newOffset);
        this.onDownloadNewPart({newBytes: file.bytes.slice(offsetDiff)});

        this.downloadNextPart(this.seekedTime);
    }

    downloadNextPart = async (time) => {
        if (time !== this.seekedTime) {
            throw new Error("canceled")
        }

        const file = await FileAPI.downloadDocumentPart(this.document, null, 1024 * 1024, this.bufferOffset);

        if (time !== this.seekedTime) {
            throw new Error("canceled")
        }

        if (file.bytes.length + this.bufferOffset === this.document.size) {
            this.onDownloadDone({blob: new Blob([file.bytes])});
        } else {
            this.onDownloadNewPart({newBytes: file.bytes});
        }

        await this.downloadNextPart(time);
    }

    cancel() {
        this.canceled = true;

        AppEvents.Files.unsubscribe("download.done", this.onDownloadDone);
        AppEvents.Files.unsubscribe("download.newPart", this.onDownloadNewPart);
        AppEvents.Files.unsubscribe("download.canceled", this.onDocumentCanceled);

        this.mediaSource = new MediaSource()
        this.parts = null;
        this.mp4box.stop();
        this.mp4box = null;
        this.queues = null;
        this.videoInfo = null;
        URL.revokeObjectURL(this.url);

        files.delete(this.document.id)
        this.document = null;
    }

    onDocumentCanceled = () => {
        this.cancel();
    }
}

export default MP4StreamingFile;