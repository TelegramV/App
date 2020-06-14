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
import UIEvents from "../../EventBus/UIEvents";
import type {AE} from "../../../V/VRDOM/component/__component_appEventsBuilder";
import {VideoMessage} from "../../../Api/Messages/Objects/VideoMessage";
import AvatarFragment from "../Basic/AvatarFragment";
import SearchManager from "../../../Api/Search/SearchManager"
import {MessageFactory} from "../../../Api/Messages/MessageFactory"
import VSpinner from "../../Elements/VSpinner"
import FileManager from "../../../Api/Files/FileManager"
import {DocumentMessagesTool} from "../../Utils/document"
import AppSelectedInfoPeer from "../../Reactive/SelectedInfoPeer"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import BetterPhotoComponent from "../Basic/BetterPhotoComponent"
import StreamingVideoComponent from "../Basic/StreamingVideoComponent"

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

    const horizon = document.body.clientHeight > document.body.clientWidth

    let style = {
        "max-width": zoom ? "unset" : "60vw",
        "max-height": zoom ? "unset" : "80vh",
        "cursor": zoom ? "zoom-out" : "zoom-in",
    };

    if (zoom) {
        if (horizon) {
            style["height"] = "var(--vh100)"
            style["width"] = ""
        } else {
            style["width"] = "100vw"
            style["height"] = ""
        }
    }

    if (media instanceof PhotoMessage) {
        return <BetterPhotoComponent photo={media.raw.media.photo} calculateSize maxHeight="70%"/>
    }

    if (media instanceof VideoMessage) {
        return <StreamingVideoComponent document={media.raw.media.document} autoPlay/>
    }

    if (!media) {
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

export class MediaViewerComponent extends StatefulComponent {
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

        let downloaded = message && FileManager.isDownloaded(message.raw.media.photo || message.raw.media.document)

        if (message) {
            from = message.from;
            name = from.name;
            text = message.text;
            date = message.date;
        }

        return (
            <div css-display={this.state.hidden && "none"} className={["media-viewer-wrapper", hidden ? "hidden" : ""]}>
                <div className="media-viewer" onClick={this.close}>
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
                            {
                                nodeIf(<i className="tgico tgico-forward rp rps" onClick={event => {
                                    event.stopPropagation();
                                    UIEvents.General.fire("message.forward", {message, from: message.dialog.peer})
                                }}/>, !!message)
                            }

                            <i style={{
                                "cursor": !downloaded ? "default" : "pointer",
                            }} className="tgico tgico-download rp rps" onClick={event => {
                                event.stopPropagation();

                                if (!downloaded) {
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
                    <div class="content-wrapper">
                        <NavigationButtonFragment onClick={this.left} hidden={!this.hasLeft() && !isLoadingPage}/>
                        <div class="content">
                            <div className="media" onClick={this.onMediaClick}>
                                <MediaFragment media={message} zoom={zoom} hidden={hidden}/>
                            </div>
                            <div className="caption">{text}</div>
                        </div>
                        <NavigationButtonFragment onClick={this.right} isNext
                                                  hidden={!this.hasRight() && !isLoadingPage}/>
                    </div>
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

    onMediaClick = event => {
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

        // if (!message.loaded && !message.loading) {
        //     (message instanceof VideoMessage ? message.fetchFullVideo() : message.fetchMax())
        //         .then(() => {
        //             if (this.state.message === message) {
        //                 this.forceUpdate();
        //             }
        //         })
        // }

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
                })
            } else {
                this.setState({
                    messages,
                    hasLeftPage: true,
                    isLoadingLeftPage: false,
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
                })
            } else {
                this.setState({
                    messages,
                    hasRightPage: true,
                    isLoadingRightPage: false,
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

            // if (!leftMessage.loaded && !leftMessage.loading) {
            //     (leftMessage instanceof VideoMessage ? leftMessage.fetchFullVideo() : leftMessage.fetchMax())
            //         .then(() => {
            //             if (this.state.message === leftMessage) {
            //                 this.forceUpdate();
            //             }
            //         })
            // }
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

            // if (!rightMessage.loaded && !rightMessage.loading) {
            //     (rightMessage instanceof VideoMessage ? rightMessage.fetchFullVideo() : rightMessage.fetchMax())
            //         .then(() => {
            //             if (this.state.message === rightMessage) {
            //                 this.forceUpdate();
            //             }
            //         })
            // }
        }
    }

    formatDate(date) {
        let text = new Date().toLocaleString("en", {month: "short", day: "numeric"});
        text += " at "
        text += new Date(date * 1000).toLocaleString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
        })
        return text;
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