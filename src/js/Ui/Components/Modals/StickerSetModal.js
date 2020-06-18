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
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import BetterStickerComponent from "../Basic/BetterStickerComponent"
import VButton from "../../Elements/Button/VButton"
import "./StickerSetModal.scss"

export class StickerSetModal extends StatefulComponent {

    render(props) {
        return <div className="sticker-set">
            <ModalHeaderFragment title={props.set.set?.title ?? "Loading..."} close/>
            <div class="scrollable">
                <div class="container">
                    {props.set?.documents?.map(sticker => <BetterStickerComponent width={75} document={sticker}/>)}
                </div>
            </div>
            <div class="add">
                <VButton>{props.set.set?.count ? `Add ${props.set.set.count} stickers` : "Loading..."}</VButton>
            </div>
        </div>
    }

    componentDidMount() {
        if(!this.props.set.isFetched) {
            this.props.set.getStickerSet().then(set => {
                console.log(set);
                this.forceUpdate();
            })
        }
    }
}