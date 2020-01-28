import type {VRAttrs} from "../types/types"

const patchAttrs = ($el: Element, newAttrs: VRAttrs) => {

    if ($el.nodeType !== Node.TEXT_NODE) {
        for (const [k, v] of Object.entries(newAttrs)) {
            if (v === undefined) {
                $el.removeAttribute(k)
            } else if ($el.getAttribute(k) !== v) {
                $el.setAttribute(k, String(v))
            }
        }

        // $ignore
        for (const name of $el.getAttributeNames()) {
            if (name !== "data-component-id" && newAttrs[name] === undefined) {
                $el.removeAttribute(name)
            }
        }
    }
}

export default patchAttrs