/**
 * (c) Telegram V
 */

import type {VRAttrs} from "../types/types"

const patchStyle = ($el: HTMLElement, style: VRAttrs) => {

    if (typeof $el.style === "object") {
        if (!$el.style.__patched) {
            $el.style.__patched = new Set()
        }

        for (const [k, v] of Object.entries(style)) {
            if (v === undefined) {
                $el.style.removeProperty(k)
                $el.style.__patched.delete(k)
            } else if ($el.style.getPropertyValue(k) !== v) {
                $el.style.setProperty(k, v)
                $el.style.__patched.add(k)
            }
        }

        for (const k of $el.style.__patched) {
            if (style[k] === undefined) {
                $el.style.removeProperty(k)
                $el.style.__patched.delete(k)
            }
        }
    }
}

export default patchStyle