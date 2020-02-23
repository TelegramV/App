/**
 * (c) Telegram V
 */

import type {VRAttrs} from "../types/types"

const ignoringAttributes = new Set([
    "style",
    // "class"
])

const patchAttrs = ($el: Element, newAttrs: VRAttrs) => {

    if ($el.nodeType !== Node.TEXT_NODE) {
        for (const [k, v] of Object.entries(newAttrs)) {
            if (ignoringAttributes.has(k)) {
                continue
            }

            if (v === undefined) {
                $el.removeAttribute(k)
            } else if ($el.getAttribute(k) !== v) {
                $el.setAttribute(k, String(v))
            }
        }

        for (const name of $el.getAttributeNames()) {
            if (ignoringAttributes.has(name)) {
                continue
            }

            if (newAttrs[name] === undefined) {
                $el.removeAttribute(name)
            }
        }
    }
}

export default patchAttrs