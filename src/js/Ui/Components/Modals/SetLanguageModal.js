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

import { ModalHeaderFragment } from "./ModalHeaderFragment";
import TranslatableStatefulComponent from "../../../V/VRDOM/component/TranslatableStatefulComponent"
import VButton from "../../Elements/Button/VButton"
import Locale from "../../../Api/Localization/Locale"
import VUI from "../../VUI"
import "./SetLanguageModal.scss"

export class SetLanguageModal extends TranslatableStatefulComponent {

    state = {
        langInfo: null
    }

    render({code}, {langInfo}) {
        const key = langInfo?.official ? "lng_language_switch_about_official" : "lng_language_switch_about_unofficial";
        return <div className="set-language">
            <ModalHeaderFragment title={this.l("lng_language_switch_title")} close/>
            <div class="container scrollable">
                {!langInfo 
                    ? 
                    this.l("lng_profile_loading")
                    :
                    this.l(key, {
                        lang_name: langInfo.name,
                        percent: Math.round(langInfo.translated_count/langInfo.strings_count*100),
                        link: <a href={langInfo.translations_url} target="_blank">{this.l("lng_language_switch_link")}</a>
                    })}
            </div>
            <div class="buttons">
                <VButton isFlat isUppercase onClick={VUI.Modal.close}>{this.l("lng_cancel")}</VButton>
                <VButton isFlat isUppercase onClick={() => Locale.setLanguage(code)}>{this.l("lng_language_switch_apply")}</VButton>
            </div>
        </div>
    }

    componentDidMount() {
        Locale.getLanguageInfo(this.props.code).then(info => {
            this.setState({
                langInfo: info
            })
        })
    }
}