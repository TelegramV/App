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
import {PhotoFragment} from "../Columns/Chat/Message/Photo/PhotoFragment"

class BetterVideoComponent extends StatefulComponent {
    state = {
        url: "",
        isLoading: true,
        thumbnailUrl: false,
        width: 0,
        height: 0,
        isHovered: false,
    };

    init() {
        const {document} = this.props;

        const maxSize = DocumentParser.attributeVideo(document);
        this.state.width = maxSize.w;
        this.state.height = maxSize.h;
        this.state.thumbnailUrl = FileAPI.getThumbnail(document);
    }

    render({document, onClick, playOnHover, infoContainer, ...otherArgs}, {isLoading, url, thumbnailUrl, width, height}) {
        isLoading = true;

        return (
            <figure className={["video rp rps", isLoading && "thumbnail"]} onClick={onClick}>
                {infoContainer && infoContainer({})}
                {
                    !isLoading ?
                        <video src={url}
                               type={document.mime_type}
                               onMouseOver={this.onMouseOver}
                               onMouseOut={this.onMouseOut}
                               onEnded={this.onEnded}
                               {...otherArgs}
                        />
                        :
                        <PhotoFragment document={document} url={thumbnailUrl}
                                       width={width}
                                       height={height}
                                       calculateSize={true}/>
                    // (width > height ?
                    //         <img src={thumbnailUrl} alt=""
                    //              width={width ? width + "px" : ""}/>
                    //         :
                    //         <img src={thumbnailUrl} alt=""
                    //              height={height ? height + "px" : ""}/>
                    // )
                }
            </figure>
        )
    }

    componentDidMount() {
        const {document} = this.props;

        this.assure(FileAPI.downloadDocument(document))
            .then(blob => {
                const url = FileAPI.getUrl(blob);

                this.setState({
                    isLoading: false,
                    url: url,
                });
            })
    }

    onMouseOver = e => {
        if (this.props.playOnHover) {
            this.state.isHovered = true;
            e.target.play();
        }
    }

    onMouseOut = e => {
        if (this.props.playOnHover) {
            this.state.isHovered = false;
            e.target.pause();
        }
    }

    onEnded = e => {
        if (this.state.isHovered) {
            e.target.play();
        }
    }
}

export default BetterVideoComponent;