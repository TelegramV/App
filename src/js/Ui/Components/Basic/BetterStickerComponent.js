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
import {isBullshitBrowser} from "../../Utils/utils"
import WebpHelper from "../../Utils/WebpHelper"

// probably patch-compatible
class BetterStickerComponent extends StatefulComponent {
    state = {
        isAnimated: false,
        animationDataUrl: null,
        animationData: null,
        showAnimation: !this.props.hideAnimated,
        url: null,
        thumbUrl: null,
        isDownloading: false,
    }

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => FileManager.checkEvent(event, this.props.document))
            .on("download.start", this.onDownloadStart)
            .on("download.done", this.onDownloadDone)

        E.bus(AppEvents.Files)
            .filter(event => FileManager.checkEvent(event, this.props.document, this.props.document.thumbs[0]))
            .on("download.done", this.onAnimatedThumbDownloadDone)
    }

    render(props, state) {
        const sizeAttr = props.document.attributes.find(attr => attr._ === "documentAttributeImageSize");

        const width = props.width || 250;
        const height = props.height || (sizeAttr ? sizeAttr.h / sizeAttr.w * width : width);


        if ((!state.thumbUrl || state.showAnimation) && state.isAnimated) {
            const options = {
                path: state.animationDataUrl,
                loop: props.loop ?? false,
                autoplay: props.autoplay ?? false,
                // rendererSettings: {
                // preserveAspectRatio: "xMinYMin slice", // Supports the same options as the svg element's preserveAspectRatio property
                // clearCanvas: false,
                // progressiveLoad: true, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
                // hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
                // className: "lottie-svg"
                // }
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
                            isPaused={isPaused}
                            eventListeners={[
                                {
                                    eventName: "complete",
                                    callback: this.onAnimationStop
                                }
                            ]}
                    />
                </div>
            )
        } else {
            return (
                <div id={props.id}
                     class="sticker"
                     onClick={props.onClick}
                     onMouseOver={this.onMouseOver}>
                    <img class="loading"
                         src={state.url || state.thumbUrl}
                         css-width={`${width}px`}
                         css-height={`${height}px`}
                         alt="Sticker"/>
                </div>
            )
        }
    }

    componentWillMount({document, isFull}) {
        const isAnimated = this.props.isAnimated != null ? this.props.isAnimated : document.mime_type === "application/x-tgsticker";
        const thumb = isAnimated || isFull ? "" : document.thumbs && document.thumbs.length ? document.thumbs[0] : "";

        const bytesThumb = FileAPI.getAnimatedStickerThumbnail(document)

        this.setState({
            isDownloading: true,
            isAnimated,
            thumbUrl: bytesThumb || FileManager.getUrl(document, document.thumbs[0])
        });

        if (!bytesThumb) {
            FileManager.downloadDocument(document, document.thumbs[0]);
        }

        FileManager.downloadDocument(document, thumb);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.document.id !== this.props.document.id) {
            const {document, isFull} = nextProps;
            const isAnimated = nextProps.isAnimated ?? document.mime_type === "application/x-tgsticker";
            const thumb = isAnimated || isFull ? "" : document.thumbs && document.thumbs.length ? document.thumbs[0] : "";
            const bytesThumb = FileAPI.getAnimatedStickerThumbnail(document)

            nextState.isDownloading = true;
            nextState.isAnimated = isAnimated;
            nextState.thumbUrl = bytesThumb || FileManager.getUrl(document, document.thumbs[0]);

            if (!bytesThumb) {
                FileManager.downloadDocument(document, document.thumbs[0]);
            }

            FileManager.downloadDocument(document, thumb);
        }
    }

    onMouseOver = () => {
        if (this.props.hideAnimated) {
            this.setState({
                showAnimation: true,
            });
        }
    }

    onAnimationStop = () => {
        if (this.props.hideAnimated) {
            this.setState({
                showAnimation: false,
            });
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
                const blob = new Blob([JSON.stringify(json)], {
                    type: "application/json",
                });

                const url = URL.createObjectURL(blob);

                this.setState({
                    animationData: json,
                    animationDataUrl: url,
                    isDownloading: false,
                });
            });
        } else {
            if(WebpHelper.shouldConvert()) {
                WebpHelper.convertToPng(event.blob).then(url => {
                    this.setState({
                        url: url,
                        isDownloading: false,
                    })
                })   
            } else {
                this.setState({
                    url: event.url,
                    isDownloading: false,
                });
            }
        }
    }

    onAnimatedThumbDownloadDone = (event) => {
        if(WebpHelper.shouldConvert()) {
            WebpHelper.convertToPng(event.blob).then(url => {
                this.setState({
                    thumbUrl: url
                })
            })
        } else {
            this.setState({
                thumbUrl: event.url,
            });
        }
    }
}

export default BetterStickerComponent;