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
        paused = false
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
    return <div className={wrapperClassName} ref={loaderRef} onClick={onClick}>
        {slot ? <div className="slot">{slot}</div> : ""}
        <svg className={progressClassName}>
            {!determinate ?
                <circle className="path"/> :
                <circle className="path" css-stroke-dashoffset={(1 - progress) * -size}/>}
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