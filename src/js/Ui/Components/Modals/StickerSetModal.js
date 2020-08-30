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
import TranslatableStatefulComponent from "../../../V/VRDOM/component/TranslatableStatefulComponent"
import BetterStickerComponent from "../Basic/BetterStickerComponent"
import VButton from "../../Elements/Button/VButton"
import StickersState from "../../SharedStates/StickersState"
import {StickerManager} from "../../../Api/Stickers/StickersManager"
import VUI from "../../VUI"
import "./StickerSetModal.scss"
import {IS_MOBILE_SCREEN} from "../../../Utils/browser"

export class StickerSetModal extends TranslatableStatefulComponent {

    state = StickersState

    stickerProps = IS_MOBILE_SCREEN ? {} : {
        autoplay: true,
        loop: true,
        paused: false,
        playOnHover: false,
        hideAnimated: false
    }

    render(props) {
        return <div className="sticker-set">
            <ModalHeaderFragment title={props.set.set?.title ?? "Loading..."} close/>
            <div class="scrollable">
                <div class="container">
                    {props.set?.documents?.map(sticker => <BetterStickerComponent width={75} document={sticker}
                                                                                  hideAnimated {...this.stickerProps}/>)}
                </div>
            </div>
            <div class="add">
                <SetButton set={props.set} installed={this.state.contains(props.set.set)}/>
            </div>
        </div>
    }

    componentDidMount() {
        // TODO: catch if set is invalid
        if (!this.props.set.isFetched) {
            this.props.set.getStickerSet().then(set => {
                this.forceUpdate();
            }).catch(ex => {
                VUI.Modal.popup(this.l("lng_stickers_not_found"));
            })
        }
    }
}

const SetButton = ({set, installed}) => {
    if (!set || !set.isFetched) {
        return <VButton isUppercase={false}>Loading...</VButton>
    } else {
        if (installed) {
            return <VButton isUppercase={false} isFlat={true} onClick={_ => StickerManager.uninstallStickerSet(set)}>Remove
                stickers</VButton>
        } else {
            return <VButton isUppercase={false}
                            onClick={_ => StickerManager.installStickerSet(set)}>Add {set.set.count} stickers</VButton>
        }
    }
}