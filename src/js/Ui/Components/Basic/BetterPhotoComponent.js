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
import {PhotoFragment} from "../Columns/Chat/Message/Photo/PhotoFragment"
import AppEvents from "../../../Api/EventBus/AppEvents"
import FileManager from "../../../Api/Files/FileManager"
import {LoadingFragment} from "../Columns/Chat/Message/Photo/PhotoFigureFragment"

// probably patch-compatible
class BetterPhotoComponent extends StatefulComponent {
    state = {
        thumbnailUrl: false,
        width: 0,
        height: 0,
    };

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.photo.id)
            .updateOn("download.start")
            // .on("download.newPart", this.onDownloadNewPart)
            .updateOn("download.done")
    }

    render({photo, onClick, maxWidth, maxHeight}, {url, thumbnailUrl, width, height}) {
        const isLoading = FileManager.isPending(photo);

        return (
            <figure className={["photo", isLoading ? "thumbnail" : ""]} onClick={onClick}>
                {
                    !isLoading ?
                        <PhotoFragment url={FileManager.get(photo).url}
                                       width={width}
                                       height={height}
                                       maxWidth={maxWidth || width}
                                       maxHeight={maxHeight || height}/>
                        :
                        <PhotoFragment url={thumbnailUrl}
                                       width={width}
                                       height={height}
                                       maxWidth={maxWidth || width}
                                       maxHeight={maxHeight || height}/>
                }
            </figure>
        )
    }

    componentWillMount() {
        this.calculateState(this.props.photo);

        FileManager.downloadPhoto(this.props.photo);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.photo !== this.props.photo) {
            this.calculateState(nextProps.photo);
            FileManager.downloadPhoto(this.props.photo);
        }
    }

    calculateState = photo => {
        const maxSize = FileAPI.getMaxSize(photo);
        this.state.width = maxSize.w;
        this.state.height = maxSize.h;
        this.state.thumbnailUrl = FileAPI.hasThumbnail(photo) ? FileAPI.getThumbnail(photo) : "";
    }
}

export default BetterPhotoComponent;