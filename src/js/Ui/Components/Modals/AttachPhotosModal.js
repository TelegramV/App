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
import {Layouter} from "../../Utils/layout";
import VUI from "../../VUI"

class GalleryFragment extends VComponent {
    render() {
        return <div className={["grouped", Layouter.getClass(this.props.blobs.length)]}>
            {this.props.blobs.map(l => {
                return <figure>
                    <img src={l}/>
                </figure>
            })}
        </div>
    }

    addPhoto(blob) {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.forceUpdate()
    }

    getMedia() {
        return Promise.all(this.props.blobs.map(async l => {
            return await FileAPI.uploadPhoto(await fetch(l).then(r => r.arrayBuffer()), "lol.jpg")
        }))
    }
}

export class AttachPhotosModal extends VComponent {
    captionRef = VComponent.createComponentRef()
    galleryRef = VComponent.createComponentRef()

    render() {
        return <div>
            <ModalHeaderFragment title="Send Photos" close actionText="Send" action={this.send.bind(this)}/>
            <div className="padded">
                <GalleryFragment ref={this.galleryRef} blobs={this.props.media}/>
                <InputComponent ref={this.captionRef} label="Caption"/>
            </div>
        </div>
    }

    addPhoto(blob) {
        this.galleryRef.component.addPhoto(blob)
    }

    async send() {
        VUI.Modal.close()
        const media = await this.galleryRef.component.getMedia()
        AppSelectedChat.Current.api.sendMessage({
            text: this.captionRef.component.getValue(),
            media: media
        })
    }
}