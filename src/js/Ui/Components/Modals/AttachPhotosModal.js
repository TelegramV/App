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
import AppSelectedChat from "../../Reactive/SelectedChat";
import {FileAPI} from "../../../Api/Files/FileAPI";
import {Layouter} from "../../Utils/layout";
import VUI from "../../VUI"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import VInput from "../../Elements/Input/VInput"
import UIEvents from "../../EventBus/UIEvents"

class GalleryFragment extends StatelessComponent {
    render() {
        return <div className={["grouped", Layouter.getClass(this.props.blobs.length)]}>
            {this.props.blobs.map(l => {
                return <figure>
                    <img src={l}/>
                </figure>
            })}
        </div>
    }

    addPhoto = (blob) => {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.forceUpdate()
    }

    getMedia = async () => {
        const a = []
        let i = 0
        for(let l of this.props.blobs) {
            // TODO: somehow get actual name
            a.push(await FileAPI.uploadPhoto(await fetch(l).then(r => r.arrayBuffer()), `photo${i++}.jpg`))
        }
        return a
        // return Promise.all(this.props.blobs.map(async l => {
        //     console.log("uploading")
        //     return await FileAPI.uploadPhoto(await fetch(l).then(r => r.arrayBuffer()), "telegramweb.jpg") // TODO: somehow get actual name
        // }))
    }
}

export class AttachPhotosModal extends StatelessComponent {
    captionRef = VComponent.createFragmentRef()
    galleryRef = VComponent.createComponentRef()

    appEvents(E) {
        E.bus(UIEvents.General)
        .on("upload.addPhoto", this.addPhoto)
    }

    render(props) {
        return <div className="attach-modal">
            <ModalHeaderFragment title="Send Photos" close actionText="Send" action={this.send.bind(this)}/>
            <div className="padded">
                <GalleryFragment ref={this.galleryRef} blobs={props.media}/>
                <VInput ref={this.captionRef} label="Caption"/>
            </div>
        </div>
    }

    componentDidMount() {
        this.captionRef.$el.querySelector("input").focus();
    }

    addPhoto = ({blob}) => {
        this.galleryRef.component.addPhoto(blob)
    }

    async send() {
        const media = await this.galleryRef.component.getMedia()
        // console.log(media)
        const caption = this.captionRef.$el.querySelector("input").value.repeat(1); //force string clone
        VUI.Modal.close()

        AppSelectedChat.current.api.sendMessage({
            text: caption,
            media: media
        })

        // SENDS PHOTO AS STICKER
        // MUST BE .WEBP and should have 512px side
        /*let file = await fetch(this.galleryRef.component.props.blobs[0]).then(r => r.arrayBuffer());
        FileAPI.uploadDocument(file, "sticker", {
            mime_type: "image/webp",
            attributes: [
                {
                    "_": "documentAttributeSticker",
                    alt: "",
                    stickerset: {
                        _: "inputStickerSetEmpty"
                    }
                }
            ]
        }).then( media => {
            console.log("Sending", media)
            AppSelectedChat.current.api.sendRawMedia(media)
        })*/
        
        
    }
}