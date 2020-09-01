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

import VideoPlayer from "./VideoPlayer";
import FileManager from "../../../Api/Files/FileManager";

class StreamingVideoComponent extends VideoPlayer {
    state = {
        ...super.state,
        url: "",
    };

    appEvents(E) {
        // E.bus(AppEvents.Files)
        //     .filter(event => FileManager.checkEvent(event, this.props.document))
        //     .on("download.start", this.onDownloadStart)
        //     .on("download.newPart", this.onDownloadNewPart)
        //     .on("download.done", this.onDownloadDone);
    }

    render(props, state, globalState) {
        props = {...props};
        props.size = props.document.size;
        // props.bufferedSize = props.document.__mp4file?.bufferOffset || FileManager.getPendingSize(props.document);
        // props.isDownloaded = FileManager.isDownloaded(props.document);
        // props.isStreamable = DocumentParser.isVideoStreamable(props.document);
        if (FileManager.isDownloaded(props.document)) {
            props.src = FileManager.getUrl(props.document);

        } else {
            props.src = `./stream/${props.document.id}`;
            global.__DOCUMENTS__.set(props.document.id, props.document);
        }
        // console.log(props.document);
        delete props.document;
        // props.src = state.url;
        // props.previewSrc = state.previewSrc;

        return super.render(props, state, globalState);
    }

    componentWillMount(props) {
        super.componentWillMount(props);

        // if (!FileManager.isDownloaded(this.props.document) && DocumentParser.isVideoStreamable(props.document)) {
        //     if (DocumentParser.isVideoStreamable(props.document)) {
        //         this.mp4file = getMediaFile(this.props.document);
        //         this.state.url = this.mp4file.url;
        //     } else {
        //         console.warn("streaming is not supported for this video");
        //         FileManager.downloadDocument(this.props.document);
        //     }
        // } else {
        //     FileManager.downloadDocument(this.props.document);
        // }
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);

        // if (nextProps.document !== this.props.document || nextProps.document.id !== this.props.document.id) {
        //     this.state.url = "";
        //
        //     if (!FileManager.isDownloaded(nextProps.document)) {
        //         if (DocumentParser.isVideoStreamable(nextProps.document)) {
        //             this.mp4file = getMediaFile(nextProps.document);
        //
        //             this.setState({
        //                 url: this.mp4file.url,
        //             });
        //         } else {
        //             console.warn("streaming is not supported for this video");
        //             FileManager.downloadDocument(nextProps.document);
        //         }
        //     } else {
        //         FileManager.downloadDocument(nextProps.document);
        //     }
        // }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        // FileManager.cancel(this.props.document);
    }

    onDownloadStart = ({file}) => {
        // this.forceUpdate();
        //
        // if (DocumentParser.isVideoStreamable(file)) {
        //     // this.setState({
        //     //     url: file.__mp4file.url,
        //     // });
        // } else {
        //     this.setState({
        //         url: "",
        //     });
        // }
    };

    onDownloadNewPart = () => {
        // this.forceUpdate();
    };

    // onSeeking = event => {
    //     const $video: HTMLVideoElement = event.target;
    //
    //     if ($video.lastSeekTime !== $video.currentTime) {
    //         for (let i = 0; i < $video.buffered.length; i++) {
    //             let start = $video.buffered.start(i);
    //             let end = $video.buffered.end(i);
    //
    //             if ($video.currentTime >= start && $video.currentTime <= end) {
    //                 return;
    //             }
    //         }
    //
    //         this.mp4file.seek($video.currentTime);
    //
    //         $video.lastSeekTime = $video.currentTime;
    //     }
    // };
}

export default StreamingVideoComponent;