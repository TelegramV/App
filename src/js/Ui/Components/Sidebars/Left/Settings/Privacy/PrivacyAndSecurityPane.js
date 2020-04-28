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

import SettingsPane from "../SettingsPane"
import {SectionFragment} from "../../../Fragments/SectionFragment"
import ButtonWithIconAndDescriptionFragment from "../../../Fragments/ButtonWithIconAndDescriptionFragment"

class PrivacyAndSecurityPane extends SettingsPane {
    barName = "privacy-security";
    name = "Privacy and Security";

    render() {
        return (
            <div class="sidebar sub-settings edit-page-pane scrollable">
                {this.makeHeader(false)}

                <SectionFragment>
                    <ButtonWithIconAndDescriptionFragment name="Blocked Users"
                                                          icon="deleteuser"
                                                          description="6 users"/>
                </SectionFragment>

                <SectionFragment title="Privacy">

                </SectionFragment>
            </div>
        );
    }
}

export default PrivacyAndSecurityPane;