/**
 * (c) Telegram V
 */

import type {VREvents} from "../types/types"

const patchEvents = ($node: Element | Node, newEvents: VREvents) => {
    for (const [k, v] of newEvents.entries()) {
        if ($node[`on${k}`] !== v) {
            $node[`on${k}`] = v
        }
    }
}

export default patchEvents