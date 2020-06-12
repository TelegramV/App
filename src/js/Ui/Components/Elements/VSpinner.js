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
        white = false,
        full = false,
        show = true,
        background = false,
        loaderRef,
        determinate = false,
        progress = 0,
        onClick,
        paused = false,
        color,
        id,
    }, slot
) {
    const wrapperClassName = {
        // "full-size-loader": true,
        // "height": !full,
        "v-spinner": true,
        "background": background,
        "big": big,
        "paused": paused

    }


    const progressClassName = {
        "new-progress": true,
        "determinate": determinate,
        "white": white
    }

    const size = big ? 170 : 79
    return <div id={id} className={wrapperClassName} ref={loaderRef} onClick={onClick}>
        {slot ? <div className="slot">{slot}</div> : ""}
        <svg className={progressClassName}>
            {!determinate ?
                <circle className="path"/> :
                <circle className="path" css-stroke-dashoffset={(1 - progress) * -size} css-stroke={color}/>}
        </svg>
    </div>

    // <div showIf={show} ref={loaderRef} id={id} className={wrapperClassName}>
    //     {
    //         background ? (
    //             <div className="progress-background">
    //                 <progress className={progressClassName}/>
    //             </div>
    //         ) : (
    //             <progress className={progressClassName}/>
    //         )
    //     }
    // </div>
}

export default VSpinner