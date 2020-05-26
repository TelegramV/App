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

import Lottie from "../../Lottie/Lottie"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import {FileAPI} from "../../../Api/Files/FileAPI"

class BetterStickerComponent extends StatefulComponent {
    state = {
        isAnimated: false,
        animationData: null,
        thumbUrl: null,
        isDownloading: false,
    }

    init() {
        this.state.isAnimated = this.props.isAnimated != null ? this.props.isAnimated : this.props.document.mime_type === "application/x-tgsticker";
    }

    render(props, state) {
        const sizeAttr = props.document.attributes.find(attr => attr._ === "documentAttributeImageSize");

        const width = props.width || 250;
        const height = props.height || (sizeAttr ? sizeAttr.h / sizeAttr.w * width : width);

        if (state.isAnimated) {
            const options = {
                animationData: state.animationData,
                loop: false,
                autoplay: false,
            };

            return (
                <div class="sticker rp rps"
                     onClick={props.onClick}>
                    <Lottie width={width}
                            height={height}
                            isPaused={true}
                            options={options}
                            playOnHover/>
                </div>
            )
        } else {
            return (
                <div class="sticker"
                     onClick={props.onClick}>
                    <img class="loading"
                         src={state.thumbUrl}
                         css-width={`${width}px`}
                         css-height={`${height}px`}/>
                </div>
            )
        }
    }

    componentDidMount() {
        const {document, isFull} = this.props;
        const {isAnimated} = this.state;

        this.state.isDownloading = true;

        FileAPI.downloadDocument(document, isAnimated || isFull ? "" : document.thumbs && document.thumbs.length ? document.thumbs[0] : "").then(File => {
            if (!this.__.mounted) {
                return
            }

            if (isAnimated) {
                FileAPI.parseAnimatedStickerFile(File).then(json => {
                    if (!this.__.mounted) {
                        return
                    }

                    this.setState({
                        animationData: json,
                        isDownloading: false,
                    })
                })
            } else {
                this.setState({
                    thumbUrl: FileAPI.getUrl(File, document.mime_type),
                    isDownloading: false,
                });
            }
        }).finally(() => {
            this.state.isDownloading = false;
        });
    }
}

export default BetterStickerComponent;