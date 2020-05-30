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
import VComponent from "../../../V/VRDOM/component/VComponent"

class BetterPhotoComponent extends StatefulComponent {
    state = {
        url: "",
        isLoading: true,
        thumbnailUrl: false,
        width: 0,
        height: 0,
        isHovered: false,
    };

    videoRef = VComponent.createRef();

    init() {
        const {photo} = this.props;

        const maxSize = FileAPI.getMaxSize(photo);
        this.state.width = maxSize.w;
        this.state.height = maxSize.h;
        this.state.thumbnailUrl = FileAPI.hasThumbnail(photo) ? FileAPI.getThumbnail(photo) : "";
    }

    render({photo, onClick, controls, autoPlay, loop}, {isLoading, url, thumbnailUrl, width, height}) {
        return (
            <figure className={["photo rp rps", isLoading ? "thumbnail" : ""]} onClick={onClick}>
                {
                    !isLoading ?
                        <img src={url} alt={"Photo"}/>
                        :
                        (width > height ?
                                <img src={thumbnailUrl} alt=""
                                     css-width={width ? width + "px" : ""}/>
                                :
                                <img src={thumbnailUrl} alt=""
                                     css-height={height ? height + "px" : ""}/>
                        )
                }
            </figure>
        )
    }

    componentDidMount() {
        const {photo} = this.props;

        this.assure(FileAPI.downloadPhoto(photo))
            .then(file => {
                const url = FileAPI.getUrl(file);

                this.setState({
                    isLoading: false,
                    url: url,
                });
            })
    }
}

export default BetterPhotoComponent;