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

// man fuck webkit
// https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider

function getGradientBackground(value, min, max) {
    const val = (value - min) / (max - min)

    return `-webkit-gradient(linear, left top, right top, 
        color-stop(${val}, var(--slider-color-fill)), 
        color-stop(${val}, var(--slider-color))
        )`
}

function onSliderChange(event) {
    const target = event.target
    target.style.background = getGradientBackground(target.value, target.min, target.max)

    // Change value
    const sibling = target.parentElement.querySelector(".value")
    if (sibling) {
        sibling.innerHTML = target.value
    }
}

function VSlider(
    {
        label,
        showValue = true,
        value = 50,
        max = 100,
        min = 0,
        step = 1,
        onInput
    }
) {
    return (
        <div className="slider-input">
            <div className="label">
                {nodeIf(<div className="text">{label}</div>, !!label)}
                {nodeIf(<div className="value">{value}</div>, !!label && showValue)}
            </div>
            <input type="range"
                   min={min}
                   max={max}
                   value={value}
                   step={step}
                   onInput={(event) => {
                       onSliderChange(event)
                       if(onInput) onInput(event)
                   }}
                   css-background={getGradientBackground(value, min, max)}
            />
        </div>
    )
}

export default VSlider;