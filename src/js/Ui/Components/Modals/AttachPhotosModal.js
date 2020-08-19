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
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import VInput from "../../Elements/Input/VInput"
import VCheckbox from "../../Elements/Input/VCheckbox"
import UIEvents from "../../EventBus/UIEvents"
import WebpHelper from "../../Utils/WebpHelper"

class GalleryFragment extends StatelessComponent {
    render() {
        return <div className={["grouped", Layouter.getClass(this.props.blobs.length)]}>
            {this.props.blobs.map(this.makeFigure)}
        </div>
    }

    makeFigure = (blob) => {
        if(this.isVideo(blob)) { 
            return <figure>
                    <video controls src={URL.createObjectURL(blob)}/>
                </figure>
        } else {
            return <figure>
                    <img src={URL.createObjectURL(blob)}/>
                </figure>
        }
    }

    isVideo = (blob) => {
        return blob.type.includes("video"); // TODO better testing for other video formats
    }

    addMedia = (blob) => {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.forceUpdate()
    }

    getMedia = async () => {
        const a = []
        let i = 0
        for(let l of this.props.blobs) {
            let file;
            // I don't think it's good to assume that all videos are mp4 and images are jpeg
            if(this.isVideo(l)) {
                file = FileAPI.uploadDocument(await l.arrayBuffer(), `video${i++}.mp4`, {
                    mime_type: l.type
                })
            } else {
                file = FileAPI.uploadPhoto(await l.arrayBuffer(), `photo${i++}.jpg`)
            }
            a.push(await file);
        }
        return a
    }
}

export class AttachPhotosModal extends StatefulComponent {
    captionRef = VComponent.createFragmentRef()
    galleryRef = VComponent.createComponentRef()

    state = {
        asSticker: false
    }

    appEvents(E) {
        E.bus(UIEvents.General)
        .on("upload.addMedia", this.addMedia)
    }

    render(props) {
        return <div className="attach-modal">
            <ModalHeaderFragment title="Send Media" close actionText="Send" action={this.send}/>
            <div className="padded">
                <GalleryFragment ref={this.galleryRef} blobs={props.media}/>
                <VInput ref={this.captionRef} label="Caption"/>
                {/*<VCheckbox label="As sticker" checked={this.state.asSticker} onClick={() => {this.setState({asSticker: true})}}/>*/}
            </div>
        </div>
    }

    componentDidMount() {
        this.captionRef.$el.querySelector("input").focus();
    }

    addMedia = ({blob}) => {
        this.galleryRef.component.addMedia(blob)
    }

    send = async () => {
        const media = await this.galleryRef.component.getMedia();
        // console.log(media)
        const caption = this.captionRef.$el.querySelector("input").value.repeat(1); //force string clone
        VUI.Modal.close()

        /*if(this.state.asSticker) {
            this.sendAsSticker();
        } else {*/
        AppSelectedChat.current.api.sendMessage({
            text: caption,
            media: media
        })
        //}
    }

    // disabled, waiting for ios 14...
    async sendAsSticker() {
        for(let l of this.galleryRef.component.props.blobs) {
            let file = await WebpHelper.makeSticker(l).then(blob => blob.arrayBuffer());
            FileAPI.uploadDocument(file, "sticker.webp", {
                mime_type: "image/webp",
                attributes: [
                    {
                        _: "documentAttributeSticker",
                        alt: "",
                        stickerset: {
                            _: "inputStickerSetEmpty"
                        }
                    }
                ]
            }).then( media => {
                AppSelectedChat.current.api.sendRawMedia(media)
            })
        }
    }
}