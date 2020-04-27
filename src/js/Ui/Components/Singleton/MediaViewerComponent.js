/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {PhotoMessage} from "../../../Api/Messages/Objects/PhotoMessage";
import VComponent from "../../../V/VRDOM/component/VComponent";
import UIEvents from "../../EventBus/UIEvents";
import type {AE} from "../../../V/VRDOM/component/__component_registerAppEvents";
import {VideoMessage} from "../../../Api/Messages/Objects/VideoMessage";
import AvatarFragment from "../Basic/AvatarFragment";
import {Photo} from "../../../Api/Media/Photo";
import SearchManager from "../../../Api/Search/SearchManager"
import {MessageFactory} from "../../../Api/Messages/MessageFactory"
import VSpinner from "../Elements/VSpinner"
import FileManager from "../../../Api/Files/FileManager"
import {DocumentMessagesTool} from "../../Utils/document"
import AppSelectedInfoPeer from "../../Reactive/SelectedInfoPeer"

function MediaSpinnerFragment({icon}) {
    return <VSpinner white>
        {/*<i renderIf={icon}*/}
        {/*   css-font-size="15pt"*/}
        {/*   css-opacity="50%"*/}
        {/*   class={`tgico tgico-${icon}`}/>*/}
    </VSpinner>
}

function MediaFragment({media, zoom, hidden}) {
    if (hidden) {
        return <div/>
    }

    const horizon = media && media.maxWidth && media.maxHeight && media.maxWidth < media.maxHeight

    let style = {
        "max-width": zoom ? "100vw" : "60vw",
        "max-height": zoom ? "100vh" : "80vh",
        "transition": "150ms all linear",
        "cursor": zoom ? "zoom-out" : "zoom-in",
    };

    if (zoom) {
        if (horizon) {
            style["height"] = "100vh"
        } else {
            style["width"] = "100vw"
        }
    }

    if (media instanceof PhotoMessage) {
        if (!media.loaded) {
            return <MediaSpinnerFragment icon="photo"/>
        }

        return <img style={style} src={media.srcUrl} alt=""/>
    }
    if (media instanceof VideoMessage) {
        if (!media.loaded) {
            return <MediaSpinnerFragment icon="camera"/>
        }

        return <video style={style} controls src={media.videoUrl}/>
    }
    if (media instanceof Photo) {
        if (!media.loaded) {
            return <MediaSpinnerFragment icon="photo"/>
        }

        return <img style={style} src={media.srcUrl} alt=""/>
    }
    if (!media || !media.loaded) {
        return <MediaSpinnerFragment/>
    }
    return <div/>
}

function NavigationButtonFragment({isNext, hidden, onClick}) {
    return <div className={{
        "navigation": true,
        "prev": !isNext,
        "next": isNext,
        "tgico-up": true,
        "rp": true,
        "hidden": hidden
    }} onClick={!hidden ? onClick : e => e.stopPropagation()}/>
}

export class MediaViewerComponent extends VComponent {
    state = {
        hidden: true,
        peer: null,
        messages: [],
        message: null,
        hasLeftPage: true,
        hasRightPage: true,
        isLoadingLeftPage: false,
        isLoadingRightPage: false,
        zoom: false,
    };

    defaultState = {...this.state};

    appEvents(E: AE) {
        E.bus(UIEvents.MediaViewer)
            .on("showMessage", this.showMessage)
            .on("showAvatar", this.showAvatar);
    }

