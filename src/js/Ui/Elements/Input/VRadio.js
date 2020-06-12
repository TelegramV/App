/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import valIf from "../../../V/VRDOM/jsx/helpers/valIf"

function VRadio(
    {
        label,
        checked,
        name,
        input
    }
) {
    return (
        <div className="radio-input">
            <label>
                <input type="radio"
                       name={name}
                       onInput={input}
                       checked={valIf(checked, true)}/>

                {nodeIf(<span className="radio-label">{label}</span>, label)}
            </label>
        </div>
    )
}

export default VRadio;