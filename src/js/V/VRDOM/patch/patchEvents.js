/**
 * (c) Telegram V
 */

import type {VREvents} from "../types/types"

const patchEvents = ($node: Element | Node, newEvents: VREvents) => {
    if (!$node.__events) {
        $node.__events = new Set()
    }

    for (const k of $node.__events) {
        if (!newEvents[k]) {
            $node[`on${k}`] = undefined
            $node.__events.delete(k)
        }
    }

    for (const [k, v] of newEvents.entries()) {
        if ($node[`on${k}`] !== v) {
            $node[`on${k}`] = v
        }
        $node.__events.add(k)
    }
}

export default patchEvents