    render() {
        const {message, hidden, isLoadingLeftPage, isLoadingRightPage, zoom} = this.state;

        const isLoadingPage = isLoadingLeftPage || isLoadingRightPage;

        let from, name, text, date;

        if (message) {
            from = message.from;
            name = from.name;
            text = message.text;
            date = message.date;
        }

        return (
            <div className={["media-viewer-wrapper", hidden ? "hidden" : ""]}>
                <div className="media-viewer" onClick={this.close}>
                    <NavigationButtonFragment onClick={this.left} hidden={!this.hasLeft() && !isLoadingPage}/>
                    <div className="header">
                        <div className="left" onClick={event => {
                            event.stopPropagation();
                            AppSelectedInfoPeer.select(message.from);
                            this.close(event);
                        }}>
                            <AvatarFragment peer={from}/>
                            <div className="text">
                                <div className="name">{name}</div>
                                <div className="time">{this.formatDate(date)}</div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="tgico tgico-delete rp rps" onClick={event => {
                                event.stopPropagation();
                            }}/>
                            <i className="tgico tgico-forward rp rps" onClick={event => {
                                event.stopPropagation();
                            }}/>
                            <i style={{
                                "cursor": !this.state.message || !this.state.message.loaded ? "default" : "pointer",
                            }} className="tgico tgico-download rp rps" onClick={event => {
                                event.stopPropagation();

                                if (!this.state.message || !this.state.message.loaded) {
                                    return;
                                }

                                let pfn = message.srcUrl.split("/");
                                pfn = pfn[pfn.length - 1];
                                const f = message.raw.media.photo || message.raw.media.video || message.raw.media.document || {};
                                FileManager.saveBlobUrlOnPc(
                                    message.srcUrl,
                                    DocumentMessagesTool.getFilename(f.attributes, pfn)
                                )
                            }}/>
                            <i className="tgico tgico-close rp rps"/>
                        </div>
                    </div>
                    <div className="media" onClick={this.onAuxClick}>
                        <MediaFragment media={message} zoom={zoom} hidden={hidden}/>
                    </div>
                    <div className="caption">{text}</div>
                    <NavigationButtonFragment onClick={this.right} isNext hidden={!this.hasRight() && !isLoadingPage}/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = event => {
        if (!this.state.hidden) {
            event.stopPropagation();

            const code = event.keyCode || event.which;

            if (code === 39) {
                this.right(event);
            } else if (code === 37) {
                this.left(event);
            } else if (code === 27) {
                this.close(event);
            }
        }
    }

    onAuxClick = event => {
        if (!this.state.hidden) {
            event.stopPropagation();

            if (event.which === 1) {
                this.zoom(event);
            }
        }
    }

    showMessage = ({message}) => {
        this.state = {...this.defaultState};

        console.log("show message")

        this.state.peer = message.to;
        this.state.messages = [message];

        this.downloadLeftPage();
        this.downloadRightPage();

        this.setState({
            hidden: false,
            message,
        })
    }

    downloadLeftPage = () => {
        if (!this.state.hasLeftPage || this.state.isLoadingLeftPage) {
            return Promise.resolve();
        }

        const limit = 10;
        const message = this.state.messages[0];

        this.setState({
            isLoadingLeftPage: true,
            zoom: false,
        })

        return SearchManager.searchMessages(message.to, {
            offsetId: message.id,
            filter: {
                _: "inputMessagesFilterPhotoVideo"
            },
            limit: limit,
        }).then(Messages => {
            if (Messages._peer !== this.state.peer) {
                return;
            }

            const messages = [
                ...Messages.messages.map(message => MessageFactory.fromRaw(message.to, message)).reverse(),
                ...this.state.messages
            ];

            if (Messages.current_count < limit) {
                this.setState({
                    messages,
                    hasLeftPage: false,
                    isLoadingLeftPage: false,
                    zoom: false,
                })
            } else {
                this.setState({
                    messages,
                    hasLeftPage: true,
                    isLoadingLeftPage: false,
                    zoom: false,
                })
            }

            // console.log(this.state.messages);
        });
    }

    downloadRightPage = () => {
        if (!this.state.hasRightPage || this.state.isLoadingRightPage) {
            return Promise.resolve();
        }

        const limit = 10;
        const message = this.state.messages[this.state.messages.length - 1];

        this.setState({
            isLoadingRightPage: true,
            zoom: false,
        })

        return SearchManager.searchMessages(message.to, {
            offsetId: message.id,
            filter: {
                _: "inputMessagesFilterPhotoVideo"
            },
            limit: limit,
            addOffset: -(limit + 1)
        }).then(Messages => {
            if (Messages._peer !== this.state.peer) {
                return;
            }

            const messages = [
                ...this.state.messages,
                ...Messages.messages.map(message => MessageFactory.fromRaw(message.to, message)).reverse(),
            ];

            if (Messages.current_count < limit) {
                this.setState({
                    messages,
                    hasRightPage: false,
                    isLoadingRightPage: false,
                    zoom: false,
                })
            } else {
                this.setState({
                    messages,
                    hasRightPage: true,
                    isLoadingRightPage: false,
                    zoom: false,
                })
            }

            // console.log(this.state.messages);
        });
    }

    hasLeft = () => {
        return this.state.messages[0] !== this.state.message;
    }

    left = event => {
        event.stopPropagation();

        if (!this.hasLeft()) {
            return;
        }

        const index = this.state.messages.findIndex(m => m === this.state.message);

        if (index <= 5) {
            this.downloadLeftPage();
        }

        console.log("left", index)

        if (index > 0) {
            const leftMessage = this.state.messages[index - 1];

            this.setState({
                message: leftMessage,
                zoom: false,
            })

            if (!leftMessage.loaded && !leftMessage.loading) {
                (leftMessage instanceof VideoMessage ? leftMessage.fetchFullVideo() : leftMessage.fetchMax())
                    .then(() => {
                        if (this.state.message === leftMessage) {
                            this.forceUpdate();
                        }
                    })
            }
        }
    }

    hasRight = () => {
        return this.state.messages[this.state.messages.length - 1] !== this.state.message;
    }

    right = event => {
        event.stopPropagation();

        if (!this.hasRight()) {
            return;
        }

        const index = this.state.messages.findIndex(m => m === this.state.message);
        console.log("right", index)

        if (index >= this.state.messages.length - 5) {
            this.downloadRightPage();
        }

        if (index > -1 && index < this.state.messages.length) {
            const rightMessage = this.state.messages[index + 1];

            this.setState({
                message: rightMessage,
                zoom: false,
            })

            if (!rightMessage.loaded && !rightMessage.loading) {
                (rightMessage instanceof VideoMessage ? rightMessage.fetchFullVideo() : rightMessage.fetchMax())
                    .then(() => {
                        if (this.state.message === rightMessage) {
                            this.forceUpdate();
                        }
                    })
            }
        }
    }

    formatDate(date) {
        return new Date(date * 1000).toLocaleString("en", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    close = (event) => {
        event.stopPropagation();

        this.setState({...this.defaultState})
    }

    zoom = (event) => {
        event.stopPropagation();
        console.log("zoom")

        this.setState({zoom: !this.state.zoom});
    }
}

export default MediaViewerComponent