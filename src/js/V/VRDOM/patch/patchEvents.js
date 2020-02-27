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

import type {VREvents} from "../types/types"
import {initElement} from "../render/renderElement"

const patchEvents = ($node: HTMLElement | Node, newEvents: VREvents) => {
    initElement($node)

    for (const k of $node.__v.patched_events) {
        if (!newEvents[k]) {
            $node[`on${k}`] = undefined
            $node.__v.patched_events.delete(k)
        }
    }

    for (const [k, v] of Object.entries(newEvents)) {
        if (!v) {
            $node[`on${k}`] = undefined
            $node.__v.patched_events.delete(k)
        } else if ($node[`on${k}`] !== v) {
            $node[`on${k}`] = v
            $node.__v.patched_events.add(k)
        }
    }
}

export default patchEvents