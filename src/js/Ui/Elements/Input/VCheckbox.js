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

function VCheckbox(
    {
        label = "",
        checked,
        input,
        onClick,
        circle = false
    }
) {
    return (
        <div className={{"checkbox-input": true, circle}} onClick={input || onClick}>
            <input type="checkbox" checked={valIf(checked, true)}/>

            <div className="checkmark">
                <span className="tgico tgico-check"/>
            </div>

            {label && <span className="checkbox-label">{label}</span>}
        </div>
    )
}

export default VCheckbox