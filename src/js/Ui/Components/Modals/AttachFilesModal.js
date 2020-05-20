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

import VComponent from "../../../V/VRDOM/component/VComponent";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import {InputComponent} from "../Elements/InputComponent";
import AppSelectedChat from "../../Reactive/SelectedChat";
import {FileAPI} from "../../../Api/Files/FileAPI";
import {DocumentMessagesTool} from "../../Utils/document";
import VUI from "../../VUI"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

class FileListFragment extends StatelessComponent {
    render() {
        return <div className="file-list">
            {this.props.blobs.map(l => {
                let title = l.file.name
                let ext = title.split(".")[title.split(".").length - 1]
                let size = DocumentMessagesTool.formatSize(l.file.size)

                let color = DocumentMessagesTool.getColor(ext)
                let icon = (
                    <div class="svg-wrapper">
                        {DocumentMessagesTool.createIcon(color)}
                        <div class="extension">{ext}</div>
                    </div>
                )
                return <div className="card">
                    <div className="card-icon">
                        {icon}
                    </div>
                    <div className="card-info">
                        <div className="title">
                            {title}
                        </div>
                        <div className="description">
                            {size}
                        </div>
                    </div>
                </div>
            })}
        </div>
    }

    addFile = (blob) => {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.forceUpdate()
    }

    getMedia = () => {
        return Promise.all(this.props.blobs.map(async l => {
            return await FileAPI.uploadDocument(await fetch(l.blob).then(r => r.arrayBuffer()), l.file.name)
        }))
    }
}

export class AttachFilesModal extends StatelessComponent {
    captionRef = VComponent.createComponentRef()
    fileListRef = VComponent.createComponentRef()

    render() {
        return <div className="attach-files-modal">
            <ModalHeaderFragment title="Send Files" close actionText="Send" action={this.send.bind(this)}/>
            <div className="padded">
                <FileListFragment ref={this.fileListRef} blobs={this.props.media}/>
                <InputComponent ref={this.captionRef} label="Add a caption..."/>
            </div>
        </div>
    }

    addFile = (blob, file) => {
        this.fileListRef.component.addFile({
            blob: blob,
            file: file
        })
    }

    async send() {
        VUI.Modal.close()
        const media = await this.fileListRef.component.getMedia()
        media.forEach(l => {
            AppSelectedChat.Current.api.sendMessage({
                text: this.captionRef.component.getValue(),
                media: l
            })
        })
    }
}