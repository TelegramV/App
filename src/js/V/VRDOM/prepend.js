/**
 * (c) Telegram V
 */

import VF from "../VFramework"
import type VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import vrdom_render from "./render/render"
import {vrdom_resolveMount} from "./mount"

/**
 * Prepends VRNode to Real DOM Element children
 *
 * @param node
 * @param $el
 * @param props
 */
function vrdom_prepend<T: Element>(node: VRNode, $el: T, props?: VRRenderProps): T {
    const $node = vrdom_render(node, props)

    $el.prepend($node)

    if ($node.nodeType === Node.TEXT_NODE) {
        VF.plugins.forEach(plugin => plugin.textMounted($node))
    } else {
        VF.plugins.forEach(plugin => plugin.elementMounted($node))
    }

    vrdom_resolveMount($node)

    // $ignore
    return $node
}

export default vrdom_prepend
