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
import FileManager from "../../../Api/Files/FileManager"
import AppEvents from "../../../Api/EventBus/AppEvents"
import VComponent from "../../../V/VRDOM/component/VComponent"
import DocumentParser from "../../../Api/Files/DocumentParser"
import AudioPlayer from "../../../Api/Media/AudioPlayer"

let FILE;

FILE = {
    "_": "document",
    "flags": 1,
    "id": "5379749745751230556",
    "access_hash": "13849914774782974337",
    "file_reference": [
        4,
        67,
        205,
        29,
        42,
        0,
        0,
        1,
        137,
        94,
        213,
        42,
        111,
        15,
        238,
        108,
        24,
        109,
        25,
        40,
        248,
        213,
        180,
        128,
        253,
        195,
        117,
        140,
        2
    ],
    "date": 1591020659,
    "mime_type": "audio/mpeg",
    "size": 4089694,
    "thumbs": [{
        "_": "photoSize",
        "type": "m",
        "location": {"_": "fileLocationToBeDeprecated", "volume_id": "200056600129", "local_id": 121},
        "w": 300,
        "h": 300,
        "size": 19850
    }],
    "dc_id": 2,
    "attributes": [{
        "_": "documentAttributeAudio",
        "flags": 3,
        "duration": 257,
        "title": "In the Shadows",
        "performer": "The Rasmus"
    }, {"_": "documentAttributeFilename", "file_name": "The Rasmus - In the Shadows.mp3"}]
}

let BOOK = {
    "_": "document",
    "flags": 1,
    "id": "5337189815303540256",
    "access_hash": "1049044396251195175",
    "file_reference": [
        2,
        83,
        126,
        31,
        130,
        0,
        0,
        0,
        2,
        94,
        213,
        34,
        123,
        159,
        173,
        233,
        249,
        109,
        140,
        100,
        112,
        86,
        72,
        199,
        221,
        30,
        27,
        53,
        42
    ],
    "date": 1589755173,
    "mime_type": "audio/mp4",
    "size": 115524833,
    "thumbs": [{
        "_": "photoSize",
        "type": "m",
        "location": {"_": "fileLocationToBeDeprecated", "volume_id": "200058900584", "local_id": 881},
        "w": 320,
        "h": 240,
        "size": 25152
    }],
    "dc_id": 2,
    "attributes": [{
        "_": "documentAttributeAudio",
        "flags": 3,
        "duration": 7269,
        "title": "Я, «ПОБЕДА» І БЕРЛІН - Кузьма Скрябін (Андрій Кузьменко) | Аудіокнига",
        "performer": "Аудіокнига.UA"
    }, {
        "_": "documentAttributeFilename",
        "file_name": "АудіокнигаUA_Я_ПОБЕДА_І_БЕРЛІН_Кузьма_Скрябін_Андрій_Кузьменко_Аудіокнига.m4a"
    }]
}

class StreamableAudioComponent extends StatefulComponent {
    state = {
        mediaSource: null,
        sourceBuffer: null,
        url: null,
        bufferedSize: 0,
        queue: [],
    }

    audioRef = VComponent.createRef()

    appEvents(E: AE) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.document.id)
            .on("download.done", this.onDownloadDone)
            .on("download.newPart", this.onDownloadNewPart)
    }

    render({document, ...args}, {url}) {
        return <audio ref={this.audioRef} src={url} {...args}/>
    }

    componentWillMount() {
        const {document} = this.props;


        if (FileManager.isDownloaded(document)) {
            this.state.url = FileManager.get(document).url;
        } else {
            const mediaSource = new MediaSource();

            this.state.mediaSource = mediaSource;
            this.state.url = URL.createObjectURL(this.state.mediaSource);

            mediaSource.onsourceopen = () => {
                const sourceBuffer = mediaSource.addSourceBuffer(document.mime_type === "audio/mp4" ? 'audio/mp4; codecs="mp4a.40.2"' : document.mime_type);
                mediaSource.duration = DocumentParser.attributeAudio(document)?.duration;
                this.state.sourceBuffer = sourceBuffer;

                sourceBuffer.addEventListener("updateend", () => {
                    if (this.state.queue.length) {
                        sourceBuffer.appendBuffer(this.state.queue.shift());
                    }
                });

                FileManager.downloadDocument(document);
            }
        }
    }

    onDownloadNewPart = ({newBytes}) => {
        if (!this.state.sourceBuffer.updating) {
            this.state.sourceBuffer.appendBuffer(newBytes);
        } else {
            this.state.queue.push(newBytes)
        }

        this.state.bufferedSize += newBytes.length;
    }

    onDownloadDone = ({blob}) => {
        blob.arrayBuffer().then(buff => {
            const lastPart = buff.slice(this.state.bufferedSize);

            if (!this.state.sourceBuffer.updating) {
                this.state.sourceBuffer.appendBuffer(lastPart);
            } else {
                this.state.queue.push(lastPart)
            }
        });
    }
}

class AAAA extends StatefulComponent {
    state = {
        document: FILE
    }

    appEvents(E) {
        E.bus(AppEvents.General)
            .updateOn("audio.play")
            .updateOn("audio.paused")
            .updateOn("audio.loading")
            .updateOn("audio.buffered")
    }

    render(props, {document}) {
        return (
            <div>
                {/*<StreamableAudioComponent document={document} controls/>*/}
                {/*<br/>*/}
                {/*{document === FILE ? "BOOK" : "FILE"}*/}
                {/*<br/>*/}
                {/*<button onClick={() => {*/}
                {/*    this.setState({*/}
                {/*        document: document === FILE ? BOOK : FILE*/}
                {/*    });*/}
                {/*}}>toggle*/}
                {/*</button>*/}

                {AudioPlayer.state.buffered}

                <button onClick={() => {
                    AudioPlayer.toggle(document)
                }}>
                    {this.buttonText}
                </button>
            </div>
        )
    }

    get buttonText() {
        if (AudioPlayer.isPaused() || !AudioPlayer.isCurrent(document)) {
            return AudioPlayer.isLoading() ? "loading" : "play"
        } else {
            return "pause"
        }
    }
}

export function StreamingPage() {
    return (
        <div>
            <AAAA/>
        </div>
    )
}