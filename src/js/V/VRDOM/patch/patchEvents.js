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