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
import {PhotoFragment, VideoFragment} from "../Columns/Chat/Message/Photo/PhotoFragment"
import AppEvents from "../../../Api/EventBus/AppEvents"
import FileManager from "../../../Api/Files/FileManager"

// probably patch-compatible
class BetterPhotoComponent extends StatefulComponent {
    state = {
        thumbnailUrl: false,
        width: 0,
        height: 0,
    };

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => FileManager.checkEvent(event, this.props.photo, this.props.size))
            // .updateOn("download.start")
            .updateOn("download.newPart")
            .updateOn("download.done");
    }

    render({photo, size, onClick, maxWidth, maxHeight, calculateSize = false, wrapFigure = true, disableVideo = false, ...otherArgs}, {thumbnailUrl, width, height}) {
        const isLoading = FileManager.isPending(photo, size);

        let fragment = null

        const url = isLoading ? thumbnailUrl : FileManager.getUrl(photo, size);

        if(size?.type === "u") {
          fragment = <VideoFragment calculateSize={calculateSize}
                         url={url}
                         width={width}
                         height={height}
                         maxWidth={maxWidth || width}
                         maxHeight={maxHeight || height}
                         {...otherArgs}/>
        } else {
          fragment = <PhotoFragment calculateSize={calculateSize}
                         url={url}
                         width={width}
                         height={height}
                         maxWidth={maxWidth || width}
                         maxHeight={maxHeight || height}
                         {...otherArgs}/>
        }

        if (!wrapFigure) {
            return fragment;
        }

        const figureClasses = {
          photo: true,
          video: size?.type === "u",
          rp: true,
          thumbnail: isLoading
        }

        return (
            <figure css-cursor="pointer"
                    className={figureClasses}
                    onClick={onClick} {...otherArgs}>

                <div style={{
                    display: isLoading ? "block" : "none",
                }} className="photo-info">{String(Math.floor(FileManager.getPercentage(photo, size)))}%
                </div>
                {fragment}
            </figure>
        )
    }

    componentWillMount() {
        this.calculateState(this.props);
        FileManager.downloadPhoto(this.props.photo, this.props.size, {type: this.props.size?.type === "u" && "video/mp4"});
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.photo.id !== this.props.photo.id) {
            this.calculateState(nextProps);

            FileManager.downloadPhoto(nextProps.photo, nextProps.size, {type: nextProps.size?.type === "u" && "video/mp4"});
        }
    }

    calculateState = props => {
        if (props.calculateSize) {
            const maxSize = FileAPI.getMaxSize(props.photo, this.props.size?.type !=="u");
            this.state.width = maxSize.w;
            this.state.height = maxSize.h;
        }

        this.state.thumbnailUrl = FileAPI.hasThumbnail(props.photo) ? FileAPI.getThumbnail(props.photo) : "";
    }
}

export default BetterPhotoComponent;