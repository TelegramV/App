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

import {ModalHeaderFragment} from "./ModalHeaderFragment";
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import VButton from "../../Elements/Button/VButton"
import VUI from "../../VUI"
import {askForFile} from "../../Utils/utils"
import "./AvatarUploadModal.scss"

export default class AvatarUploadModal extends StatelessComponent {
    render(props) {
        return <div className="avatar-upload-modal scrollable">
            <ModalHeaderFragment title="Upload avatar" close/>
            <div class="cropper">
            </div>
            <div class="footer">
	            <div className="done-button rp" onClick={this.onCroppieDone}>
	                <i className="tgico tgico-check"/>
	            </div>
            </div>
        </div>
    }

    componentDidMount() {
	    import("croppie").then(croppie => {
	        const Croppie = croppie.default;

	        askForFile("image/*", buffer => {
	            const url = URL.createObjectURL(new Blob([buffer]));
	            this.cropper = new Croppie(this.$el.querySelector(".cropper"), {
                    enableExif: true,
                    showZoomer: false,
                    viewport: {
                        width: 310,
                        height: 310,
                        type: "circle",
                    },
                    boundary: {
                        width: 350,
                        height: 350,
                    },
                    url,
                });
	        }, true)
	    })
    }

    onCroppieDone = () => {
        this.cropper?.result({
            type: "blob",
            size: "original",
            format: "jpeg",
            circle: false
        }).then((blob) => {
            const url = URL.createObjectURL(blob);

            if(this.props.onDone) {
            	this.props.onDone(blob, url);
            }

            VUI.Modal.close();
        });
    }
}