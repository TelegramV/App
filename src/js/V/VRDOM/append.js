/**
 * (c) Telegram V
 */

import VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import {vrdom_resolveMount} from "./mount"
import vrdom_render from "./render/render"
import VF from "../VFramework"

/**
 * Appends VRNode to Real DOM Element children
 *
 * @param node
 * @param $el
 * @param props
 */
const vrdom_append = (node: VRNode, $el: Element, props?: VRRenderProps) => {
    const $mounted = $el.appendChild(vrdom_render(node, props))

    if ($mounted.nodeType === Node.TEXT_NODE) {
        VF.plugins.forEach(plugin => plugin.textMounted($mounted))
    } else {
        VF.plugins.forEach(plugin => plugin.elementMounted($mounted))
    }

    // $ignore
    vrdom_resolveMount($mounted)

    return $mounted
}

export default vrdom_append
