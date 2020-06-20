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

function VSpinner(
    {
        big = false,
        mid = false,
        white = false,
        background = false,
        loaderRef,
        determinate = false,
        progress = 0,
        onClick,
        paused = false,
        color,
        id,
        strokeWidth,
    }, slot
) {
    const wrapperClassName = {
        "v-spinner": true,
        "background": background,
        "big": big,
        "mid": mid,
        "paused": paused

    }

    const progressClassName = {
        "new-progress": true,
        "determinate": determinate,
        "white": white
    }

    const size = big ? 170 : mid ? 118.5 : 79

    const start = big ? 310 : mid ? 241 : 160; //just randomly got this numbers

    const smallSvg = {
        cx: 16,
        cy: 16, 
        r: 12.8
    }

    const midSvg = {
        cx: 24,
        cy: 24, 
        r: 19.200000000000003
    }

    const bigSvg = {
        cx: 32,
        cy: 32, 
        r: 27.6
    }

    let svgSize = big ? bigSvg : mid ? midSvg : smallSvg;

    let offset = start + progress * size; //Safari doesn't support negative offset

    return (
        <div id={id} className={wrapperClassName} ref={loaderRef} onClick={onClick}>
            {slot && <div className="slot">{slot}</div>}
            <svg className={progressClassName}>
                {!determinate ?
                    <circle css-stroke-width={strokeWidth} className="path"
                            css-stroke={color} cx={svgSize.cx} cy={svgSize.cy} r={svgSize.r}/> :
                    <circle css-stroke-width={strokeWidth} className="path"
                            css-stroke-dashoffset={offset}
                            css-stroke={color} cx={svgSize.cx} cy={svgSize.cy} r={svgSize.r}/>}
            </svg>
        </div>
    )
}

export default VSpinner