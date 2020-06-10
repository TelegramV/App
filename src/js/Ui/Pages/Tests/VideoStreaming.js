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
import DocumentParser from "../../../Api/Files/DocumentParser"
import MP4Box from "mp4box"
import FileManager from "../../../Api/Files/FileManager"
import AppEvents from "../../../Api/EventBus/AppEvents"

const videoDocument = {
    "_": "document",
    "flags": 1,
    "id": "5330469046183789925",
    "access_hash": "2206168299258949860",
    "file_reference": new Uint8Array([2, 73, 179, 200, 76, 0, 0, 0, 6, 94, 225, 65, 78, 104, 57, 164, 7, 39, 45, 147, 97, 130, 47, 23, 202, 179, 25, 187, 176]),
    "date": 1589591364,
    "mime_type": "video/mp4",
    "size": 6910095,
    "thumbs": [{
        "_": "photoStrippedSize",
        "type": "i",
        "bytes": new Uint8Array([1, 22, 40, 217, 162, 138, 40, 0, 162, 138, 40, 0, 162, 138, 40, 0, 162, 138, 40, 0, 162, 138, 40, 0, 162, 138, 40, 3])
    }, {
        "_": "photoSize",
        "type": "m",
        "location": {"_": "fileLocationToBeDeprecated", "volume_id": "235409175", "local_id": 7820},
        "w": 320,
        "h": 180,
        "size": 644
    }],
    "dc_id": 2,
    "attributes": [{
        "_": "documentAttributeVideo",
        "flags": 2,
        "supports_streaming": true,
        "duration": 27,
        "w": 1920,
        "h": 1080
    }, {"_": "documentAttributeFilename", "file_name": "intro_5.mp4"}]
}

export class VideoStreaming extends StatefulComponent {
    state = {
        url: "",
        frameUrl: "",
        bufferOffset: 0,
    };

    videoRef: { $el: HTMLVideoElement } = VComponent.createRef();

    mediaSource: MediaSource;
    mp4box: ISOFile;

    queues: Map<SourceBuffer, Array<Uint8Array>> = new Map();

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.document.id)
            .on("download.done", this.onDownloadDone)
            .on("download.newPart", this.onDownloadNewPart);
    }

    render({document}, {url, frameUrl}) {
        return (
            <div>
                <video css-max-width="500px"
                       ref={this.videoRef}
                       src={url}
                       controls/>
                <video css-max-width="500px"
                       src={url}
                       controls/>
                <br/>
                <div style="border: 3px solid blue; width: 100%;" onMouseMove={this.onMouseMove}/>
                <img src={frameUrl} css-max-width="200px" alt="alt"/>
            </div>
        );
    }

    componentWillMount({document}) {
        this.mediaSource = new MediaSource();
        this.state.url = URL.createObjectURL(this.mediaSource);

        this.videoInfo = DocumentParser.attributeVideo(document);

        this.mediaSource.onsourceopen = () => {
            this.mp4box = MP4Box.createFile();

            this.mp4box.onSegment = (id, sourceBuffer, buffer, sampleNum, is_last) => {
                sourceBuffer.segmentIndex++;
                sourceBuffer.pendingAppends.push({id, buffer, sampleNum, is_last});

                // console.warn("Application", "Received new segment for track " + id + " up to sample #" + sampleNum + ", segments pending append: " + sourceBuffer.pendingAppends.length);

                this.onUpdateEnd(sourceBuffer, true, false);
            }

            this.mp4box.onReady = info => {
                this.mediaSource.duration = this.videoInfo.duration;

                info.tracks.forEach(this.initTrack);

                this.videoTrack = info.videoTracks[0];

                const initSegments = this.mp4box.initializeSegmentation();
                initSegments.forEach(this.initSegment);

                this.mp4box.start();

                // console.log(this.mp4box.getSample(info.tracks[0], 100))
                console.log(info)
            }
            this.mp4box.onSamples = (id, user, samples) => {
                console.warn(id, user, samples)
            }

            FileManager.downloadDocument(document);
        }
    }

    initTrack = track => {
        const mime = `${this.props.document.mime_type}; codecs="${track.codec}"`;
        const sourceBuffer = this.mediaSource.addSourceBuffer(mime);
        sourceBuffer.id = track.id;

        this.mp4box.setSegmentOptions(track.id, sourceBuffer, {nbSamples: 100});

        sourceBuffer.pendingAppends = [];
    }

    initSegment = segment => {
        const {id, user: sourceBuffer, buffer} = segment;

        sourceBuffer.addEventListener("updateend", this.onInitAppended);
        sourceBuffer.appendBuffer(buffer);

        sourceBuffer.segmentIndex = 0;
    }

    onInitAppended = event => {
        const sourceBuffer = event.target;

        if (this.mediaSource.readyState === "open") {
            sourceBuffer.sampleNum = 0;
            sourceBuffer.removeEventListener("updateend", this.onInitAppended);
            sourceBuffer.addEventListener("updateend", () => this.onUpdateEnd(sourceBuffer, true, true));

            this.onUpdateEnd(sourceBuffer, false, true);
        }
    }

    onUpdateEnd = (sourceBuffer, isNotInit, isEndOfAppend) => {
        if (isEndOfAppend === true) {
            if (isNotInit === true) {
                // console.log(sourceBuffer, "Update ended");
            }

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
        // console.warn("STREAMING: appendBuffer");

        const part = newBytes.buffer;
        part.fileStart = this.state.bufferOffset;

        this.mp4box.appendBuffer(part);

        this.state.bufferOffset += part.byteLength;
    }

    onDownloadDone = ({blob, url}) => {
        blob.arrayBuffer().then(buff => {
            const lastPart = buff.slice(this.state.bufferOffset);
            lastPart.fileStart = this.state.bufferOffset;
            this.mp4box.appendBuffer(lastPart, true);
            this.mp4box.flush();
        });
        // console.warn("STREAMING: done")
    }

    onMouseMove = (event: MouseEvent) => {
        // console.log(event)
    }
}

export function VideoStreamingPage() {
    return (
        <div>
            <VideoStreaming document={videoDocument}/>
        </div>
    )
}