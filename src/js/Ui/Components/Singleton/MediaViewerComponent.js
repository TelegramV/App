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

import ChatInfoAvatarComponent from "../Columns/Chat/ChatInfo/ChatInfoAvatarComponent";
import {PhotoMessage} from "../../../Api/Messages/Objects/PhotoMessage";
import VUI from "../../VUI"
import SingletonComponent from "../../../V/VRDOM/component/SingletonComponent"

export class MediaViewerComponent extends SingletonComponent {

    state = {
        hidden: true,
    }

    init() {
        VUI.MediaViewer = this
    }

    render() {
        return (
            <div className={["media-viewer-wrapper", this.state.hidden ? "hidden" : ""]}>
                {this.state.message ?
                    <div className="media-viewer" onClick={this.close}>
                        <div className="header">
                            <div className="left">
                                <ChatInfoAvatarComponent/>
                                <div className="text">
                                    <div className="name">{this.state.message.from.name}</div>
                                    <div className="time">{this.state.message.getDate("en", {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</div>
                                </div>
                            </div>
                            <div className="right">
                                <i className="tgico tgico-delete rp rps"></i>
                                <i className="tgico tgico-forward rp rps"></i>
                                <i className="tgico tgico-download rp rps"></i>
                                <i className="tgico tgico-close rp rps"></i>
                            </div>
                        </div>
                        <div className="media">
                            <img src={this.state.message.srcUrl} alt=""/>
                        </div>
                        <div className="caption">{this.state.message.text}</div>
                    </div>
                    : null}
            </div>
        )
    }

    close = () => {
        this.setState({
            hidden: true
        })
    }

    open = (message) => {
        if (message instanceof PhotoMessage && !message.loaded) {
            message.fetchMax().then(l => this.forceUpdate())
        }
        this.setState({
            hidden: false,
            message: message
        })
    }
}

export default MediaViewerComponent