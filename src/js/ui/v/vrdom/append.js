import VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import {vrdom_mount_resolveComponentMounted} from "./mount"
import vrdom_render from "./render/render"
import V from "../VFramework"

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
        V.plugins.forEach(plugin => plugin.textMounted($mounted))
    } else {
        V.plugins.forEach(plugin => plugin.elementMounted($mounted))
    }

    // $ignore
    vrdom_mount_resolveComponentMounted($mounted)

    return $mounted
}

export default vrdom_append
