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
import FileManager from "../../../Api/Files/FileManager"
import AppEvents from "../../../Api/EventBus/AppEvents"

// probably patch-compatible
class BetterStickerComponent extends StatefulComponent {
    state = {
        isAnimated: false,
        animationData: null,
        url: null,
        thumbUrl: null,
        isDownloading: false,
    }

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.document.id)
            .on("download.start", this.onDownloadStart)
            .on("download.done", this.onDownloadDone)
    }

    render(props, state) {
        const sizeAttr = props.document.attributes.find(attr => attr._ === "documentAttributeImageSize");

        const width = props.width || 250;
        const height = props.height || (sizeAttr ? sizeAttr.h / sizeAttr.w * width : width);

        if (state.isAnimated) {
            const options = {
                animationData: state.animationData,
                loop: props.loop ?? false,
                autoplay: props.autoplay ?? false,
            };

            const playOnHover = props.playOnHover ?? true;
            const isPaused = props.paused ?? true;

            return (
                <div id={props.id}
                     class="sticker rp rps"
                     onClick={props.onClick}>
                    <Lottie width={width}
                            height={height}
                            options={options}
                            playOnHover={playOnHover}
                            isPaused={isPaused}/>
                </div>
            )
        } else {
            return (
                <div id={props.id}
                     class="sticker"
                     onClick={props.onClick}>
                    <img class="loading"
                         src={state.url || state.thumbUrl}
                         css-width={`${width}px`}
                         css-height={`${height}px`}/>
                </div>
            )
        }
    }

    componentWillMount({document, isFull}) {
        const isAnimated = this.props.isAnimated != null ? this.props.isAnimated : document.mime_type === "application/x-tgsticker";
        const thumb = isAnimated || isFull ? "" : document.thumbs && document.thumbs.length ? document.thumbs[0] : "";

        this.setState({
            isDownloading: true,
            isAnimated,
        });

        FileManager.downloadDocument(document, thumb);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.document.id !== this.props.document.id) {
            const {document, isFull} = nextProps;
            const isAnimated = nextProps.isAnimated ?? document.mime_type === "application/x-tgsticker";
            const thumb = isAnimated || isFull ? "" : document.thumbs && document.thumbs.length ? document.thumbs[0] : "";

            nextState.isDownloading = true;
            nextState.isAnimated = isAnimated;

            FileManager.downloadDocument(document, thumb);
        }
    }

    onDownloadStart = () => {
        this.setState({
            isDownloading: true,
        });
    }

    onDownloadDone = event => {
        if (this.state.isAnimated) {
            this.assure(FileAPI.decodeAnimatedSticker(event.blob)).then(json => {
                this.setState({
                    animationData: json,
                    isDownloading: false,
                });
            });
        } else {
            this.setState({
                url: FileAPI.getUrl(event.blob),
                isDownloading: false,
            });
        }
    }
}

export default BetterStickerComponent;