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
import {FileAPI} from "../../../Api/Files/FileAPI"
import DocumentParser from "../../../Api/Files/DocumentParser"
import {PhotoFragment, VideoFragment} from "../Columns/Chat/Message/Photo/PhotoFragment"
import VComponent from "../../../V/VRDOM/component/VComponent"
import FileManager from "../../../Api/Files/FileManager"
import AppEvents from "../../../Api/EventBus/AppEvents"

class BetterVideoComponent extends StatefulComponent {
    state = {
        url: "",
        isLoading: true,
        thumbnailUrl: false,
        width: 0,
        height: 0,
        isHovered: false,
        currentTime: 0,
    };

    videoRef: { $el: HTMLVideoElement } = VComponent.createRef();

    init() {
        const {document} = this.props;

        const maxSize = DocumentParser.attributeVideo(document);
        this.state.width = maxSize.w;
        this.state.height = maxSize.h;
        this.state.thumbnailUrl = FileAPI.getThumbnail(document);
    }

    appEvents(E: AE) {
        E.bus(AppEvents.Files)
            .filter(event => FileManager.checkEvent(event, this.props.document))
            .on("download.start", this.onDownloadStart)
            .on("download.newPart", this.onDownloadNewPart)
            .on("download.done", this.onDownloadDone)
            .on("download.canceled", this.onDownloadCanceled)
    }

    render({document, onClick, playOnHover, infoContainer, isRound, onPlay, onPause, onTimeUpdate, showVideo = true, ...otherArgs}, {isLoading, url, thumbnailUrl, width, height}) {
        const streamable = DocumentParser.isVideoStreamable(document);

        if (streamable) {
            otherArgs.autoPlay = false;
            otherArgs.showVideo = false;
        }

        return (
            <figure className={["video rp rps", (isLoading || !showVideo) && "thumbnail", isRound && "round"]}
                    onClick={onClick}>
                {infoContainer && infoContainer(this.state, this.videoRef.$el)}
                {
                    !isLoading && showVideo ?
                        <VideoFragment {...otherArgs}
                                       src={url}
                                       type={document.mime_type}
                                       onMouseOver={this.onMouseOver}
                                       onMouseOut={this.onMouseOut}
                                       onEnded={this.onEnded}
                                       onTimeUpdate={this.onTimeUpdate}
                                       onPause={this.onPause}
                                       onPlay={this.onPlay}
                                       width={width}
                                       height={height}
                                       ref={this.videoRef}
                                       calculateSize={true}
                        />
                        :
                        <PhotoFragment document={document}
                                       url={thumbnailUrl}
                                       width={width}
                                       height={height}
                                       calculateSize={true}/>
                }
            </figure>
        )
    }

    componentWillMount(props) {
        if (props.autoDownload) {
            FileManager.downloadVideo(props.document)
        }
    }

    componentDidMount() {
        if (this.videoRef.$el) {
            if (this.props.muted) {
                this.videoRef.$el.volume = 0;
            } else {
                this.videoRef.$el.volume = 1;
            }
        }
    }

    componentDidUpdate() {
        if (this.videoRef.$el) {
            if (this.props.muted) {
                this.videoRef.$el.volume = 0;
            } else {
                this.videoRef.$el.volume = 1;
            }
        }
    }

    onDownloadDone = ({url}) => {
        this.setState({
            url,
            isLoading: false,
        });

        if (!this.props.autoPlay) {
            this.videoRef.$el?.pause();
        }
    }

    onDownloadStart = () => {
        this.forceUpdate();
    }

    onDownloadNewPart = () => {
        this.forceUpdate();
    }

    onDownloadCanceled = () => {
        this.forceUpdate();
    }

    onMouseOver = e => {
        if (this.props.playOnHover) {
            this.state.isHovered = true;
            e.currentTarget?.play();
        }
    }

    onMouseOut = e => {
        if (this.props.playOnHover) {
            this.state.isHovered = false;
            e.currentTarget?.pause();
        }
    }

    onEnded = e => {
        this.setState({
            currentTime: DocumentParser.attributeVideo(this.props.document).duration,
        });

        if (this.state.isHovered) {
            e.target.play();
        }

        if (this.props.onEnded) {
            this.props.onEnded(e);
        }
    }

    onTimeUpdate = (event: Event) => {
        this.setState({
            currentTime: event.target.currentTime,
        });

        if (this.props.onTimeUpdate) {
            this.props.onTimeUpdate(event);
        }
    }

    onPlay = (event) => {
        this.forceUpdate();

        if (this.props.onPlay) {
            this.props.onPlay(event);
        }
    }

    onPause = (event) => {
        this.forceUpdate();

        if (this.props.onPause) {
            this.props.onPause(event);
        }
    }
}

export default BetterVideoComponent;