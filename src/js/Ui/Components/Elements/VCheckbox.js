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

import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import valIf from "../../../V/VRDOM/jsx/helpers/valIf"

function VCheckbox(
    {
        label = "",
        checked,
        input
    }
) {
    return (
        <div className="checkbox-input">
            <label onInput={input}>
                <input type="checkbox" checked={valIf(checked, true)}/>

                <span className="checkmark">
                    <span className="tgico tgico-check"/>
                </span>

                {nodeIf(<span className="checkbox-label">{label}</span>, label)}
            </label>
        </div>
    )
}

export default VCheckbox